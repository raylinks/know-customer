"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFailedResponse = exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (message, payload = {}, statusCode = 200) => ({
    success: true,
    payload,
    message,
    statusCode,
});
exports.sendSuccessResponse = sendSuccessResponse;
const sendFailedResponse = (message, payload = {}, statusCode = 400) => ({
    success: false,
    payload,
    message,
    statusCode,
});
exports.sendFailedResponse = sendFailedResponse;
//# sourceMappingURL=base.js.map