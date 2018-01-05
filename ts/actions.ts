import { FullRepository } from 'github-trend';

export type Action = {
    readonly type: 'TrendsFetched';
    readonly name: string;
    readonly trends: FullRepository[];
};

export function trendsFetched(name: string, trends: FullRepository[]): Action {
    return {
        type: 'TrendsFetched',
        name,
        trends,
    }
}