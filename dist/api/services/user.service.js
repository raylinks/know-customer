"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../database/data-access/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    async signInUser(phoneNumber, password) {
        try {
            const userExists = await (0, user_1.findUser)({ phoneNumber });
            if (userExists === null) {
                return false;
            }
            if (userExists.password === undefined) {
                return false;
            }
            const isPasswordMatched = await bcrypt_1.default.compare(password, userExists.password);
            if (!isPasswordMatched) {
                return false;
            }
            const jwtPayload = {
                phoneNumber: userExists.phoneNumber,
                email: userExists.email,
            };
            const token = jsonwebtoken_1.default.sign(jwtPayload, 'JWT_SIGNATURE', { expiresIn: '1d' });
            return token;
        }
        catch (error) {
            return false;
        }
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map