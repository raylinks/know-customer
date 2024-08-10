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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const enums_1 = require("../../../utils/enums");
const kycLevel_entity_1 = require("./kycLevel.entity");
const kycDocuments_entity_1 = require("./kycDocuments.entity");
let User = class User extends base_entity_1.BaseEntity {
    fullName() {
        return `${this.firstName} ${this.otherName === null ? this.otherName : ''} ${this.lastName}`;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'address', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'dateOfBirth', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'email', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'lastName', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', name: 'gender', enum: enums_1.GENDER, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'firstName', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'otherName', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "otherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'state', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'phoneNumber', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'password', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lga', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lga", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => kycLevel_entity_1.KycLevel, (kycLevel) => kycLevel.user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", kycLevel_entity_1.KycLevel)
], User.prototype, "kycLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.USER_ROLE, default: enums_1.USER_ROLE.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.OneToOne)(() => kycDocuments_entity_1.KycDocumentsEntity, {
        eager: true,
        nullable: true,
    }),
    __metadata("design:type", kycDocuments_entity_1.KycDocumentsEntity)
], User.prototype, "imageData", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map