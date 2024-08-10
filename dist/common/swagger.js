"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: '1.0.0',
        title: 'BACKEND-SCAFFOLD',
        description: '<b> backend scaffold</b>',
    },
    host: 'localhost:80',
    basePath: '/',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Example',
            description: 'Endpoints for example service',
        },
        {
            name: 'Health',
            description: 'Endpoints For health service',
        },
        {
            name: 'KYC',
            description: 'Endpoints For kyc verification',
        },
        {
            name: 'Admin',
            description: 'Endpoints For Admin authentication',
        },
        {
            name: 'API',
            description: 'Endpoints For Api consumption',
        },
    ],
    securityDefinitions: {
        device_Id: {
            type: 'apiKey',
            name: 'x-device-id',
            in: 'header',
        },
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format **Bearer &lt;token>**',
        },
    },
    definitions: {},
};
const outputFile = './swagger.json';
const routes = ['./routes.ts'];
(0, swagger_autogen_1.default)(outputFile, routes, doc);
//# sourceMappingURL=swagger.js.map