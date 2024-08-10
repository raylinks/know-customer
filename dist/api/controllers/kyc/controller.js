"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const enums_1 = require("../../../utils/enums");
const express_validator_1 = require("express-validator");
const kyc_service_1 = __importDefault(require("../../services/kyc.service"));
const user_1 = require("../../database/data-access/user");
const user_entity_1 = require("../../database/entity/user.entity");
const verifyBvn_dto_1 = require("./dto/verifyBvn.dto");
const base_1 = require("../../../utils/base");
class Controller {
    async verifyBvn(req, res) {
        /* 	#swagger.tags = ['KYC']
    #swagger.description = 'Endpoint for bvn verification' */
        const validateRequest = (0, express_validator_1.validationResult)(req);
        if (!validateRequest.isEmpty()) {
            return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
        }
        let createUser;
        const { phoneNumber, firstName, otherName, lastName, dateOfBirth, } = req.body;
        const userExists = await (0, user_1.findUser)({ phoneNumber });
        if (userExists === null) {
            // const create user from payload
            const user = new user_entity_1.User();
            user.dateOfBirth = dateOfBirth;
            user.firstName = firstName;
            user.lastName = lastName;
            user.phoneNumber = phoneNumber;
            user.otherName = otherName;
            createUser = await (0, user_1.updateUser)(user, user.fullName());
            if (createUser === null) {
                createUser = user;
            }
        }
        else {
            createUser = userExists;
        }
        // TODO: handle error if unable to create user
        /* check lams if user has already been verified */
        const lamsVerification = await kyc_service_1.default.verifyLamsBvn(phoneNumber);
        if (lamsVerification.success) {
            createUser.email = lamsVerification.payload.email;
            const lamUserPayload = new verifyBvn_dto_1.VerifyBvnDto();
            lamUserPayload.bvn = lamsVerification.payload.bvn;
            lamUserPayload.dateOfBirth = dateOfBirth;
            lamUserPayload.firstName = firstName;
            lamUserPayload.lastName = lastName;
            lamUserPayload.otherName = otherName;
            lamUserPayload.phoneNumber = phoneNumber;
            const result = await kyc_service_1.default.verifyBvn(createUser, lamUserPayload, lamsVerification.success);
            return res.status(200).json({ ...result });
        }
        try {
            if (createUser !== null) {
                const verify = await kyc_service_1.default.verifyBvn(createUser, req.body);
                return res.status(verify.statusCode).json({ ...verify });
            }
            else {
                throw new Error('Forbidden Access');
            }
        }
        catch (error) {
            return res.status(403).json((0, base_1.sendFailedResponse)('An unexpected error occurred'));
        }
    }
    async verifyLams(req, res) {
        var _a;
        /* 	#swagger.tags = ['KYC']
    #swagger.description = 'Endpoint for lams verification' */
        const validateRequest = (0, express_validator_1.validationResult)(req);
        if (!validateRequest.isEmpty()) {
            return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
        }
        let phoneNumber = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.phoneNumber;
        if (phoneNumber !== undefined && phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber.trim();
        }
        // if (!/^\+[1-9]{3,3}\d{10,10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
        //   return res.status(422).json(sendFailedResponse(`Invalid Phone Number Format`));
        // }
        const payload = {
            userType: enums_1.UserTypes.IS_EXTERNAL_USER,
            phoneNumber,
            data: {},
        };
        const lamsVerification = await kyc_service_1.default.verifyLamsBvn(phoneNumber);
        //console.log('ee', lamsVerification);
        if (lamsVerification.success) {
            payload.userType = enums_1.UserTypes.IS_LAMS_CHAMPS;
            payload.data = lamsVerification.payload;
            return res.status(200).json((0, base_1.sendSuccessResponse)(lamsVerification.message, payload));
        }
        // TODO!:- check user exists in a spread sheet for external users (MAX STAFF)
        if (phoneNumber === '+2348095607948') {
            // this is for theo update
            payload.userType = enums_1.UserTypes.IS_MAX_STAFF;
            return res.status(200).json((0, base_1.sendSuccessResponse)('success', payload));
        }
        /** this block returns default response such that user is not a max staff or lams champ */
        return res.status(200).json((0, base_1.sendSuccessResponse)('success', payload));
    }
    validateBodyDto(type) {
        let validationScope = [];
        switch (type) {
            case enums_1.ACCOUNT_VALIDATION.BVN_VERIFICATION:
                validationScope = [
                    (0, express_validator_1.body)('phoneNumber')
                        .notEmpty()
                        .custom((value) => {
                        if (!/^\+[1-9]{3,3}\d{10,10}$/.test(value.replace(/\s+/g, ''))) {
                            throw new Error(`Phone number invalid, please provide your phone number in the format +234XXXXXXXX`);
                        }
                        return true;
                    }),
                    (0, express_validator_1.body)('bvn').notEmpty().isString().isLength({ min: 11, max: 11 }),
                    (0, express_validator_1.body)('firstName').isString().notEmpty(),
                    (0, express_validator_1.body)('otherName').isString().optional(),
                    (0, express_validator_1.body)('lastName').isString().notEmpty(),
                    (0, express_validator_1.body)('dateOfBirth').isString().notEmpty().withMessage('Date of birth must be in the format YYYY-MM-DD'),
                ];
                break;
            case enums_1.ACCOUNT_VALIDATION.USER_TYPE_VERIFCATION:
                validationScope = [(0, express_validator_1.query)('phoneNumber').notEmpty()];
                break;
            default:
                break;
        }
        return validationScope;
    }
    async verifySelfieId(req, res) {
        var _a, _b;
        const validateRequest = (0, express_validator_1.validationResult)(req);
        if (!validateRequest.isEmpty()) {
            return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
        }
        const { phoneNumber, } = req.body;
        try {
            const user = await (0, user_1.findUser)({ phoneNumber });
            if (((_a = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _a === void 0 ? void 0 : _a.verifiedBvn) === false) {
                throw new Error('kindly verify BVN to proceed');
            }
            if (user !== null) {
                const files = req.files;
                const verify = await kyc_service_1.default.uploadIdForKYC2(user, req.body, files);
                return res.status(verify.statusCode).json({ ...verify });
            }
            else {
                throw new Error('Forbidden Access');
            }
        }
        catch (error) {
            res.status(403).send({ error: (_b = error.message) !== null && _b !== void 0 ? _b : 'An unexpected error occurred' });
        }
    }
    async updateToKYC3(req, res) {
        var _a;
        const validateRequest = (0, express_validator_1.validationResult)(req);
        if (!validateRequest.isEmpty()) {
            return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
        }
        const { phoneNumber, } = req.body;
        const utility = req.file;
        try {
            const user = await (0, user_1.findUser)({ phoneNumber });
            if (user !== null && utility !== undefined) {
                const verify = await kyc_service_1.default.updateToKYC3(user, req.body, utility);
                return res.status(verify.statusCode).json({ ...verify });
            }
            else {
                throw new Error('Forbidden Access');
            }
        }
        catch (error) {
            res.status(403).send({ error: (_a = error.message) !== null && _a !== void 0 ? _a : 'An unexpected error occurred' });
        }
    }
    validateBodyVerifySelfie() {
        let validationScope = [];
        validationScope = [
            (0, express_validator_1.body)('identityNo').notEmpty().isString(),
            (0, express_validator_1.body)('firstName').isString().notEmpty(),
            (0, express_validator_1.body)('lastName').isString().optional(),
            (0, express_validator_1.body)('verificationType').isString().notEmpty(),
            (0, express_validator_1.body)('dateOfBirth').isString().notEmpty().withMessage('Date of birth must be in the format YYYY-MM-DD'),
        ];
        return validationScope;
    }
}
exports.Controller = Controller;
exports.default = new Controller();
//# sourceMappingURL=controller.js.map