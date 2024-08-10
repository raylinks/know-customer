"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auditLogs_entity_1 = require("../database/entity/auditLogs.entity");
const apikey_1 = require("../database/data-access/apikey");
const user_1 = require("../database/data-access/user");
const auditLog_1 = require("../database/data-access/auditLog");
const auditLogMiddleware = async (req, res, next) => {
    var _a, _b;
    const xApiKey = req.headers['x-api-key'];
    const logReqLifeCycle = new auditLogs_entity_1.AuditLogs();
    logReqLifeCycle.apiService = (_a = (await (0, apikey_1.findByKey)(xApiKey))) !== null && _a !== void 0 ? _a : null;
    logReqLifeCycle.requestBody =
        Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : null;
    logReqLifeCycle.requestEndpoint = req.url;
    logReqLifeCycle.requestMethod = req.method;
    logReqLifeCycle.requestInitiatedAt = new Date();
    logReqLifeCycle.responseSentAt = new Date();
    logReqLifeCycle.responseTime = String(Number(new Date().getTime()) - Number(new Date().getTime()));
    logReqLifeCycle.user = (_b = (await (0, user_1.findUser)({ phoneNumber: req.body.phoneNumber }))) !== null && _b !== void 0 ? _b : null;
    const send = res.send;
    res.send = function (body) {
        logReqLifeCycle.responseBody = body;
        send.call(this, body);
        (0, auditLog_1.saveLogDetail)(logReqLifeCycle)
            .then((res) => res)
            .catch();
    };
    next();
};
exports.default = auditLogMiddleware;
//# sourceMappingURL=auditLogger.middleware.js.map