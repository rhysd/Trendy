import {EventEmitter} from 'events';
import Dispatcher from './dispatcher';
import {ActionKind} from './constants';

class RepoStore extends EventEmitter {
    constructor() {
        super();
        this.repos = [];
    }

    getAll() {
        return this.repos;
    }
}

let store = new RepoStore();
export default store;

function _updateRepos(new_repos) {
    // TODO: Compute difference between previous and current, add only new commers?
    Array.prototype.push.apply(store.repos, new_repos);
    store.emit('updated');
}

store.dispatch_token = Dispatcher.register(action => {
    switch(action.type) {
    case ActionKind.UpdateRepos: {
        _updateRepos(action.repos);
    }

    default:
        break;
    }
});

