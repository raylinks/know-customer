"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_validator_1 = require("express-validator");
const enums_1 = require("../../../utils/enums");
const user_service_1 = __importDefault(require("../../services/user.service"));
const base_1 = require("../../../utils/base");
class Controller {
    async authenticate(req, res) {
        /* 	#swagger.tags = ['Admin']
    #swagger.description = 'Endpoint to authenticate admin' */
        const validateRequest = (0, express_validator_1.validationResult)(req);
        if (!validateRequest.isEmpty()) {
            return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
        }
        const { phoneNumber, password } = req.body;
        try {
            const accessToken = await user_service_1.default.signInUser(phoneNumber, password);
            if (accessToken === false) {
                return res.status(400).json({
                    status: 400,
                    message: 'UnAuthorized',
                });
            }
            return res.status(200).json((0, base_1.sendSuccessResponse)('success', { accessToken }));
        }
        catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message.toString(),
            });
        }
    }
    validateBodyLogin(type) {
        let validationScope = [];
        switch (type) {
            case enums_1.ACCOUNT_VALIDATION.SIGN_IN:
                validationScope = [
                    (0, express_validator_1.body)('phoneNumber')
                        .notEmpty()
                        .custom((value) => {
                        if (!/^\+[1-9]{3,3}\d{10,10}$/.test(value.replace(/\s+/g, ''))) {
                            throw new Error(`Phone number invalid, please provide your phone number in the format +234XXXXXXXX`);
                        }
                        return true;
                    }),
                    (0, express_validator_1.body)('password').notEmpty().notEmpty().withMessage('Password is required'),
                ];
        }
        return validationScope;
    }
}
exports.Controller = Controller;
exports.default = new Controller();
//# sourceMappingURL=controller.js.map