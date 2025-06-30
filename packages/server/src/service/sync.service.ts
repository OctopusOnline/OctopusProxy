import { Injectable } from '@nestjs/common';
import { ProxyIpReservation } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async getReservations(): Promise<ProxyIpReservation[]> {
    return this.prisma.proxyIpReservation.findMany();
  }
}