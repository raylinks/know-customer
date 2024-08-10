"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKyc = createKyc;
exports.updateKycDetails = updateKycDetails;
exports.saveKycDetails = saveKycDetails;
const data_source_1 = require("../../../data-source");
const kycLevel_entity_1 = require("../entity/kycLevel.entity");
const kycRepository = data_source_1.dataSource.getRepository(kycLevel_entity_1.KycLevel);
function createKyc(kycData) {
    return kycRepository.create(kycData);
}
async function updateKycDetails(id, kycData) {
    try {
        return await kycRepository.update(id, kycData);
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
async function saveKycDetails(kycData) {
    try {
        return await kycRepository.save(kycData);
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
//# sourceMappingURL=kycLevel.js.map