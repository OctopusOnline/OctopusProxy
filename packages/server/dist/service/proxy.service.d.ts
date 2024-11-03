import { Proxy, ProxyIpReservation } from '@prisma/client';
import { PrismaService } from './prisma.service';
export declare class ProxyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProxyIpReservations(serviceId?: string, instanceId?: string): Promise<ProxyIpReservation[]>;
    getProxy(serviceId: string, instanceId: string, country?: string, reserve?: boolean): Promise<Proxy | undefined>;
}
