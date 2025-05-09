"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OctopusProxyServer = exports.OctopusProxyScraper = exports.prismaMigrate = exports.prismaGenerate = void 0;
const prisma_1 = require("./prisma");
Object.defineProperty(exports, "prismaGenerate", { enumerable: true, get: function () { return prisma_1.prismaGenerate; } });
Object.defineProperty(exports, "prismaMigrate", { enumerable: true, get: function () { return prisma_1.prismaMigrate; } });
const scraper_1 = require("./scraper");
Object.defineProperty(exports, "OctopusProxyScraper", { enumerable: true, get: function () { return scraper_1.OctopusProxyScraper; } });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const process = __importStar(require("node:process"));
const app_module_1 = require("./module/app.module");
const version_service_1 = require("./service/version.service");
class OctopusProxyServer {
    constructor(databaseUrl) {
        this.databaseUrl = databaseUrl;
    }
    start() {
        return __awaiter(this, arguments, void 0, function* (port = 8283) {
            process.env.PRISMA_DATABASE_URL = this.databaseUrl;
            if (this.app)
                return;
            this.app = yield core_1.NestFactory.create(app_module_1.AppModule);
            const version = this.getVersion();
            common_1.Logger.log(`Server Version: ${version.major}.${version.minor}`, 'Bootstrap');
            this.app.setGlobalPrefix('api');
            yield this.app.listen(port);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.app) === null || _a === void 0 ? void 0 : _a.close());
            this.app = undefined;
        });
    }
    getVersion() {
        return this.app.get(version_service_1.VersionService).getVersion();
    }
}
exports.OctopusProxyServer = OctopusProxyServer;
//# sourceMappingURL=index.js.map