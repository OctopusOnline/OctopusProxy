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
exports.OctopusProxyServer = exports.OctopusProxyScraper = void 0;
var scraper_1 = require("./scraper");
Object.defineProperty(exports, "OctopusProxyScraper", { enumerable: true, get: function () { return scraper_1.OctopusProxyScraper; } });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./module/app.module");
const version_service_1 = require("./service/version.service");
class OctopusProxyServer {
    start() {
        return __awaiter(this, arguments, void 0, function* (port = 8283) {
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