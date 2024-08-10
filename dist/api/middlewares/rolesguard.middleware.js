"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../utils/base");
const RolesGuard = (role) => async (req, res, next) => {
    try {
        const userRole = req.user;
        if (userRole !== undefined && userRole.role === role) {
            next();
        }
        else {
            res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
        }
    }
    catch (error) {
        res.status(401).json((0, base_1.sendFailedResponse)('UnAuthorized'));
    }
};
exports.default = RolesGuard;
//# sourceMappingURL=rolesguard.middleware.js.map