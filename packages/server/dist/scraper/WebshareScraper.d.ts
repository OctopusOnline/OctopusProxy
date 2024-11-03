import { ScraperInterface } from '../interface/Scraper.interface';
import { Proxy } from '@prisma/client';
export declare class WebshareScraper implements ScraperInterface {
    readonly vendor = "webshare";
    private readonly apiUrl;
    private readonly apiToken;
    private readonly fetchCount;
    constructor(apiToken: string, fetchCount?: number);
    private apiRequest;
    fetchProxies(): Promise<Proxy[]>;
}
