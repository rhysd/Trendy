/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./github-repo.d.ts" />
/// <reference path="../browser/Trendy.d.ts" />

declare module NodeJS {
    interface Global {
        require(m: string): any;
    }
}
