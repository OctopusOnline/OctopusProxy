import { OctopusProxyServerConstructorParamInterface, OctopusProxyServerInterface } from './interface';
import { Instance } from '@octopuscentral/instance';
export declare class OctopusProxyClient {
    readonly instance: Instance;
    readonly server: OctopusProxyServerInterface;
    private get baseUrl();
    constructor(instance: Instance, server: OctopusProxyServerConstructorParamInterface);
    toProxyUrl(proxy: {
        ip: string;
        port: number;
        username: string;
        password: string;
    }): string | undefined;
    getProxy(country?: string, reserve?: boolean): Promise<{
        id: string;
        ip: string;
        port: number;
        username: string;
        password: string;
        country: string;
        active: boolean;
    } | undefined>;
}
