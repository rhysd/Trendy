import * as GHT from 'github-trend'
import * as fs from 'fs';
import * as path from 'path';
import * as app from 'app';

const POLLING_INTERVAL = 3600000; // 1 hour
const TEST_FILE_PATH = path.join(app.getPath('userData'), 'test.json');

export default class TrendFetcher {
    client: GHT.Client;
    stopped: boolean;

    constructor(private renderer: GitHubElectron.WebContents, proxy?: string) {
        this.client = new GHT.Client({proxy: proxy});
        this.stopped = true;
    }

    start() {
        this.stopped = false;

        const do_polling = () => {
            if (this.stopped) {
                return;
            }
            console.log('Update!: ' + new Date(Date.now()).toLocaleString());
            this.doScraping();
            setTimeout(do_polling, POLLING_INTERVAL);
        }
        do_polling();
    }

    doScraping() {
        fs.readFile(TEST_FILE_PATH, {encoding: 'utf8'}, (err, data) => {
            if (err) {
                this.client.fetchTrendingsWithReadme(['']).then(repos => {
                    this.sendToRenderer(repos);
                }).catch((err: Error) => {
                    console.log('doScraping: error: ' + err.message);
                });
            } else {
                this.sendToRenderer(JSON.parse(data));
            }
        })
    }

    sendToRenderer(repos: {[key: string]: any}): void {
        console.log('sent from browser process:');
        for (const lang in repos) {
            console.log('  ' + lang + ': ' + repos[lang].length);
        }
        this.renderer.send('repositories', repos);
    }

    stop(): void {
        this.stopped = true;
    }
}
