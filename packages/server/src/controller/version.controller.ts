import { Controller, Get } from '@nestjs/common';
import { VersionInterface } from '../interface/version.interface';
import { VersionService } from '../service/version.service';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  getVersion(): { version: VersionInterface } {
    return { version: this.versionService.getVersion() };
  }
}