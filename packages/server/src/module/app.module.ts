import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ProxyModule } from './proxy.module';
import { VersionModule } from './version.module';

@Module({
  imports: [PrismaModule, ProxyModule, VersionModule],
})
export class AppModule {}