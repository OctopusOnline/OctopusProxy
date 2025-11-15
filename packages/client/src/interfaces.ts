export interface VersionInterface {
  major: number;
  minor: number;
}

export interface ProxyBaseInterface {
  ip: string;
  port: number;
  username: string;
  password: string;
}

export interface ProxyInterface extends ProxyBaseInterface {
  active: true;
  country: string;
  vendor: string;
}

export interface OctopusProxyServerInterface {
  protocol: 'http';
  host: string;
  port: number;
}