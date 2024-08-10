"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycDocumentsEntity = void 0;
const typeorm_1 = require("typeorm");
const kycLevel_entity_1 = require("./kycLevel.entity");
const base_entity_1 = require("./base.entity");
let KycDocumentsEntity = class KycDocumentsEntity extends base_entity_1.BaseEntity {
};
exports.KycDocumentsEntity = KycDocumentsEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'imageurl', nullable: true }),
    __metadata("design:type", String)
], KycDocumentsEntity.prototype, "imageurl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'filekey', nullable: true }),
    __metadata("design:type", String)
], KycDocumentsEntity.prototype, "filekey", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'otherFile', comment: 'includes NIN file, Drivers License,PVC etc', nullable: true }),
    __metadata("design:type", Array)
], KycDocumentsEntity.prototype, "otherFiles", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => kycLevel_entity_1.KycLevel, (kycLevel) => kycLevel.kycdocuments),
    __metadata("design:type", kycLevel_entity_1.KycLevel)
], KycDocumentsEntity.prototype, "kycLevel", void 0);
exports.KycDocumentsEntity = KycDocumentsEntity = __decorate([
    (0, typeorm_1.Entity)('kyc_documents')
], KycDocumentsEntity);
//# sourceMappingURL=kycDocuments.entity.js.map