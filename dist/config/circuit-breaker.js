"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const opossum_1 = __importDefault(require("opossum"));
const logger_1 = __importDefault(require("../common/logger"));
const http = require('http');
async function asyncFunctionThatCouldFail(abortSignal) {
    return await new Promise((resolve, reject) => {
        http.get('http://httpbin.org/delay/10', { signal: abortSignal }, (res) => {
            if (res.statusCode < 300) {
                resolve(res.statusCode);
                return;
            }
            reject(res.statusCode);
        });
    });
}
const abortController = new AbortController();
const options = {
    abortController,
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
};
const breaker = new opossum_1.default(asyncFunctionThatCouldFail, options);
breaker.fire(abortController.signal).then(logger_1.default.info).catch(logger_1.default.error);
// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now');
breaker.on('fallback', (result) => {
    reportFallbackEvent(result);
});
function reportFallbackEvent(result) {
    logger_1.default.info(result);
}
//# sourceMappingURL=circuit-breaker.js.map