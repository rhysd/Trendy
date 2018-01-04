import { List, Map } from 'immutable';
import { Action } from '../actions';
import { TrendsState } from '../state';

export default function trends(state: TrendsState = Map(), action: Action): TrendsState {
    switch (action.type) {
        case 'TrendsFetched':
            return state.set(action.name, List(action.trends));
        default:
            return state;
    }
}
