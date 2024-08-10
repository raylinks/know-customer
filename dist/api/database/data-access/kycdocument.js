"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = findOne;
exports.savePrivateFileRecord = savePrivateFileRecord;
exports.updateKycDocument = updateKycDocument;
const data_source_1 = require("../../../data-source");
const kycDocuments_entity_1 = require("../entity/kycDocuments.entity");
const privateFileRepository = data_source_1.dataSource.getRepository(kycDocuments_entity_1.KycDocumentsEntity);
async function findOne(options) {
    try {
        const result = await privateFileRepository.findOne({
            where: options,
        });
        return result;
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
async function savePrivateFileRecord(privateFileData) {
    try {
        const createPrivateFileEntry = privateFileRepository.create(privateFileData);
        return await privateFileRepository.save(createPrivateFileEntry);
    }
    catch (error) {
        throw new Error('Unable to save private file record'); // FIXME: This should not be necessary but TypeORM throws a runtime
    }
}
async function updateKycDocument(id, kycData) {
    try {
        return await privateFileRepository.update(id, kycData);
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
//# sourceMappingURL=kycdocument.js.map