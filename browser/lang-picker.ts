import * as app from 'app';
import * as path from 'path';
import * as BrowserWindow from 'browser-window';
import * as ipc from 'ipc';

// Note: Ensure app is already ready
export default function invokeLangPicker(colors: {[lang: string]: string}) {
    let picker_win = new BrowserWindow({
        width: 600,
        height: 800,
    });

    picker_win.loadUrl('file://' + path.join(__dirname, '..', '..', 'langpicker.html'));
    picker_win.on('closed', function(){ picker_win = null; });

    picker_win.webContents.on('dom-ready', () => picker_win.webContents.send('lang-picker-data', colors));

    return new Promise(resolve => {
        ipc.on('picked-langs', (event: Event, langs: string[]) => {
            console.log('picked!: ' + JSON.stringify(langs));
            if (langs.length === 0) {
                langs.push('all');
            }
            resolve(langs.length === 0 ? ['all'] : langs);
        });
    }).catch(err => {
        console.log(err);
        return ['all']; // Fallback
    });
}
