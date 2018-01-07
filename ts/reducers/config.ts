import { List } from 'immutable';
import { ConfigState } from '../state';
import { Action } from '../actions';

const DefaultConfig = {
    langs: List(['all']),
};

export default function config(state: ConfigState = DefaultConfig, action: Action): ConfigState {
    switch (action.type) {
        default:
            return state;
    }
}
