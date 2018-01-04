import { List, Map } from 'immutable';
import { FullRepository } from 'github-trend';

export type TrendsState = Map<string, List<FullRepository>>;

export default interface State {
    trends: TrendsState;
}
