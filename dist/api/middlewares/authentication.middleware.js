"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apikey_1 = require("../database/data-access/apikey");
const user_1 = require("../database/data-access/user");
const base_1 = require("../../utils/base");
class AuthMiddleWare {
    async adminAuth(req, res, next) {
        var _a;
        const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
        if (authHeader === '')
            return res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, '88', async (err, decoded) => {
            if (err !== null)
                return res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
            if (decoded === undefined || decoded.phoneNumber === undefined)
                return res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
            const user = await (0, user_1.findUser)({ phoneNumber: decoded === null || decoded === void 0 ? void 0 : decoded.phoneNumber });
            if (user === null)
                return res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
            req.user = user !== null && user !== void 0 ? user : undefined;
            next();
        });
    }
    async authKey(req, res, next) {
        var _a;
        const apiKey = (_a = req.header('x-api-key')) !== null && _a !== void 0 ? _a : '';
        if (apiKey === '') {
            return res.status(403).json((0, base_1.sendFailedResponse)('api  key required'));
        }
        const account = await (0, apikey_1.findByKey)(apiKey);
        if (account !== null) {
            const today = new Date().toISOString().split('T')[0];
            const usageCount = account.usage.findIndex((day) => day.date === today);
            if (usageCount >= 0) {
                if (account.usage[usageCount].count >= Number(7)) {
                    return res.status(429).json((0, base_1.sendFailedResponse)('Max API calls exceeded.', {}, 429));
                }
                else {
                    account.usage[usageCount].count++;
                    next();
                }
            }
            else {
                account.usage.push({ date: today, count: 1 });
                (0, apikey_1.updateApiKey)(account);
                next();
            }
        }
        else {
            return res.status(403).json((0, base_1.sendFailedResponse)('Access Denied', 403));
        }
    }
}
exports.AuthMiddleWare = AuthMiddleWare;
exports.default = new AuthMiddleWare();
//# sourceMappingURL=authentication.middleware.js.map