interface ConfigJSON {
    mode: string;
    width: number;
    height: number;
    languages: string[];
    icon_color: string;
    proxy: string;
    [key: string]: string | number | string[];
}

declare class Config {
    constructor(path: string);
    load(): ConfigJSON;
}

