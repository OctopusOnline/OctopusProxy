"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let ProxyService = class ProxyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getProxyIpReservations(serviceId, instanceId) {
        const where = {};
        if (serviceId)
            where.serviceId = serviceId;
        if (instanceId)
            where.instanceId = instanceId;
        return this.prisma.proxyIpReservation.findMany({ where });
    }
    getProxy(serviceId_1, instanceId_1, country_1) {
        return __awaiter(this, arguments, void 0, function* (serviceId, instanceId, country, reserve = true) {
            let proxy = undefined;
            const proxyReservations = yield this.getProxyIpReservations();
            const ownProxyReservations = proxyReservations.filter(proxyReservation => proxyReservation.serviceId === serviceId &&
                proxyReservation.instanceId === instanceId);
            if (ownProxyReservations.length > 0) {
                const proxyWhere = {
                    active: true,
                    OR: ownProxyReservations.map(proxyReservation => ({ ip: proxyReservation.ip }))
                };
                if (country)
                    proxyWhere.country = country;
                proxy = yield this.prisma.proxy.findFirst({ where: proxyWhere });
            }
            if (!proxy) {
                const proxyWhere = { active: true };
                if (country)
                    proxyWhere.country = country;
                if (proxyReservations)
                    proxyWhere.NOT = { ip: { in: proxyReservations.map(proxyReservation => proxyReservation.ip) } };
                proxy = yield this.prisma.proxy.findFirst({ where: proxyWhere });
                if (reserve && proxy)
                    yield this.prisma.proxyIpReservation.create({
                        data: {
                            ip: proxy.ip,
                            serviceId,
                            instanceId,
                        }
                    });
            }
            return proxy;
        });
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProxyService);
//# sourceMappingURL=proxy.service.js.map