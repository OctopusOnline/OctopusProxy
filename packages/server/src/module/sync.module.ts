import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { SyncController } from '../controller/sync.controller';
import { SyncService } from '../service/sync.service';
import { ProxyService } from '../service/proxy.service';

@Module({
  imports: [PrismaModule],
  controllers: [SyncController],
  providers: [SyncService, ProxyService],
})
export class SyncModule {}