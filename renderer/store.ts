import {EventEmitter} from 'events';
import Dispatcher from './dispatcher';
import {ActionKind} from './constants';
import {ActionType} from './actions';

const USER_DIR = global.require('remote').require('app').getPath('userData');
const DATA_FILE_PATH = global.require('path').join(USER_DIR, 'repos.json');
const fs = global.require('fs');
const ipc: ElectronRenderer.InProcess = global.require('ipc');

class RepoStore extends EventEmitter {
    unread_repos: UnorderedreposList;
    current_repos: OrderedReposList;
    all_repos: UnorderedreposList;
    dispatch_token: string;
    last_update: number;
    lang_colors: {[lang: string]: string};

    loadStorage(name: string) {
        const saved = window.localStorage.getItem(name);
        if (saved) {
            return JSON.parse(saved);
        } else {
            return {};
        }
    }

    saveToStorage(name) {
        window.localStorage.setItem(name, JSON.stringify(this[name]));
    }

    saveAllToStorage() {
        this.saveToStorage('unread_repos');
        this.saveToStorage('current_repos');
        this.saveToStorage('all_repos');
    }

    constructor() {
        super();

        this.unread_repos = this.loadStorage('unread_repos');
        this.current_repos = this.loadStorage('current_repos');
        this.all_repos = this.loadStorage('all_repos');
        this.last_update = 0;
        this.lang_colors = null;
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

    getLastUpdateTime() {
        if (this.last_update === 0) {
            return '';
        }

        return 'Updated at ' + new Date(this.last_update).toLocaleTimeString();
    }

    getAllColors() {
        return this.lang_colors;
    }

    getLangColor(lang: string) {
        if (this.lang_colors === null) {
            return null;
        }
        return this.lang_colors[lang];
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

function _updateRepos(new_repos: OrderedReposList) {
    store.current_repos = new_repos;

    for (const lang in new_repos) {
        for (const repo of new_repos[lang]) {
            if (store.all_repos[lang] === undefined) {
                store.all_repos[lang] = {};
            }

            if (store.all_repos[lang][repo.full_name] === undefined) {
                if (store.unread_repos[lang] === undefined) {
                    store.unread_repos[lang] = {};
                }
                console.log('Added to UNREAD: ' + repo.full_name);
                store.unread_repos[lang][repo.full_name] = repo;
            }

            store.all_repos[lang][repo.full_name] = repo;
        }
    }

    store.last_update = Date.now();
    store.emit('updated');

    if (Object.keys(store.unread_repos).length === 0) {
        ipc.send('tray-icon-normal');
    } else {
        ipc.send('tray-icon-notified');
    }

    setImmediate(() => store.saveAllToStorage());
}

function _unreadRepo(lang: string, full_name: string) {
    if (store.unread_repos[lang] === undefined) {
        console.log('Action: CheckUnread: Invalid language: ' + lang);
        return;
    }

    if (full_name === '*') {
        delete store.unread_repos[lang];
        store.emit('updated');
        return;
    }

    if (store.unread_repos[lang][full_name] === undefined) {
        console.log('Action: CheckUnread: Invalid repo: ' + full_name);
        return;
    }

    delete store.unread_repos[lang][full_name];
    if (Object.keys(store.unread_repos[lang]).length === 0) {
        delete store.unread_repos[lang];
    }
    store.emit('updated');
    setImmediate(() => store.saveToStorage('unread_repos'));
}

store.dispatch_token = Dispatcher.register((action: ActionType) => {
    switch(action.type) {
    case ActionKind.UpdateRepos:
        _updateRepos(action.repos);
        break;

    case ActionKind.CheckUnread:
        _unreadRepo(action.lang, action.full_name);
        break;

    case ActionKind.OpenURL:
        store.emit('url-clicked', action.url);
        break;

    case ActionKind.NotifyScrapingFailed:
        store.emit('scraping-failed', action.reason);
        break;

    case ActionKind.SetLangColors:
        store.lang_colors = action.colors;
        break;

    default:
        break;
    }
});
