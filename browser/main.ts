import * as path from 'path';
import TrendFetcher from './trend-fetcher';
import * as ipc from 'ipc';

const normal_icon = path.join(__dirname, '..', '..', 'resource', 'image', 'graph.png');
const notified_icon =path.join(__dirname, '..', '..', 'resource', 'image', 'graph_notify.png');

const menuConfig = {
    dir: __dirname,
    index: 'file://' + path.join(__dirname, '..', '..', 'index.html'),
    icon: path.join(__dirname, '..', '..', 'resource', 'image', 'graph.png'),
    // width: 1000,
    // height: 750,
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
