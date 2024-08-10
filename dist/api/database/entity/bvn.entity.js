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
exports.Bvn = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Bvn = class Bvn extends base_entity_1.BaseEntity {
};
exports.Bvn = Bvn;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Bvn.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bvn' }),
    __metadata("design:type", String)
], Bvn.prototype, "bvn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bvnData', type: 'simple-json' }),
    __metadata("design:type", Object)
], Bvn.prototype, "bvnData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Bvn.prototype, "isValid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Bvn.prototype, "validityPercentage", void 0);
exports.Bvn = Bvn = __decorate([
    (0, typeorm_1.Entity)('bvn')
], Bvn);
//# sourceMappingURL=bvn.entity.js.map