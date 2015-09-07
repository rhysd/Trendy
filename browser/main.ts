import * as path from 'path';
import TrendFetcher from './trend-fetcher';
import * as ipc from 'ipc';

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
});
