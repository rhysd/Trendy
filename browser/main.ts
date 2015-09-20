import * as path from 'path';
import * as ipc from 'ipc';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';
import * as Tray from 'tray';
import * as Menu from 'menu';
import * as shortcut from 'global-shortcut';
import TrendFetcher from './trend-fetcher';
import Config from './config';
import Auth from './authentication';


global.config = new Config(path.join(app.getPath('userData'), 'config.json'));
const app_config = global.config.load();

const normal_icon = path.join(__dirname, '..', '..', 'resource', 'trayicon', app_config.icon_color === 'white' ? 'graph_white.png' : 'graph.png');
const notified_icon =path.join(__dirname, '..', '..', 'resource', 'trayicon', 'graph_notify.png');
const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');
const auth = new Auth(path.join(app.getPath('userData'), 'tokens.json'));

function setupHotkey(window: GitHubElectron.BrowserWindow) {
}

function doLogin(fetcher: TrendFetcher, sender: GitHubElectron.WebContents) {
    auth.login().then((token: string) => {
        fetcher.setToken(token);
        fetcher.doScraping();
    }).catch(err => sender.send('fetch-error', 'Login failed! Please try again after.', err.message))
}

function startMenubarApp() {
    let menuConfig = {
        dir: __dirname,
        index: index_html,
        width: app_config.width,
        height: app_config.height,
        icon: normal_icon,
        preloadWindow: true,
    };

    let menu_window: MenuBar = require('menubar')(menuConfig);

    menu_window.on('after-create-window', () => {
        menu_window.tray.setToolTip('Show Menu Window');
        let fetcher = new TrendFetcher(
                menu_window.window.webContents,
                app_config.languages,
                app_config.proxy || undefined
            );
        auth.getToken().then((access_token: string) => {
            fetcher.setToken(access_token);
        });

        ipc.on('renderer-ready', () => fetcher.start());
        ipc.on('force-update-repos', () => fetcher.doScraping());
        ipc.on('tray-icon-normal', () => menu_window.tray.setImage(normal_icon));
        ipc.on('tray-icon-notified', () => menu_window.tray.setImage(notified_icon));
        ipc.on('start-github-login', () => doLogin(fetcher, menu_window.window.webContents));

        if (app_config.hot_key !== '') {
            shortcut.register(
                    app_config.hot_key,
                    () => menu_window.window.isVisible() ? menu_window.hideWindow() : menu_window.showWindow()
                );
        }
    });
}

function startIsolatedApp() {
    app.on('ready', () => {
        let win = new BrowserWindow({
            width: app_config.width,
            height: app_config.height,
        });

        win.loadUrl(index_html);

        let fetcher = new TrendFetcher(
                win.webContents,
                app_config.languages,
                app_config.proxy || undefined
            );
        auth.getToken().then((access_token: string) => {
            fetcher.setToken(access_token);
        });

        let app_icon = new Tray(normal_icon);
        const context_menu = Menu.buildFromTemplate([
            {
                label: 'Show Window',
                click: () => win.show(),
            },
            {
                label: 'Force Update',
                click: () => fetcher.doScraping(),
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => app.quit(),
            }
        ]);
        app_icon.setContextMenu(context_menu);

        ipc.on('renderer-ready', () => fetcher.start());
        ipc.on('force-update-repos', () => fetcher.doScraping());
        ipc.on('tray-icon-normal', () => app_icon.setImage(normal_icon));
        ipc.on('tray-icon-notified', () => app_icon.setImage(notified_icon));
        ipc.on('start-github-login', () => doLogin(fetcher, win.webContents));

        if (app_config.hot_key !== '') {
            shortcut.register(
                    app_config.hot_key,
                    () => win.isVisible() ? win.hide() : win.show()
                );
        }
    });
}

if (app_config.mode === 'menubar') {
    startMenubarApp();
} else {
    startIsolatedApp();
}
app.on('before-quit', () => shortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
