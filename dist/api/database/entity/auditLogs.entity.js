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
exports.AuditLogs = void 0;
const typeorm_1 = require("typeorm");
const apiKey_entity_1 = require("./apiKey.entity");
const user_entity_1 = require("./user.entity");
let AuditLogs = class AuditLogs extends typeorm_1.BaseEntity {
};
exports.AuditLogs = AuditLogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditLogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => apiKey_entity_1.Apikey, (apiKey) => apiKey.id, { nullable: true }),
    __metadata("design:type", Object)
], AuditLogs.prototype, "apiService", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { nullable: true }),
    __metadata("design:type", Object)
], AuditLogs.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'endpoint' }),
    __metadata("design:type", String)
], AuditLogs.prototype, "requestEndpoint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requestMethod' }),
    __metadata("design:type", String)
], AuditLogs.prototype, "requestMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requestBody', nullable: true, type: 'jsonb' }),
    __metadata("design:type", Object)
], AuditLogs.prototype, "requestBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responseBody', nullable: true, type: 'jsonb' }),
    __metadata("design:type", Object)
], AuditLogs.prototype, "responseBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requestInitiatedAt' }),
    __metadata("design:type", Date)
], AuditLogs.prototype, "requestInitiatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responseSentAt' }),
    __metadata("design:type", Date)
], AuditLogs.prototype, "responseSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responseTime' }),
    __metadata("design:type", String)
], AuditLogs.prototype, "responseTime", void 0);
exports.AuditLogs = AuditLogs = __decorate([
    (0, typeorm_1.Entity)('audit_logs')
], AuditLogs);
//# sourceMappingURL=auditLogs.entity.js.map