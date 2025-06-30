import { ProxyIpReservation } from '@prisma/client';
import { PrismaService } from './prisma.service';
export declare class SyncService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReservations(): Promise<ProxyIpReservation[]>;
}
