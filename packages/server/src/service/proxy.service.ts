import { Injectable } from '@nestjs/common';
import { Proxy, ProxyIpReservation } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProxyService {
  constructor(private readonly prisma: PrismaService) {}

  getProxyIpReservations(
    serviceId?: string,
    instanceId?: string
  ): Promise<ProxyIpReservation[]> {
    const where: { serviceId?: string; instanceId?: string } = {};
    if (serviceId) where.serviceId = serviceId;
    if (instanceId) where.instanceId = instanceId;

    return this.prisma.proxyIpReservation.findMany({ where });
  }

  async getProxy(
    serviceId: string,
    instanceId: string,
    country?: string,
    reserve: boolean = true
  ): Promise<Proxy | undefined> {
    let proxy: Proxy | undefined;

    const proxyReservations = await this.getProxyIpReservations(serviceId);
    const ownProxyReservations = proxyReservations.filter(proxyReservation =>
      proxyReservation.instanceId === instanceId
    );

    if (ownProxyReservations.length > 0) {
      const proxyWhere: { active: true; OR: { ip: string }[]; country?: string } = {
        active: true,
        OR: ownProxyReservations.map(proxyReservation => ({ ip: proxyReservation.ip }))
      };
      if (country) proxyWhere.country = country;

      proxy = await this.prisma.proxy.findFirst({ where: proxyWhere });
    }

    if (!proxy) {
      proxy = await this.prisma.$transaction(async prisma => {
        const proxyReservations = await prisma.proxyIpReservation.findMany({ where: { serviceId } });

        const proxyWhere: { active: true; country?: string; NOT?: { ip: { in: string[] } } } = { active: true };

        if (country)
          proxyWhere.country = country;

        if (proxyReservations.length > 0)
          proxyWhere.NOT = { ip: { in: proxyReservations.map(proxyReservation => proxyReservation.ip) } };

        const selectedProxy = await prisma.proxy.findFirst({ where: proxyWhere });
        if (!selectedProxy) return undefined;

        if (reserve) {
          await prisma.proxyIpReservation.upsert({
            where: {
              ip_serviceId: {
                ip: selectedProxy.ip,
                serviceId,
              }
            },
            update: {
              instanceId,
            },
            create: {
              ip: selectedProxy.ip,
              serviceId,
              instanceId,
            },
          });
        }

        return selectedProxy;
      });
    }

    return proxy;
  }
}