import { ProxyService } from '../service/proxy.service';
import { BadRequestException, Controller, Get, Query, Logger } from '@nestjs/common';
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
    if (!serviceId?.trim()) throw new BadRequestException('no serviceId given');
    if (!instanceId?.trim()) throw new BadRequestException('no instanceId given');

    const proxy = await this.proxyService.getProxy(serviceId, instanceId, country, reserve === 'true');

    Logger.log(`GET /proxy  --  ${serviceId} : ${instanceId}   << ${proxy?.ip || '-none-'}`, 'ProxyController');

    return { proxy };
  }
}
