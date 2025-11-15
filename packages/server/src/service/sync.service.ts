import { Injectable } from '@nestjs/common';
import { ProxyIpReservation } from '@prisma/client';
import { ProxyService } from './proxy.service';

@Injectable()
export class SyncService {
  constructor(private readonly proxyService: ProxyService) {}

  async getReservations(): Promise<ProxyIpReservation[]> {
    return await this.proxyService.getProxyIpReservations();
  }
}