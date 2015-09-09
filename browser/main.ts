import * as path from 'path';
import * as ipc from 'ipc';
import * as app from 'app';
import TrendFetcher from './trend-fetcher';
import Config from './config';

const normal_icon = path.join(__dirname, '..', '..', 'resource', 'trayicon', 'graph.png');
const notified_icon =path.join(__dirname, '..', '..', 'resource', 'trayicon', 'graph_notify.png');

const menuConfig = {
    dir: __dirname,
    index: 'file://' + path.join(__dirname, '..', '..', 'index.html'),
    icon: normal_icon,
    preloadWindow: true,
};
const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');

global.config = new Config(path.join(app.getPath('userData'), 'config.json'));

let menu_window: MenuBar = require('menubar')(menuConfig);

menu_window.on('after-create-window', () => {
    menu_window.tray.setToolTip('Show Menu Window');
    let fetcher = new TrendFetcher(menu_window.window.webContents);
    ipc.on('renderer-ready', () => fetcher.start());
    ipc.on('force-update-repos', () => fetcher.doScraping());
    ipc.on('tray-icon-normal', () => menu_window.tray.setImage(normal_icon));
    ipc.on('tray-icon-notified', () => menu_window.tray.setImage(notified_icon));
});
