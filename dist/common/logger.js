"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const l = (0, pino_1.default)({
    name: "kyc",
    level: "info",
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
});
exports.default = l;
//# sourceMappingURL=logger.js.map