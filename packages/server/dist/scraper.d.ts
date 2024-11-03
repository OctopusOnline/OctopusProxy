import { ScraperInterface } from './interface/Scraper.interface';
import { WebshareScraper } from './scraper/WebshareScraper';
export declare class OctopusProxyScraper {
    static readonly scraper: {
        webshare: typeof WebshareScraper;
    };
    private readonly prisma;
    private readonly scraper;
    constructor(databaseUrl: string, scraper: ScraperInterface[]);
    connect(): Promise<void>;
    private syncProxies;
    startScrapeLoop(interval?: number): Promise<void>;
    scrapeAll(): Promise<void>;
}
