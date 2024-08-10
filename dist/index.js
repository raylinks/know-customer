"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("./common/env");
const server_1 = __importDefault(require("./common/server"));
const express_1 = __importDefault(require("express"));
const pino_http_1 = __importDefault(require("pino-http"));
const app = (0, express_1.default)();
app.use((0, pino_http_1.default)());
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '80');
exports.default = new server_1.default().listen(port);
//# sourceMappingURL=index.js.map