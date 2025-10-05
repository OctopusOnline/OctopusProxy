#!/usr/bin/env node

import { prismaMigrate } from '@octopusproxy/server';
import process from 'node:process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function getDatabaseUrlFromEnv() {
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '../.env');
  if (existsSync(envPath))
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('DATABASE_URL='))
        return trimmedLine.substring(trimmedLine.indexOf('=') + 1);
    }
}

const databaseUrl = process.argv[2] || getDatabaseUrlFromEnv();
if (!databaseUrl) {
  console.error('Error: Database URL not provided as an argument or found in .env file.');
  console.error('Usage: ./scripts/prisma-migrate.mjs <database_url>');
  process.exit(1);
}

await prismaMigrate(databaseUrl);
