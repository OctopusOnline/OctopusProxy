import { ProxyService } from '../service/proxy.service';
import { Proxy } from '@prisma/client';
export declare class ProxyController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    getProxy(serviceId: string, instanceId: string, country?: string, reserve?: string): Promise<{
        proxy: Proxy | undefined;
    }>;
}
