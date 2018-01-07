import { combineReducers } from 'redux';
import trends from './trends';
import config from './config';

const root = combineReducers({
    trends,
    config,
});

export default root;
