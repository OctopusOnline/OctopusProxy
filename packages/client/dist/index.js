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
const path_1 = require("path");
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
        const [major, minor] = require((0, path_1.join)(__dirname, '../package.json')).version.split('.').map(Number);
        if (!Number.isInteger(major) || !Number.isInteger(minor))
            throw new Error(`could not read package version: ${JSON.stringify({ major, minor })}`);
        this.version = { major, minor };
    }
    getClientVersion() {
        return this.version;
    }
    getServerVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseUrl}/version`);
            if (response.status !== 200)
                throw new Error(`Error: ${response.statusText}`);
            return response.data.version;
        });
    }
    matchServerVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const serverVersion = yield this.getServerVersion();
            if (serverVersion.major !== this.version.major || serverVersion.minor !== this.version.minor)
                throw new Error(`Server version mismatch:  [server] ${serverVersion.major}.${serverVersion.minor}  !=  ${this.version.major}.${this.version.minor} [client]`);
        });
    }
    getProxy(country_1) {
        return __awaiter(this, arguments, void 0, function* (country, reserve = true) {
            yield this.matchServerVersion();
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
    toProxyUrl(proxy) {
        return proxy
            ? `http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
            : undefined;
    }
}
exports.OctopusProxyClient = OctopusProxyClient;
//# sourceMappingURL=index.js.map