import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ProxyModule } from './proxy.module';

@Module({
  imports: [PrismaModule, ProxyModule],
})
export class AppModule {}