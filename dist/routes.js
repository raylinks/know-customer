"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./api/controllers/health/router"));
const router_2 = __importDefault(require("./api/controllers/kyc/router"));
const router_3 = __importDefault(require("./api/controllers/apiKey/router"));
const router_4 = __importDefault(require("./api/controllers/user/router"));
const router = express_1.default.Router();
router.get('/', (_, res) => {
    res.send('OK');
});
router.use('/kyc', (req, res, next) => {
    const subRouter = express_1.default.Router();
    subRouter.use('/health', router_1.default);
    subRouter.use('/api/v1/customer', router_2.default);
    subRouter.use('/api/v1/api', router_3.default);
    subRouter.use('/api/v1/admin', router_4.default);
    subRouter(req, res, next);
});
exports.default = router;
//# sourceMappingURL=routes.js.map