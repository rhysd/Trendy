import * as path from 'path';

console.log('file://' + path.join(__dirname, '..', 'index.html'));
var menuConfig = {
    dir: __dirname,
    index: 'file://' + path.join(__dirname, '..', '..', 'index.html'),
    // TODO: icon: path.join(__dirname, '..', 'images', 'sc_' + config.icon_type + '_24x12.png'),
    // width: 1000,
    // height: 750,
    preloadWindow: true,
};

let menu_window: MenuBar = require('menubar')(menuConfig);

menu_window.on('after-create-window', () => {
    menu_window.tray.setToolTip('Show Menu Window');
});
