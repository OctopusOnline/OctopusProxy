import { OctopusProxyScraper } from './scraper';
export { OctopusProxyScraper };
export declare class OctopusProxyServer {
    private app?;
    private readonly databaseUrl;
    constructor(databaseUrl: string);
    migrate(): Promise<void>;
    start(port?: number): Promise<void>;
    stop(): Promise<void>;
}
