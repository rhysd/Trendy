import {ActionKind} from './constants';
import Dispatcher from './dispatcher';

export interface ActionType {
    type: ActionKind;
    repos?: Object
}

export function updateRepos(repos: Object) {
    Dispatcher.dispatch({
        type: ActionKind.UpdateRepos,
        repos: repos,
    });
}
