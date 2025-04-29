import { OctopusProxyServerConstructorParamInterface, OctopusProxyServerInterface } from './interface';
import { Instance } from '@octopuscentral/instance';
import axios from 'axios';

export class OctopusProxyClient {

  readonly instance: Instance;
  readonly server: OctopusProxyServerInterface;

  private get baseUrl() {
    return `${this.server.protocol}://${this.server.host}:${this.server.port}/api`;
  }

  constructor(instance: Instance, server: OctopusProxyServerConstructorParamInterface) {
    this.instance = instance;
    this.server = {
      protocol: server.protocol ?? 'http',
      host: server.host ?? '0.0.0.0',
      port: server.port ?? 8283
    }
  }

  toProxyUrl(proxy: { ip: string; port: number; username: string; password: string }): string | undefined {
    return proxy
      ? `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
      : undefined;
  }

  async getProxy(
    country?: string,
    reserve: boolean = true,
  ): Promise<{
    id: string;
    ip: string;
    port: number;
    username: string;
    password: string;
    country: string;
    active: boolean;
  } | undefined> {
    const url = new URL(`${this.baseUrl}/proxy`);
    url.searchParams.append('serviceId', this.instance.serviceName);
    url.searchParams.append('instanceId', this.instance.id.toString());
    url.searchParams.append('reserve', reserve.toString());
    if (country) url.searchParams.append('country', country);

    try {
      const response = await axios.get(url.href);
      if (response.status !== 200)
        throw new Error(`Error: ${response.statusText}`);

      return response.data.proxy || undefined;
    }
    catch (error) {
      throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
    }
  }
}