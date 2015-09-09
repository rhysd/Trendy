interface ConfigJSON {
    mode: string;
    width: number;
    height: number;
    languages: string[];
    [key: string]: any;
}

declare class Config {
    constructor(path: string);
    load(): ConfigJSON;
}

