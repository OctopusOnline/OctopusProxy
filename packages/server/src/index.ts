import { prismaGenerate, prismaMigrate } from './prisma';
export { prismaGenerate, prismaMigrate };

import { OctopusProxyScraper } from './scraper';
export { OctopusProxyScraper };

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';
import { AppModule } from './module/app.module';

import { VersionService } from './service/version.service';
import { VersionInterface } from './interface/version.interface';

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

    const version = this.getVersion();
    Logger.log(`Server Version: ${version.major}.${version.minor}`, 'Bootstrap');

    this.app.setGlobalPrefix('api');
    await this.app.listen(port);
  }

  public async stop(): Promise<void> {
    await this.app?.close();
    this.app = undefined;
  }

  public getVersion(): VersionInterface {
    return this.app.get(VersionService).getVersion();
  }
}