"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamplesService = void 0;
const logger_1 = __importDefault(require("../../common/logger"));
let id = 0;
const examples = [
    { id: id++, name: 'example 0' },
    { id: id++, name: 'example 1' },
];
class ExamplesService {
    async all() {
        logger_1.default.info(examples, 'fetch all examples');
        return await Promise.resolve(examples);
    }
    async byId(id) {
        logger_1.default.info(`fetch example with id ${id}`);
        return await this.all().then((r) => r[id]);
    }
    async create(name) {
        logger_1.default.info(`create example with name ${name}`);
        const example = {
            id: id++,
            name,
        };
        examples.push(example);
        return await Promise.resolve(example);
    }
}
exports.ExamplesService = ExamplesService;
exports.default = new ExamplesService();
//# sourceMappingURL=examples.service.js.map