import { Module } from '@nestjs/common';
import { SyncController } from '../controller/sync.controller';
import { SyncService } from '../service/sync.service';
import { ProxyService } from '../service/proxy.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService, ProxyService],
})
export class SyncModule {}