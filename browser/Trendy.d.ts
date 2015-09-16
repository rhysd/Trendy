declare type ConfigValue = string | number | string[];
interface ConfigJSON {
    mode: string;
    width: number;
    height: number;
    languages: string[];
    icon_color: string;
    proxy: string;
    hot_key: string;
    [key: string]: ConfigValue;
}

declare class Config {
    constructor(path: string);
    load(): ConfigJSON;
    updateConfig(key: string, value: ConfigValue): void;
}

