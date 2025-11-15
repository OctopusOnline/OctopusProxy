import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Proxy, ProxyIpReservation } from '@prisma/client';
import { PrismaTransactionClient } from "../interface/prisma.interface";
import { PrismaService } from './prisma.service';

@Injectable()
export class ProxyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProxyIpReservations(
    serviceId?: string,
    instanceId?: string,
    prisma: PrismaClient | PrismaTransactionClient = this.prisma
  ): Promise<ProxyIpReservation[]> {
    const where: { serviceId?: string; instanceId?: string } = {};
    if (serviceId) where.serviceId = serviceId;
    if (instanceId) where.instanceId = instanceId;

    return prisma.proxyIpReservation.findMany({ where });
  }

  async getProxy(
    serviceId: string,
    instanceId: string,
    country?: string,
    reserve: boolean = true
  ): Promise<Proxy | undefined> {
    if (!serviceId) throw new Error('serviceId param not specified');
    if (!instanceId) throw new Error('instanceId param not specified');

    return await this.prisma.$transaction(async prisma => {
      let proxy: Proxy | undefined;

      const proxyReservations = await this.getProxyIpReservations(serviceId, undefined, prisma);
      const ownProxyReservations = proxyReservations.filter(ownProxyReservation =>
        ownProxyReservation.instanceId === instanceId
      );

      if (ownProxyReservations.length > 0) {
        const where: { active: true; country?: string; OR: { ip: string }[]; } = {
          active: true,
          OR: ownProxyReservations.map(ownProxyReservation => ({ ip: ownProxyReservation.ip }))
        };

        if (country)
          where.country = country;

        proxy = await prisma.proxy.findFirst({ where });
      }

      if (!proxy) {
        const where: { active: true; country?: string; ip?: { notIn: string[] } } = { active: true };

        if (country)
          where.country = country;

        if (proxyReservations.length > 0)
          where.ip = { notIn: proxyReservations.map(proxyReservation => proxyReservation.ip) };

        proxy = await prisma.proxy.findFirst({ where });

        if (proxy && reserve) {
          await prisma.proxyIpReservation.upsert({
            where: {
              ip_serviceId: {
                ip: proxy.ip,
                serviceId,
              }
            },
            update: {
              instanceId,
            },
            create: {
              ip: proxy.ip,
              serviceId,
              instanceId,
            },
          });
        }
      }

      return proxy;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5e3,
    });
  }
}