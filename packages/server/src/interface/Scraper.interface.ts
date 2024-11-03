import { Proxy } from '@prisma/client';

export interface ScraperInterface {

  readonly vendor: string;

  fetchProxies(): Promise<Proxy[]>;
}