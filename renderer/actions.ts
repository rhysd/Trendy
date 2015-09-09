import {ActionKind} from './constants';
import Dispatcher from './dispatcher';

export interface ActionType {
    type: ActionKind;
    repos?: Object;
    lang?: string;
    full_name?: string;
}

export function updateRepos(repos: Object) {
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
