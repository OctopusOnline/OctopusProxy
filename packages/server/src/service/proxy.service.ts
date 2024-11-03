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
    let proxy: Proxy = undefined;

    const proxyReservations = await this.getProxyIpReservations();
    const ownProxyReservations = proxyReservations.filter(proxyReservation =>
      proxyReservation.serviceId === serviceId &&
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
      const proxyWhere: { active: true; country?: string; NOT?: { ip: { in: string[] } } } = { active: true };
      if (country)
        proxyWhere.country = country;
      if (proxyReservations)
        proxyWhere.NOT = { ip: { in: proxyReservations.map(proxyReservation => proxyReservation.ip) } };

      proxy = await this.prisma.proxy.findFirst({ where: proxyWhere });

      if (reserve && proxy)
        await this.prisma.proxyIpReservation.create({
          data: {
            ip: proxy.ip,
            serviceId,
            instanceId,
          }
        });
    }

    return proxy;
  }
}
