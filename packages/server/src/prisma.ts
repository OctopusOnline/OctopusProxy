import { Logger } from '@nestjs/common';
import { exec } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import { promisify } from 'node:util';

export async function prismaGenerate(): Promise<void> {
  const schemaPath = resolve(__dirname, '../prisma/schema.prisma');
  try {
    await promisify(exec)(`prisma generate --schema=${schemaPath}`);
  } catch (error) {
    Logger.warn('Prisma command failed, trying with npx...', 'PrismaClient');
    await promisify(exec)(`npx prisma generate --schema=${schemaPath}`);
  }
  Logger.log('Prisma generated', 'PrismaClient');
}

export async function prismaMigrate(databaseUrl: string): Promise<void> {
  const url = new URL(databaseUrl);
  if (url.protocol === 'mariadb:') url.protocol = 'mysql:';
  process.env.PRISMA_DATABASE_URL = url.toString();

  const schemaPath = resolve(__dirname, '../prisma/schema.prisma');
  try {
    await promisify(exec)(`prisma migrate deploy --schema=${schemaPath}`);
  } catch (error) {
    Logger.warn('Prisma migrate command failed, trying with npx...', 'PrismaClient');
    await promisify(exec)(`npx prisma migrate deploy --schema=${schemaPath}`);
  }
  Logger.log('Prisma migrations deployed', 'PrismaClient');
}