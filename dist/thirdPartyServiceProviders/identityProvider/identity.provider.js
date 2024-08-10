"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProviders = void 0;
const youVerify_1 = require("./identityProviders/youVerify");
exports.IdentityProviders = [
    {
        provide: 'youverify',
        UseValue: youVerify_1.YouVerifyService,
    },
];
//# sourceMappingURL=identity.provider.js.map