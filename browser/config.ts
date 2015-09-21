import * as fs from 'fs';

export default class Config {
    private cache: ConfigJSON;

    constructor(public path: string) {
        this.cache = null;
    }

    private defaultConfig(): ConfigJSON {
        if (process.platform === 'win32') {
            return {
                mode: 'isolated',
                width: 800,
                height: 1000,
                languages: [],
                icon_color: 'white',
                proxy: null,
                hot_key: '',
                auto_start: false,
            };
        } else {
            return {
                mode: 'menubar',
                width: 400,
                height: 400,
                languages: [],
                icon_color: 'black',
                proxy: null,
                hot_key: '',
                auto_start: false,
            };
        }
    }

    updateConfig(key: string, value: ConfigValue) {
        this.cache[key] = value;
        fs.writeFile(this.path, JSON.stringify(this.cache, null, 2));
    }

    load(): ConfigJSON {
        if (this.cache !== null) {
            return this.cache;
        }

        try {
            this.cache = <ConfigJSON>JSON.parse(fs.readFileSync(this.path, {encoding: 'utf8'}));
            const default_config = this.defaultConfig();
            for (const key in default_config) {
                if (this.cache[key] === undefined) {
                    this.cache[key] = default_config[key];
                }
            }
        }
        catch (_) {
            this.cache = this.defaultConfig();
            fs.writeFile(this.path, JSON.stringify(this.cache, null, 2));
        }

        return this.cache;
    }
}
