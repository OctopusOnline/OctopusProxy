import { Logger } from '@nestjs/common';
import { PrismaClient, Proxy } from '@prisma/client';
import { ScraperInterface } from './interface/Scraper.interface';
import { WebshareScraper } from './scraper/WebshareScraper';

export class OctopusProxyScraper {
  static readonly scraper = {
    webshare: WebshareScraper
  };

  private readonly prisma: PrismaClient;
  private readonly scraper: ScraperInterface[];

  constructor(scraper: ScraperInterface[]) {
    this.prisma = new PrismaClient();
    this.scraper = scraper;
  }

  async connect() {
    await this.prisma.$connect();
  }

  private async syncProxies(proxies: Proxy[] = []): Promise<void> {
    if (proxies.length === 0) return;
    await this.connect();

    const vendors = [...new Set(proxies.map(proxy => proxy.vendor))];

    const existingProxies = await this.prisma.proxy.findMany({
      where: { vendor: { in: vendors } }
    });

    const newProxyMap = new Map<string, Proxy>(
      proxies.map(proxy => [`${proxy.ip}:${proxy.port}:${proxy.vendor}`, proxy]));

    const createProxies: Proxy[] = [];
    const updateProxies: { where: { ip_port: { ip: string; port: number }; vendor: string }; data: Partial<Proxy> }[] = [];

    for (const existingProxy of existingProxies) {
      const key = `${existingProxy.ip}:${existingProxy.port}:${existingProxy.vendor}`;
      const newProxy = newProxyMap.get(key);

      if (newProxy) {
        if (
          existingProxy.username !== newProxy.username ||
          existingProxy.password !== newProxy.password ||
          existingProxy.country  !== newProxy.country  ||
          !existingProxy.active
        ) {
          updateProxies.push({
            where: {
              ip_port: {
                ip: existingProxy.ip,
                port: existingProxy.port,
              },
              vendor: existingProxy.vendor
            },
            data: {
              username: newProxy.username,
              password: newProxy.password,
              country:  newProxy.country,
              active:   true
            },
          });
        }

        newProxyMap.delete(key);
      }
      else updateProxies.push({
        where: {
          ip_port: {
            ip: existingProxy.ip,
            port: existingProxy.port,
          },
          vendor: existingProxy.vendor
        },
        data: { active: false },
      });
    }

    createProxies.push(...newProxyMap.values());

    await this.prisma.$transaction([
      ...createProxies.map(proxy =>
        this.prisma.proxy.create({ data: proxy })),
      ...updateProxies.map(update =>
        this.prisma.proxy.update({
          where: update.where,
          data: update.data,
        })
      ),
    ]);
  }

  public async startScrapeLoop(interval: number = 9e5): Promise<void> {
    await this.scrapeAll();
    setTimeout(() => this.startScrapeLoop(interval).then(), interval);
  }

  public async scrapeAll(): Promise<void> {
    for (const scraper of this.scraper) {
      try {
        await this.syncProxies(await scraper.fetchProxies());
      } catch (error) {
        Logger.error(`FetchError: ${scraper.vendor}: ${error}`, OctopusProxyScraper.name);
      }
    }
  }
}