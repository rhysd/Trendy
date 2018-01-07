import { Scraper } from 'github-trend';
import * as A from '../actions';
import Store from '../store';
import TestReposAll from './test-trend-all';

const scraper = new Scraper();

export function scrapeTrends(lang: string) {
    return scraper.scrapeTrendingReposFullInfo(lang).then(repos => Store.dispatch(A.trendsFetched(lang, repos)));
}

// TEMPORARY: For tests
export function scrapeDummyTrends() {
    setTimeout(() => Store.dispatch(A.trendsFetched('', TestReposAll)), 0);
}
