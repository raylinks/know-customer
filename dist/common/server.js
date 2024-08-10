"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./logger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const routes_1 = __importDefault(require("../routes"));
const data_source_1 = require("../data-source");
const pino_http_1 = __importDefault(require("pino-http"));
// import auditLogMiddleware from '../api/middlewares/auditLogger.middleware';
const app = (0, express_1.default)();
const env = JSON.parse((_a = process.env.APP_SECRETS) !== null && _a !== void 0 ? _a : '{}');
// app.use(bodyParser.json())
// unleash.on('synchronized', () => {
//   l.info('Feature flags loaded');
// });
class ExpressServer {
    constructor() {
        var _a, _b, _c;
        const root = path_1.default.normalize(__dirname + '/../..');
        app.use(express_1.default.json({ limit: (_a = env.REQUEST_LIMIT) !== null && _a !== void 0 ? _a : '100kb' }));
        app.use(express_1.default.urlencoded({
            extended: true,
            limit: (_b = env.REQUEST_LIMIT) !== null && _b !== void 0 ? _b : '100kb',
        }));
        app.use(express_1.default.text({ limit: (_c = env.REQUEST_LIMIT) !== null && _c !== void 0 ? _c : '100kb' }));
        app.use((0, cookie_parser_1.default)(env.SESSION_SECRET));
        app.use(express_1.default.static(`${root}/public`));
        app.use((0, pino_http_1.default)({
            serializers: {
                req: (req) => ({
                    id: req.id,
                    method: req.method,
                    url: req.url,
                }),
                res: (res) => ({
                    statusCode: res.statusCode,
                }),
            },
        }));
        //app.use(auditLogMiddleware);
        app.use('/', routes_1.default);
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        // load all secrets
        //SecretManager.loadSecrets();
        data_source_1.dataSource
            .initialize()
            .then(async () => {
            // await runSeeders(dataSource);
            logger_1.default.info('Data source intitialized...');
            // process.exit();
        })
            .catch((err) => {
            logger_1.default.error(err);
        });
    }
    router(routes) {
        this.routes = routes;
        return this;
    }
    listen(port) {
        const welcome = (p) => () => {
            var _a;
            logger_1.default.info('---------------------------------');
            logger_1.default.info(`🚀 App is up and running in ${(_a = env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development'} @: ${os_1.default.hostname()} on port: ${p}} 🚀`);
            logger_1.default.info('---------------------------------');
        };
        const server = http_1.default.createServer(app);
        server.on('error', (err) => {
            logger_1.default.info(err.message);
            throw err;
        });
        server.listen(port, welcome(port));
        return app;
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map