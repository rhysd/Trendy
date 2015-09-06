// XXX:
// Conflict with the name TypeScript standard lib.d.ts defined
//    https://github.com/maxogden/menubar/issues/37
//
// declare module "menubar" {
//     function create(opts: Object): any;
//     export = create;
// }

declare class MenuBar implements NodeJS.EventEmitter {
    on(event: string, listener: Function): MenuBar;
    once(event: string, listener: Function): MenuBar;
    removeListener(event: string, listener: Function): MenuBar;
    removeAllListeners(event?: string): MenuBar;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    emit(event: string, ...args: any[]): boolean;
    showWindow(): void;
    hideWindow(): void;
    addListener(event: string, listener: Function): MenuBar;
    tray: GitHubElectron.Tray;
    app: GitHubElectron.App;
    window: GitHubElectron.BrowserWindow;
}

