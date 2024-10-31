import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as process from 'node:process';
import { AppModule } from './module/app.module';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

export class OctopusProxyServer {
  private app?: INestApplication;
  private readonly databaseUrl: string;

  constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
  }

  async migrate(): Promise<void> {
    process.env.PRISMA_DATABASE_URL = this.databaseUrl;
    await promisify(exec)(`
      npx prisma migrate deploy --schema=${path.resolve(__dirname, '../prisma/schema.prisma')}
    `);
    Logger.log('Prisma migrations deployed', 'PrismaClient');
  }

  public async start(port: number = 8383): Promise<void> {
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