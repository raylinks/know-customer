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
exports.KycLevel = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const kycDocuments_entity_1 = require("./kycDocuments.entity");
const enums_1 = require("../../../utils/enums");
const user_entity_1 = require("./user.entity");
let KycLevel = class KycLevel extends base_entity_1.BaseEntity {
};
exports.KycLevel = KycLevel;
__decorate([
    (0, typeorm_1.Column)({ name: 'bvn', nullable: true }),
    __metadata("design:type", String)
], KycLevel.prototype, "bvn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bvnVerificationCount', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], KycLevel.prototype, "bvnVerificationCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verifiedBvn', default: false }),
    __metadata("design:type", Boolean)
], KycLevel.prototype, "verifiedBvn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'kyclevel',
        type: 'enum',
        enum: enums_1.KycLevelStatus,
        default: enums_1.KycLevelStatus.LEVEL_ZERO,
    }),
    __metadata("design:type", Number)
], KycLevel.prototype, "kyclevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Kyc3Status', enum: enums_1.Kyc3Status, default: enums_1.Kyc3Status.NOT_INITIATED }),
    __metadata("design:type", String)
], KycLevel.prototype, "Kyc3Status", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.OneToOne)(() => kycDocuments_entity_1.KycDocumentsEntity, {
        eager: true,
        nullable: true,
        cascade: true,
    }),
    __metadata("design:type", kycDocuments_entity_1.KycDocumentsEntity)
], KycLevel.prototype, "kycdocuments", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'comment',
        nullable: true,
    }),
    __metadata("design:type", String)
], KycLevel.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'adminId',
        nullable: true,
    }),
    __metadata("design:type", String)
], KycLevel.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.kycLevel),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], KycLevel.prototype, "user", void 0);
exports.KycLevel = KycLevel = __decorate([
    (0, typeorm_1.Entity)('kyc_level')
], KycLevel);
//# sourceMappingURL=kycLevel.entity.js.map