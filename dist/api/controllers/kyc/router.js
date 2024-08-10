"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const multer_1 = __importDefault(require("multer"));
const enums_1 = require("../../../utils/enums");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post('/verify-selfieid', 
// AuthMiddleWare.authKey,
upload.fields([
    { name: 'frontside', maxCount: 1 },
    { name: 'backside', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
]), controller_1.default.verifySelfieId);
router.post('/kyc3-utility-upload', 
//AuthMiddleWare.authKey,
upload.single('file'), controller_1.default.updateToKYC3);
router.post('/verify-bvn', 
// AuthMiddleWare.authKey,
controller_1.default.validateBodyDto(enums_1.ACCOUNT_VALIDATION.BVN_VERIFICATION), controller_1.default.verifyBvn);
router.get('/verify-user', 
//AuthMiddleWare.authKey,
controller_1.default.validateBodyDto(enums_1.ACCOUNT_VALIDATION.USER_TYPE_VERIFCATION), controller_1.default.verifyLams);
exports.default = router;
//# sourceMappingURL=router.js.map