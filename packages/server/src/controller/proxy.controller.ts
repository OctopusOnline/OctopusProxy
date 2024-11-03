import { ProxyService } from '../service/proxy.service';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Proxy } from '@prisma/client';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async getProxy(
    @Query('serviceId') serviceId: string,
    @Query('instanceId') instanceId: string,
    @Query('country') country?: string,
    @Query('reserve') reserve?: string
  ): Promise<{ proxy: Proxy | undefined }> {
    if (!serviceId) throw new BadRequestException('no serviceId given');
    if (!instanceId) throw new BadRequestException('no instanceId given');

    return {
      proxy: await this.proxyService.getProxy(serviceId, instanceId, country, reserve === 'true')
    };
  }
}
