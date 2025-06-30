import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ProxyModule } from './proxy.module';
import { SyncModule } from './sync.module';
import { VersionModule } from './version.module';

@Module({
  imports: [PrismaModule, ProxyModule, SyncModule, VersionModule],
})
export class AppModule {}