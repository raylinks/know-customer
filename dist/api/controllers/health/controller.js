"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const health_service_1 = __importDefault(require("../../services/health.service"));
class Controller {
    health(_, res) {
        /* 	#swagger.tags = ['Health']
    #swagger.description = 'Endpoint for health' */
        health_service_1.default.health().then((r) => res.json(r));
    }
}
exports.Controller = Controller;
exports.default = new Controller();
//# sourceMappingURL=controller.js.map