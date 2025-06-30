import { Controller, Get } from '@nestjs/common';
import { ProxyIpReservation } from '@prisma/client';
import { SyncService } from '../service/sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('reservations')
  async getReservations(): Promise<ProxyIpReservation[]> {
    return await this.syncService.getReservations();
  }
}