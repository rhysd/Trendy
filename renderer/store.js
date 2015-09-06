import {EventEmitter} from 'events';
import Dispatcher from './dispatcher';
import {ActionKind} from './constants';

class RepoStore extends EventEmitter {
    constructor() {
        super();
        this.unread_repos = {};
        this.current_repos = {};
        this.all_repos = {};
    }

    getAllRepos() {
        return this.all_repos;
    }

    getCurrentRepos() {
        return this.current_repos;
    }

    getUnreadRepos() {
        return this.unread_repos;
    }
}

let store = new RepoStore();
export default store;

// Use array to preseve ranking order
//
// type LangName = string;
// type RepoName = string;
// type Repository = Object;
//
// new_repos, unread_repos: Map<LangName, Map<RepoName, Repository>>
// current_repos: Map<LangName, Repository[]>

function _updateRepos(new_repos) {
    store.current_repos = new_repos;

    for (const lang in new_repos) {
        for (const repo of new_repos[lang]) {
            if (store.all_repos[lang] === undefined) {
                store.all_repos[lang] = {};
            }

            if (store.all_repos[lang][repo.full_name] === undefined) {
                if (store.current_repos[lang] === undefined) {
                    store.current_repos[lang] = {};
                }
                store.current_repos[lang][repo.full_name] = repo;
            }

            store.all_repos[lang][repo.full_name] = repo;
        }
    }
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

