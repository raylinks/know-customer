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
exports.OtpEntity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const enums_1 = require("../../../utils/enums");
let OtpEntity = class OtpEntity extends base_entity_1.BaseEntity {
};
exports.OtpEntity = OtpEntity;
__decorate([
    (0, typeorm_1.Column)({ name: 'otp', nullable: false }),
    __metadata("design:type", String)
], OtpEntity.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', nullable: false, enum: enums_1.OtpTypes }),
    __metadata("design:type", String)
], OtpEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phoneNumber', nullable: true }),
    __metadata("design:type", String)
], OtpEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage', nullable: false, enum: enums_1.OtpUsage }),
    __metadata("design:type", String)
], OtpEntity.prototype, "usage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expirationTime', nullable: false }),
    __metadata("design:type", String)
], OtpEntity.prototype, "expirationTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', nullable: false, enum: enums_1.OtpStatus, default: enums_1.OtpStatus.UNUSED }),
    __metadata("design:type", String)
], OtpEntity.prototype, "status", void 0);
exports.OtpEntity = OtpEntity = __decorate([
    (0, typeorm_1.Entity)('otp')
], OtpEntity);
//# sourceMappingURL=otp.entity.js.map