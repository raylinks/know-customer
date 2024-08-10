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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApiKey = updateApiKey;
exports.regenerateApiKey = regenerateApiKey;
exports.findById = findById;
exports.findByKey = findByKey;
const data_source_1 = require("../../../data-source");
const crypto = __importStar(require("crypto"));
const apiKey_entity_1 = require("../entity/apiKey.entity");
const apiKeyRepository = data_source_1.dataSource.getRepository(apiKey_entity_1.Apikey);
const getQueryBuilder = () => {
    return apiKeyRepository.createQueryBuilder('apikey').leftJoinAndSelect('apikey.creator', 'creator');
};
async function updateApiKey(apiInfo) {
    return await apiKeyRepository.save(apiInfo);
}
async function regenerateApiKey(isTestKey, creator, serviceName) {
    // await apiKeyRepository.update({ creator, isTestKey }, { isActive: false });
    const key = crypto.randomBytes(32).toString('hex');
    const today = new Date().toISOString().split('T')[0];
    const findKey = await apiKeyRepository.findOne({
        where: {
            creator: { id: creator.id },
            serviceName,
            isTestKey,
        },
    });
    if (findKey !== null) {
        findKey.apiKey = key;
        findKey.serviceName = serviceName !== null && serviceName !== void 0 ? serviceName : '';
        findKey.usage = [{ date: today, count: 0 }];
        await apiKeyRepository.update(findKey.id, findKey);
        return findKey;
    }
    const apikey = apiKeyRepository.create({
        apiKey: key,
        creator,
        serviceName,
        isTestKey,
        usage: [{ date: today, count: 0 }],
    });
    await apiKeyRepository.save(apikey);
    return apikey;
}
async function findById(id) {
    return getQueryBuilder().where('api.id = :id', { id }).getOne();
}
async function findByKey(apiKey) {
    return getQueryBuilder().where('apikey.apiKey = :apiKey', { apiKey }).getOne();
}
//# sourceMappingURL=apikey.js.map