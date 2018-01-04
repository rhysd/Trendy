import { createStore, Dispatch as ReduxDispatch } from 'redux';
import reducer from './reducers';
import State from './state';

const Store = createStore(reducer);
export default Store;

export type Dispatch = ReduxDispatch<State>;
