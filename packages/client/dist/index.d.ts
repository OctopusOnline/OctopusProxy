export declare class OctopusProxyClient {
    readonly protocol: string;
    readonly host: string;
    readonly port: number;
    private get baseUrl();
    constructor(port?: number, host?: string);
    toProxyUrl(proxy: {
        ip: string;
        port: number;
        username: string;
        password: string;
    }): string | undefined;
    getProxy(serviceId: string, instanceId: string, country?: string, reserve?: boolean): Promise<{
        id: string;
        ip: string;
        port: number;
        username: string;
        password: string;
        country: string;
        active: boolean;
    } | undefined>;
}
