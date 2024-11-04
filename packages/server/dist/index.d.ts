import { prismaGenerate, prismaMigrate } from './prisma';
export { prismaGenerate, prismaMigrate };
import { OctopusProxyScraper } from './scraper';
export { OctopusProxyScraper };
export declare class OctopusProxyServer {
    private app?;
    private readonly databaseUrl;
    constructor(databaseUrl: string);
    start(port?: number): Promise<void>;
    stop(): Promise<void>;
}
