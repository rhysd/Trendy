declare module 'github-trend' {
    export interface Repository {
        owner: string;
        name: string;
    }

    export interface ScraperConfig {
        proxy?: string;
    }

    export interface Language {
        color: string;
        aliases? : string[];
    }

    export class Scraper {
        constructor(config?: ScraperConfig);
        fetchTrendPage(lang: string): Promise<string>;
        scrapeTrendingRepos(lang: string): Promise<Repository[]>;
        fetchLanguageYAML(): Promise<Object>;
        scrapeLanguageColors(): Promise<Object>;
        scrapeLanguageNames(): string[];
    }

    export class Client {
        constructor(config?: ScraperConfig);
        fetchGetAPI(repo: Repository): Promise<Object>;
        fetchTrending(lang: string): Promise<Object[]>;
        fetchTrendings(langs: string[]): Promise<Object>;
    }
}

