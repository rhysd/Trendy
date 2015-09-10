import * as Action from './actions';

const ipc: ElectronRenderer.InProcess = global.require('ipc');

export default class RepoReceiver {
    constructor() {
        console.log('receiver start');
        ipc.on('repositories', repos => Action.updateRepos(repos));
        ipc.send('renderer-ready');
    }
}
