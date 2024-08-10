"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLogDetail = saveLogDetail;
const data_source_1 = require("../../../data-source");
const logger_1 = __importDefault(require("../../../common/logger"));
const auditLogs_entity_1 = require("../entity/auditLogs.entity");
const auditLogRepository = data_source_1.dataSource.getRepository(auditLogs_entity_1.AuditLogs);
async function saveLogDetail(data) {
    try {
        const createBvnEntry = auditLogRepository.create(data);
        return await auditLogRepository.save(createBvnEntry);
    }
    catch (error) {
        logger_1.default.error(error);
        throw new Error('Unable to save record'); // FIXME: This should not be necessary but TypeORM throws a runtime
    }
}
//# sourceMappingURL=auditLog.js.map