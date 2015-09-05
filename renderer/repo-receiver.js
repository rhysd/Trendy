import * as Action from './actions';

const ipc = global.require('ipc');
const remote = global.require('remote');

export default class RepoReceiver {
    constructor() {
        console.log('receiver start');
        ipc.on('repositories', repos => Action.updateRepos(repos));
        ipc.send('renderer-ready');
    }
}
