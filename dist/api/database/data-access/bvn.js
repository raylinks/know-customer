"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBVNValidatedByAnyUser = isBVNValidatedByAnyUser;
exports.saveBvnRecord = saveBvnRecord;
exports.updateBvn = updateBvn;
const data_source_1 = require("../../../data-source");
const logger_1 = __importDefault(require("../../../common/logger"));
const bvn_entity_1 = require("../entity/bvn.entity");
const bvnRepository = data_source_1.dataSource.getRepository(bvn_entity_1.Bvn);
async function isBVNValidatedByAnyUser(options, relations = ['user']) {
    try {
        const result = await bvnRepository.findOne({
            where: options,
            relations,
        });
        return result;
    }
    catch (error) {
        logger_1.default.error(error);
        throw new Error(`${error.message}`);
    }
}
async function saveBvnRecord(bvnData) {
    try {
        const createBvnEntry = bvnRepository.create(bvnData);
        return await bvnRepository.save(createBvnEntry);
    }
    catch (error) {
        logger_1.default.error(error);
        throw new Error('Unable to save bvn record'); // FIXME: This should not be necessary but TypeORM throws a runtime
    }
}
async function updateBvn(id, bvnData) {
    try {
        return await bvnRepository.update(id, bvnData);
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
//# sourceMappingURL=bvn.js.map