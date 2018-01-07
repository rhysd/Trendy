import { Scraper } from 'github-trend';
import * as A from '../actions';
import Store from '../store';
import TestReposAll from './test-trend-all';
import TestReposGo from './test-trend-go';
import TestReposRust from './test-trend-rust';
import TestReposVim from './test-trend-vim';

const scraper = new Scraper();

export function scrapeTrends(lang: string) {
    return scraper.scrapeTrendingReposFullInfo(lang).then(repos => Store.dispatch(A.trendsFetched(lang, repos)));
}

// TEMPORARY: For tests
export function scrapeDummyTrends() {
    setTimeout(() => Store.dispatch(A.trendsFetched('', TestReposAll)), 0);
    setTimeout(() => Store.dispatch(A.trendsFetched('rust', TestReposRust)), 50);
    setTimeout(() => Store.dispatch(A.trendsFetched('go', TestReposGo)), 500);
    setTimeout(() => Store.dispatch(A.trendsFetched('vim', TestReposVim)), 2000);
}
