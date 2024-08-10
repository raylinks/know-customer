"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOtpDetails = saveOtpDetails;
const data_source_1 = require("../../../data-source");
const logger_1 = __importDefault(require("../../../common/logger"));
const otp_entity_1 = require("../entity/otp.entity");
const otpRepository = data_source_1.dataSource.getRepository(otp_entity_1.OtpEntity);
async function saveOtpDetails(options) {
    var _a;
    try {
        return (_a = (await otpRepository.save(options))) !== null && _a !== void 0 ? _a : null;
    }
    catch (error) {
        logger_1.default.error(error);
        throw Error('Unable to save otp details');
    }
}
//# sourceMappingURL=otp.js.map