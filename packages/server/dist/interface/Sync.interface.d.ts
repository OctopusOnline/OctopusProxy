import { Proxy, ProxyIpReservation } from '@prisma/client';
export interface SyncInterface {
    readonly proxy: Proxy[];
    readonly reservation: ProxyIpReservation[];
}
