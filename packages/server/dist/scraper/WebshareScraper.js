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
exports.WebshareScraper = void 0;
const node_https_1 = __importDefault(require("node:https"));
const node_path_1 = require("node:path");
class WebshareScraper {
    constructor(apiToken, fetchCount = 1000) {
        this.vendor = 'webshare';
        this.apiUrl = "https://proxy.webshare.io/api/v2";
        this.apiToken = apiToken;
        this.fetchCount = fetchCount;
    }
    apiRequest(method = 'GET', path, searchParams = {}, headers = {}) {
        const url = new URL(this.apiUrl);
        url.pathname = (0, node_path_1.join)(url.pathname, path);
        for (const searchParam of Object.keys(searchParams))
            url.searchParams.append(searchParam, searchParams[searchParam]);
        return new Promise(resolve => {
            const request = node_https_1.default.request({
                method: method.toUpperCase(),
                port: 443,
                hostname: url.hostname,
                path: url.pathname + (url.search || ""),
                headers: Object.assign(Object.assign({}, headers), { "Authorization": `Token ${this.apiToken}` })
            }, response => {
                let json = "";
                response.on("data", buffer => json += buffer.toString());
                response.on("error", error => { throw error; });
                response.on("end", () => resolve({ data: JSON.parse(json.toString()), response }));
            });
            request.on("error", error => { throw error; });
            request.end();
        });
    }
    fetchProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.apiRequest('GET', "proxy/list/", {
                "mode": "direct",
                "page": "1",
                "page_size": this.fetchCount.toString()
            })).data;
            return result.results.map(proxy => ({
                ip: proxy.proxy_address,
                port: proxy.port,
                username: proxy.username,
                password: proxy.password,
                country: proxy.country_code,
                active: proxy.valid,
                vendor: this.vendor,
            }));
        });
    }
}
exports.WebshareScraper = WebshareScraper;
//# sourceMappingURL=WebshareScraper.js.map