export { OctopusProxyScraper } from './scraper';
import { VersionInterface } from './interface/version.interface';
export declare class OctopusProxyServer {
    private app?;
    start(port?: number): Promise<void>;
    stop(): Promise<void>;
    getVersion(): VersionInterface;
}
