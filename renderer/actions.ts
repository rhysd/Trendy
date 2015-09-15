import {ActionKind} from './constants';
import Dispatcher from './dispatcher';

export interface ActionType {
    type: ActionKind;
    repos?: OrderedReposList;
    lang?: string;
    full_name?: string;
    url?: string;
    reason?: string;
}

export function updateRepos(repos: OrderedReposList) {
    Dispatcher.dispatch({
        type: ActionKind.UpdateRepos,
        repos: repos,
    });
}

export function checkUnread(lang: string, full_name: string) {
    Dispatcher.dispatch({
        type: ActionKind.CheckUnread,
        lang: lang,
        full_name: full_name,
    });
}

export function openURL(url: string) {
    Dispatcher.dispatch({
        type: ActionKind.OpenURL,
        url: url,
    });
}

export function notifyScrapingFailed(reason: string) {
    Dispatcher.dispatch({
        type: ActionKind.NotifyScrapingFailed,
        reason: reason,
    });
}
