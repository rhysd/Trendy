import * as GHT from 'github-trend'
import * as fs from 'fs';

export default class TrendFetcher {
    client: GHT.Client;

    constructor(private renderer: GitHubElectron.WebContents, proxy?: string) {
        this.client = new GHT.Client({proxy: proxy});
        this.stopped = true;
    }

    start() {
        this.stopped = false;

        // TODO: Temporary
        this.doScraping();
        const poll = () => {
            if (this.stopped) {
                return;
            }
            console.log('Update!: ' + new Date(Date.now()).toLocaleString());
            this.doScraping();
            setTimeout(poll, 1800000);
        }
        setTimeout(poll, 1800000);
    }

    doScraping() {
        // TODO: Temporary
        fs.readFile('test.json', {encoding: 'utf8'}, (err, data) => {
            if (err) {
                const trendings = this.client.fetchTrendings(['']).then(repos => {
                    this.sendToRenderer(repos);
                    fs.writeFile('test.json', JSON.stringify(repos, null, 2));
                    console.log('sent!');
                });
            } else {
                this.sendToRenderer(JSON.parse(data));
            }
        });
    }

    sendToRenderer(repos: Object): void {
        console.log('Fetcher send result: ' + Object.keys(repos).length);
        this.renderer.send('repositories', repos);
    }

    stop(): void {
        this.stopped = true;
    }
}
