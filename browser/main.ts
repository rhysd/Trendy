import * as path from 'path';
import * as ipc from 'ipc';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';
import * as Tray from 'tray';
import * as Menu from 'menu';
import TrendFetcher from './trend-fetcher';
import Config from './config';

const normal_icon = path.join(__dirname, '..', '..', 'resource', 'trayicon', 'graph.png');
const notified_icon =path.join(__dirname, '..', '..', 'resource', 'trayicon', 'graph_notify.png');
const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');

global.config = new Config(path.join(app.getPath('userData'), 'config.json'));
const app_config = global.config.load();

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
        let fetcher = new TrendFetcher(menu_window.window.webContents);
        ipc.on('renderer-ready', () => fetcher.start());
        ipc.on('force-update-repos', () => fetcher.doScraping());
        ipc.on('tray-icon-normal', () => menu_window.tray.setImage(normal_icon));
        ipc.on('tray-icon-notified', () => menu_window.tray.setImage(notified_icon));
    });
}

function startIsolatedApp() {
    let win = new BrowserWindow({
        width: app_config.width,
        height: app_config.height,
    });

    win.loadUrl(index_html);

    win.on('closed', function(){
        win = null;
    });

    let fetcher = new TrendFetcher(win.webContents);
    ipc.on('renderer-ready', () => fetcher.start());
    ipc.on('force-update-repos', () => fetcher.doScraping());

    let app_icon = new Tray(normal_icon);
    const context_menu = Menu.buildFromTemplate([
        {
            label: 'Show Window',
            click: () => win.show(),
        },
        {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => app.quit(),
        }
    ]);
    app_icon.setContextMenu(context_menu);
    ipc.on('tray-icon-normal', () => app_icon.setImage(normal_icon));
    ipc.on('tray-icon-notified', () => app_icon.setImage(notified_icon));
}

app.on('ready', () => app_config.mode === 'menubar' ? startMenubarApp() : startIsolatedApp());
