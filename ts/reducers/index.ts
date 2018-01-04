import { combineReducers } from 'redux';
import trends from './trends';

const root = combineReducers({
    trends,
});

export default root;
