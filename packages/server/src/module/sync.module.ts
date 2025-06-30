import { Module } from '@nestjs/common';
import { SyncController } from '../controller/sync.controller';
import { SyncService } from '../service/sync.service';
import { PrismaService } from '../service/prisma.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService, PrismaService],
})
export class SyncModule {}