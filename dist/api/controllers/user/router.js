"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const enums_1 = require("../../../utils/enums");
const router = express_1.default.Router();
router.post('/admin-authenticate', controller_1.default.validateBodyLogin(enums_1.ACCOUNT_VALIDATION.SIGN_IN), controller_1.default.authenticate);
exports.default = router;
//# sourceMappingURL=router.js.map