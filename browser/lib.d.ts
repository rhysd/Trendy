/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./menubar.d.ts" />
/// <reference path="./github-trend.d.ts" />
/// <reference path="./Trendy.d.ts" />

declare module NodeJS {
    interface Global {
        config: Config;
    }
}
