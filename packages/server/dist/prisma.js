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
exports.prismaGenerate = prismaGenerate;
exports.prismaMigrate = prismaMigrate;
const common_1 = require("@nestjs/common");
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const node_util_1 = require("node:util");
function prismaGenerate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, node_util_1.promisify)(node_child_process_1.exec)(`
      prisma generate --schema=${node_path_1.default.resolve(__dirname, '../prisma/schema.prisma')} || npx prisma generate --schema=${node_path_1.default.resolve(__dirname, '../prisma/schema.prisma')}
    `);
        common_1.Logger.log('Prisma generated', 'PrismaClient');
    });
}
function prismaMigrate(databaseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        node_process_1.default.env.PRISMA_DATABASE_URL = databaseUrl;
        yield (0, node_util_1.promisify)(node_child_process_1.exec)(`
      prisma migrate deploy --schema=${node_path_1.default.resolve(__dirname, '../prisma/schema.prisma')} || npx prisma migrate deploy --schema=${node_path_1.default.resolve(__dirname, '../prisma/schema.prisma')}
    `);
        common_1.Logger.log('Prisma migrations deployed', 'PrismaClient');
    });
}
//# sourceMappingURL=prisma.js.map