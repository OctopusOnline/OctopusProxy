import { VersionInterface, ProxyBaseInterface, ProxyInterface, OctopusProxyServerInterface } from './interfaces';
import { Instance } from '@octopuscentral/instance';
import axios from 'axios';
import { join } from 'path';

export class OctopusProxyClient {

  readonly instance: Instance;
  readonly server: OctopusProxyServerInterface;

  private readonly version: VersionInterface;

  private get serverBaseUrl(): string {
    return `${this.server.protocol}://${this.server.host}:${this.server.port}/api`;
  }

  constructor(instance: Instance, server: Partial<OctopusProxyServerInterface> = {}) {
    this.instance = instance;
    this.server = {
      protocol: server.protocol ?? 'http',
      host: server.host ?? '0.0.0.0',
      port: server.port ?? 8283
    }

    const [major, minor] = require(join(__dirname, '../package.json')).version.split('.').map(Number);
    if (!Number.isInteger(major) || !Number.isInteger(minor))
      throw new Error(`could not read package version: ${JSON.stringify({ major, minor })}`);

    this.version = { major, minor };
  }

  getClientVersion(): VersionInterface {
    return this.version;
  }

  async getServerVersion(): Promise<VersionInterface> {
    const response = await axios.get(`${this.serverBaseUrl}/version`);
    if (response.status !== 200)
      throw new Error(`Error: ${response.statusText}`);

    return response.data.version;
  }

  private async matchServerVersion(): Promise<void> {
    const serverVersion = await this.getServerVersion();
    if (serverVersion.major !== this.version.major || serverVersion.minor !== this.version.minor)
      throw new Error(`Server version mismatch:  [server] ${serverVersion.major}.${serverVersion.minor}  !=  ${this.version.major}.${this.version.minor} [client]`);
  }

  async getProxy(
    instanceIdentifier: string,
    country?: string,
    reserve: boolean = true,
  ): Promise<ProxyInterface | undefined> {
    if (!this.instance.serviceName?.trim())
      throw new Error('no service name given in instance!');

    if (!instanceIdentifier?.trim())
      throw new Error('no instance identifier given!');

    await this.matchServerVersion();

    const url = new URL(`${this.serverBaseUrl}/proxy`);
    url.searchParams.append('serviceId', this.instance.serviceName);
    url.searchParams.append('instanceId', instanceIdentifier);
    url.searchParams.append('reserve', reserve ? 'true' : 'false');
    if (country) url.searchParams.append('country', country);

    try {
      const response = await axios.get(url.href);
      if (response.status !== 200)
        throw new Error(response.statusText);

      return response.data.proxy || undefined;
    }
    catch (error) {
      throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
  }

  toProxyUrl(proxy: ProxyBaseInterface & { protocol?: 'http' | 'https' }): string | undefined {
    return (proxy.ip && proxy.port && proxy.username && proxy.password)
      ? `${proxy.protocol || 'http'}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
      : undefined;
  }
}