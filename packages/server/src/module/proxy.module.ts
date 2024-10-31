import { Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { ProxyController } from '../controller/proxy.controller';
import { ProxyService } from '../service/proxy.service';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService, PrismaService],
})
export class ProxyModule {}