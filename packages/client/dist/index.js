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
        return `${this.server.protocol}://${this.server.host}:${this.server.port}/api`;
    }
    constructor(instance, server) {
        var _a, _b, _c;
        this.instance = instance;
        this.server = {
            protocol: (_a = server.protocol) !== null && _a !== void 0 ? _a : 'http',
            host: (_b = server.host) !== null && _b !== void 0 ? _b : '0.0.0.0',
            port: (_c = server.port) !== null && _c !== void 0 ? _c : 8283
        };
    }
    toProxyUrl(proxy) {
        return proxy
            ? `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
            : undefined;
    }
    getProxy(country_1) {
        return __awaiter(this, arguments, void 0, function* (country, reserve = true) {
            const url = new URL(`${this.baseUrl}/proxy`);
            url.searchParams.append('serviceId', this.instance.serviceName);
            url.searchParams.append('instanceId', this.instance.id.toString());
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