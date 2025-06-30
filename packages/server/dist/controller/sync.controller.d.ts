import { ProxyIpReservation } from '@prisma/client';
import { SyncService } from '../service/sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    getReservations(): Promise<ProxyIpReservation[]>;
}
