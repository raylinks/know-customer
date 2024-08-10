"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeallthService = void 0;
const logger_1 = __importDefault(require("../../common/logger"));
class HeallthService {
    async health() {
        logger_1.default.info('health endpoint check');
        return await Promise.resolve('200 OK');
    }
}
exports.HeallthService = HeallthService;
exports.default = new HeallthService();
//# sourceMappingURL=health.service.js.map