"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctopusProxyClient = void 0;
const axios_1 = __importDefault(require("axios"));
class OctopusProxyClient {
    get baseUrl() {
        return `${this.protocol}://${this.host}:${this.port}/api`;
    }
    constructor(port = 8283, host = '0.0.0.0') {
        this.protocol = 'http';
        this.port = port;
        this.host = host;
    }
    toProxyUrl(proxy) {
        return proxy
            ? `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
            : undefined;
    }
    getProxy(serviceId_1, instanceId_1, country_1) {
        return __awaiter(this, arguments, void 0, function* (serviceId, instanceId, country, reserve = true) {
            const url = new URL(`${this.baseUrl}/proxy`);
            url.searchParams.append('serviceId', serviceId);
            url.searchParams.append('instanceId', instanceId);
            url.searchParams.append('reserve', reserve.toString());
            if (country)
                url.searchParams.append('country', country);
            try {
                const response = yield axios_1.default.get(url.href);
                if (response.status !== 200)
                    throw new Error(`Error: ${response.statusText}`);
                return response.data.proxy || undefined;
            }
            catch (error) {
                throw new Error(`Error: ${error.response ? error.response.statusText : error.message}`);
            }
        });
    }
}
exports.OctopusProxyClient = OctopusProxyClient;
//# sourceMappingURL=index.js.map