import {ActionKind} from './constants';
import Dispatcher from './dispatcher';

export function updateRepos(repos) {
    Dispatcher.dispatch({
        type: ActionKind.UpdateRepos,
        repos: repos
    });
}
