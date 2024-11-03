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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OctopusProxyScraper = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const WebshareScraper_1 = require("./scraper/WebshareScraper");
class OctopusProxyScraper {
    constructor(databaseUrl, scraper) {
        this.prisma = new client_1.PrismaClient({ datasources: { db: { url: databaseUrl } } });
        this.scraper = scraper;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$connect();
        });
    }
    syncProxies() {
        return __awaiter(this, arguments, void 0, function* (proxies = []) {
            if (proxies.length === 0)
                return;
            yield this.connect();
            const vendors = [...new Set(proxies.map(proxy => proxy.vendor))];
            const existingProxies = yield this.prisma.proxy.findMany({
                where: { vendor: { in: vendors } }
            });
            const newProxyMap = new Map(proxies.map(proxy => [`${proxy.ip}:${proxy.port}:${proxy.vendor}`, proxy]));
            const createProxies = [];
            const updateProxies = [];
            for (const existingProxy of existingProxies) {
                const key = `${existingProxy.ip}:${existingProxy.port}:${existingProxy.vendor}`;
                const newProxy = newProxyMap.get(key);
                if (newProxy) {
                    if (existingProxy.username !== newProxy.username ||
                        existingProxy.password !== newProxy.password ||
                        !existingProxy.active) {
                        updateProxies.push({
                            where: {
                                ip_port: {
                                    ip: existingProxy.ip,
                                    port: existingProxy.port,
                                },
                                vendor: existingProxy.vendor
                            },
                            data: {
                                username: newProxy.username,
                                password: newProxy.password,
                                active: true
                            },
                        });
                    }
                    newProxyMap.delete(key);
                }
                else
                    updateProxies.push({
                        where: {
                            ip_port: {
                                ip: existingProxy.ip,
                                port: existingProxy.port,
                            },
                            vendor: existingProxy.vendor
                        },
                        data: { active: false },
                    });
            }
            createProxies.push(...newProxyMap.values());
            yield this.prisma.$transaction([
                ...createProxies.map(proxy => this.prisma.proxy.create({ data: proxy })),
                ...updateProxies.map(update => this.prisma.proxy.update({
                    where: update.where,
                    data: update.data,
                })),
            ]);
        });
    }
    startScrapeLoop() {
        return __awaiter(this, arguments, void 0, function* (interval = 9e5) {
            yield this.scrapeAll();
            setTimeout(() => this.startScrapeLoop(interval).then(), interval);
        });
    }
    scrapeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const scraper of this.scraper) {
                try {
                    yield this.syncProxies(yield scraper.fetchProxies());
                }
                catch (error) {
                    common_1.Logger.error(`FetchError: ${scraper.vendor}: ${error}`, OctopusProxyScraper.name);
                }
            }
        });
    }
}
exports.OctopusProxyScraper = OctopusProxyScraper;
OctopusProxyScraper.scraper = {
    webshare: WebshareScraper_1.WebshareScraper
};
//# sourceMappingURL=scraper.js.map