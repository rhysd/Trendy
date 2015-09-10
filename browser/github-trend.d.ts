declare module 'github-trend' {
    export interface RepositoryEntry {
        owner: string;
        name: string;
    }

    interface Repository {
        [param: string]: any;
    }

    interface Repositories {
        [lang: string]: Repository[];
    }

    interface Language {
        color: string;
        aliases?: string[];
    }

    interface Languages {
        [lang: string]: Language;
    }

    export interface ScraperConfig {
        proxy?: string;
    }

    export class Scraper {
        constructor(config?: ScraperConfig);
        fetchTrendPage(lang: string): Promise<string>;
        scrapeTrendingRepos(lang: string): Promise<RepositoryEntry[]>;
        fetchLanguageYAML(): Promise<Languages>;
        scrapeLanguageColors(): Promise<{[lang: string]: string}>;
        scrapeLanguageNames(): Promise<string[]>;
    }

    export class Client {
        constructor(config?: ScraperConfig);
        fetchGetAPI(repo: RepositoryEntry): Promise<Repository>;
        fetchTrending(lang: string): Promise<Repository[]>;
        fetchTrendings(langs: string[]): Promise<Repositories>;
        fetchTrendingWithReadme(lang: string): Promise<Repository[]>;
        fetchTrendingsWithReadme(langs: string[]): Promise<Repositories>;
    }
}

