import { List, Map } from 'immutable';
import { FullRepository } from 'github-trend';

export type TrendsState = Map<string, List<FullRepository>>;

export interface ConfigState {
    langs: List<string>;
}

export default interface State {
    trends: TrendsState;
    config: ConfigState;
};
