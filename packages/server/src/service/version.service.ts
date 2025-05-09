import { Injectable } from '@nestjs/common';
import { VersionInterface } from '../interface/version.interface';
import { join } from 'path';

@Injectable()
export class VersionService {
  private readonly version: VersionInterface;

  constructor() {
    const [major, minor] = require(join(__dirname, '../../package.json')).version.split('.').map(Number);
    if (!Number.isInteger(major) || !Number.isInteger(minor))
      throw new Error(`could not read package version: ${JSON.stringify({ major, minor })}`);

    this.version = { major, minor };
  }

  getVersion(): VersionInterface {
    return this.version;
  }
}