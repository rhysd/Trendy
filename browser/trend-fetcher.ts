import * as GHT from 'github-trend'
import * as fs from 'fs';
import * as path from 'path';
import * as app from 'app';
import invokeLangPicker from './lang-picker';

const POLLING_INTERVAL = 3600000; // 1 hour
const TEST_FILE_PATH = path.join(app.getPath('userData'), 'test.json');

export default class TrendFetcher {
    client: GHT.Client;
    stopped: boolean;

    constructor(private renderer: GitHubElectron.WebContents, public langs: string[], proxy?: string) {
        this.client = new GHT.Client({proxy: proxy});
        this.stopped = true;
        for (const i in langs) {
            langs[i] = langs[i].toLowerCase();
            if (langs[i] === 'all') {
                langs[i] = '';
            }
        }
    }

    setToken(token: string) {
        this.client.token = token;
    }

    start() {
        this.stopped = false;

        this.client.scraper.scrapeLanguageColors().then(colors => {
            this.renderer.send('lang-colors', colors);

            if (this.langs.length === 0) {
                return invokeLangPicker(colors);
            } else {
                return this.langs
            }
        }).then((langs: string[]) => {
            this.langs = langs;
            global.config.updateConfig('languages', langs);
            this.doScraping();
        });

        const do_polling = () => {
            if (this.stopped) {
                return;
            }
            console.log('Update!: ' + new Date(Date.now()).toLocaleString());
            this.doScraping();
            setTimeout(do_polling, POLLING_INTERVAL);
        }
        setTimeout(do_polling, POLLING_INTERVAL);
    }

    doScraping() {
        fs.readFile(TEST_FILE_PATH, {encoding: 'utf8'}, (err, data) => {
            if (err) {
                this.client.fetchTrendingsWithReadme(this.langs).then(repos => {
                    // Note:
                    // Replace language '' with readable name 'all languages'
                    if (repos[''] !== undefined) {
                        repos['all languages'] = repos[''];
                        delete repos[''];
                    }
                    this.sendToRenderer(repos);
                }).catch((err: Error) => {
                    console.log('doScraping: error: ' + err.message);
                    if (!this.client.token) {
                        this.renderer.send('fetch-error', 'API-limit-exceeded', err.message);
                    } else {
                        this.renderer.send('fetch-error', 'Something is wrong...', err.message);
                    }
                });
            } else {
                this.sendToRenderer(JSON.parse(data));
            }
        });
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
