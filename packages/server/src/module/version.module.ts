import { Module } from '@nestjs/common';
import { VersionController } from '../controller/version.controller';
import { VersionService } from '../service/version.service';

@Module({
  controllers: [VersionController],
  providers: [VersionService],
})
export class VersionModule {}