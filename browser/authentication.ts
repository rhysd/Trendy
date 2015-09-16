import * as BrowserWindow from 'browser-window';
import * as fs from 'fs';
import * as request from 'request';
import * as querystring from 'querystring';

const CLIENT_ID = '582b0dbcdf7ee3de467d';
const CLIENT_SECRET = 'b2723dfdc53728bff30f07912698237718ba82a6';

export default class Authentication {
    constructor(public tokens_path: string) {
    }

    authenticate(code: string) {
        return new Promise((resolve, reject) => {
            console.log('code: ' + code);
            request.post({
                    url: 'https://github.com/login/oauth/access_token',
                    form: {
                        client_id: '582b0dbcdf7ee3de467d',
                        client_secret: 'b2723dfdc53728bff30f07912698237718ba82a6',
                        code: code,
                    },
                },
                (err, res, body) => {
                    if (err) {
                        console.log('POST code error: ' + err.message);
                        reject(err);
                        return;
                    }

                    if (res.statusCode !== 200) {
                        console.log('POST code error: ' + res.statusCode);
                        reject(new Error('Invalid response: ' + res.statusCode));
                        return;
                    }

                    const parsed = querystring.parse(body);
                    if (!parsed.access_token) {
                        console.log('Body parsing error: ' + body);
                        reject(new Error('Invalid body: ' + body));
                    }

                    console.log('Login: Success!');

                    fs.writeFile(this.tokens_path, JSON.stringify({github: parsed.access_token}), {encoding: 'utf8'});

                    resolve(parsed.access_token);
                }
            );
        });
    }

    login() {
        return new Promise((resolve, reject) => {
            let auth_win = new BrowserWindow({
                width: 800,
                height: 600,
                'node-integration': false,
                'web-preferences': {
                    'node-integration': false,
                    'web-security': true,
                }
            });

            auth_win.on('close', function(){ auth_win = null; });

            auth_win.webContents.on('will-navigate', (event: Event, url: string) => {
                event.preventDefault();

                const raw_code = /code=([^&]*)/.exec(url) || null;
                const code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
                const error = /\?error=(.+)$/.exec(url);

                if (error) {
                    console.log('login failed!');
                    setTimeout(() => auth_win.close(), 0);
                    reject(error);
                } else if (code) {
                    setTimeout(() => auth_win.close(), 0);
                    resolve(code);
                }
            });

            auth_win.webContents.on('did-finish-load', (event: Event) => {
                if (auth_win.webContents.getUrl() === 'https://example.com') {
                    setTimeout(() => auth_win.close(), 0);
                    reject(new Error('Already authorized.  Please revoke application access in your GitHub settings page.'));
                }
            });

            const url = 'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID;
            auth_win.loadUrl(url);
        }).then(this.authenticate.bind(this));
    }

    getToken() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.tokens_path, {encoding: 'utf8'}, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try { resolve(JSON.parse(data).github as string); }
                    catch(e) { reject(e); }
                }
            });
        });
    }
}
