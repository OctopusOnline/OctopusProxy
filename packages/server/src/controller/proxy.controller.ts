import { Controller } from '@nestjs/common';
import { ProxyService } from '../service/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}


}
