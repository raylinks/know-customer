"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = findUser;
exports.updateUser = updateUser;
exports.findAndUpdateUser = findAndUpdateUser;
const data_source_1 = require("../../../data-source");
const user_entity_1 = require("../entity/user.entity");
const logger_1 = __importDefault(require("../../../common/logger"));
const userPoolRepository = data_source_1.dataSource.getRepository(user_entity_1.User);
async function findUser(options, relations = ['kycLevel']) {
    var _a;
    try {
        return ((_a = (await userPoolRepository.findOne({
            where: options,
            relations,
        }))) !== null && _a !== void 0 ? _a : null);
    }
    catch (error) {
        console.log(error);
        logger_1.default.error(error);
        return null;
    }
}
async function updateUser(user, updatedBy) {
    try {
        if (updatedBy !== undefined) {
            user.lastModifiedBy = updatedBy;
        }
        return await userPoolRepository.save(user);
    }
    catch (error) {
        logger_1.default.error(error);
        return null;
    }
}
async function findAndUpdateUser(options, user) {
    try {
        return await userPoolRepository.update(options, user);
    }
    catch (error) {
        logger_1.default.error(error);
        throw new Error(error.message);
    }
}
//# sourceMappingURL=user.js.map