"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouVerifyService = void 0;
const axios_1 = __importDefault(require("axios"));
const enums_1 = require("../../../utils/enums");
const logger_1 = __importDefault(require("../../../common/logger"));
require('dotenv').config();
const env = JSON.parse((_a = process.env.APP_SECRETS) !== null && _a !== void 0 ? _a : '{}');
const YOUVERIFY_TOKEN = env.YOUVERIFY_TOKEN;
const YOUVERIFY_BASE_URL = env.YOUVERIFY_BASE_URL;
class YouVerifyService {
    constructor() {
        if (YOUVERIFY_TOKEN === null || YOUVERIFY_BASE_URL === null) {
            throw new Error('YouVerify service has not been properly configured');
        }
    }
    async resolveBVN(bvn) {
        try {
            const data = {
                id: bvn,
                isSubjectConsent: true,
            };
            const result = await axios_1.default.post(`${YOUVERIFY_BASE_URL}/v2/api/identity/ng/bvn`, data, {
                headers: { Token: `${YOUVERIFY_TOKEN}` },
            });
            return result.data;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new Error(`Error validating user BVN: ${error.message}`);
        }
    }
    async idSelfieVerification(payload) {
        try {
            const verificationMethod = payload.verificationType;
            let req, reqData;
            switch (verificationMethod) {
                case enums_1.IDENTITY_TYPE.INTERNATIONAL_PASSPORT:
                    reqData = {
                        id: payload.identityNo,
                        lastName: payload.lastName,
                        isSubjectConsent: true,
                        validations: {
                            selfie: {
                                image: payload.imageData,
                            },
                        },
                    };
                    req = await axios_1.default.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/passport`, reqData, {
                        headers: { Token: `${env.YOUVERIFY_TOKEN}` },
                    });
                    break;
                case enums_1.IDENTITY_TYPE.DRIVERS_LICENSE:
                    reqData = {
                        id: payload.identityNo,
                        isSubjectConsent: true,
                        validations: {
                            selfie: {
                                image: payload.imageData,
                            },
                        },
                    };
                    req = await axios_1.default.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/drivers-license`, reqData, {
                        headers: { Token: `${env.YOUVERIFY_TOKEN}` },
                    });
                    break;
                case enums_1.IDENTITY_TYPE.NIN_SLIP:
                    reqData = {
                        id: payload.identityNo,
                        isSubjectConsent: true,
                        validations: {
                            selfie: {
                                image: payload.imageData,
                            },
                        },
                    };
                    req = await axios_1.default.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/nin`, reqData, {
                        headers: { Token: `${env.YOUVERIFY_TOKEN}` },
                    });
                    break;
                case enums_1.IDENTITY_TYPE.VOTERS_CARD:
                    reqData = {
                        id: payload.identityNo,
                        isSubjectConsent: true,
                        validations: {
                            data: {
                                firstName: payload.firstName,
                                lastName: payload.lastName,
                                dateOfBirth: payload.dateOfBirth,
                            },
                        },
                    };
                    req = await axios_1.default.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/pvc`, reqData, {
                        headers: { Token: `${env.YOUVERIFY_TOKEN}` },
                    });
                    break;
            }
            const result = req === null || req === void 0 ? void 0 : req.data;
            return result;
        }
        catch (error) {
            logger_1.default.error(error);
            return { success: false, message: error.message };
        }
    }
}
exports.YouVerifyService = YouVerifyService;
//# sourceMappingURL=youVerify.js.map