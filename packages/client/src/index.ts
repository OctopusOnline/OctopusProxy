import axios from 'axios';

export class OctopusProxyClient {

  readonly protocol: string = 'http';
  readonly host: string;
  readonly port: number;

  private get baseUrl() {
    return `${this.protocol}://${this.host}:${this.port}/api`;
  }

  constructor(port: number = 8283, host: string = '0.0.0.0') {
    this.port = port;
    this.host = host;
  }

  toProxyUrl(proxy: { ip: string; port: number; username: string; password: string }): string | undefined {
    return proxy
      ? `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
      : undefined;
  }

  async getProxy(
    serviceId: string,
    instanceId: string,
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
    url.searchParams.append('serviceId', serviceId);
    url.searchParams.append('instanceId', instanceId);
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