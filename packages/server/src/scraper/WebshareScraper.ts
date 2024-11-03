import { ScraperInterface } from '../interface/Scraper.interface';
import { Proxy } from '@prisma/client';
import https from 'node:https';
import { ClientRequest, IncomingMessage } from 'node:http';
import { join } from 'node:path';

interface WebshareFetchProxiesResponseInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    username: string;
    password: string;
    proxy_address: string;
    port: number;
    valid: boolean;
    last_verification: string;
    country_code: string;
    city_name: string;
    asn_name: string;
    asn_number: number;
    high_country_confidence: boolean;
    created_at: string;
  }[];
}

export class WebshareScraper implements ScraperInterface {
  readonly vendor = 'webshare';
  private readonly apiUrl = "https://proxy.webshare.io/api/v2";

  private readonly apiToken: string;
  private readonly fetchCount: number;

  constructor(apiToken: string, fetchCount: number = 1000) {
    this.apiToken = apiToken;
    this.fetchCount = fetchCount;
  }

  private apiRequest(
    method: 'GET' | 'POST' | string = 'GET',
    path: string,
    searchParams: { [key: string]: string } = {},
    headers: object = {}
  ): Promise<{ data: object, response: IncomingMessage }> {
    const url = new URL(this.apiUrl);
    url.pathname = join(url.pathname, path);

    for (const searchParam of Object.keys(searchParams))
      url.searchParams.append(searchParam, searchParams[searchParam])

    return new Promise(resolve => {
      const request: ClientRequest = https.request({
        method  : method.toUpperCase(),
        port    : 443,
        hostname: url.hostname,
        path    : url.pathname + (url.search || ""),
        headers : {
          ...headers,
          "Authorization": `Token ${this.apiToken}`
        }
      }, response => {
        let json = "";
        response.on("data" , buffer => json += buffer.toString());
        response.on("error", error  => { throw error });
        response.on("end"  , ()     => resolve({data: JSON.parse(json.toString()), response}));
      });

      request.on("error", error => { throw error });
      request.end();
    });
  }

  async fetchProxies(): Promise<Proxy[]> {
    const result = (await this.apiRequest('GET', "proxy/list/", {
      "mode": "direct",
      "page": "1",
      "page_size": this.fetchCount.toString()
    })).data as WebshareFetchProxiesResponseInterface;

    return result.results.map(proxy => ({
      ip:       proxy.proxy_address,
      port:     proxy.port,
      username: proxy.username,
      password: proxy.password,
      active:   proxy.valid,
      vendor:   this.vendor,
    }));
  }
}