import { prismaInit, prismaGenerate, prismaMigrate } from './prisma';
export { prismaInit, prismaGenerate, prismaMigrate };

import { OctopusProxyScraper } from './scraper';
export { OctopusProxyScraper };

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';
import { AppModule } from './module/app.module';

export class OctopusProxyServer {
  private app?: INestApplication;
  private readonly databaseUrl: string;

  constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
  }

  public async start(port: number = 8283): Promise<void> {
    process.env.PRISMA_DATABASE_URL = this.databaseUrl;
    if (this.app) return;

    this.app = await NestFactory.create(AppModule);
    this.app.setGlobalPrefix('api');
    await this.app.listen(port);
  }

  public async stop(): Promise<void> {
    await this.app?.close();
    this.app = undefined;
  }
}