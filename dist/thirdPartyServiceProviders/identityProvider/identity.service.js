"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProviderService = void 0;
const opossum_1 = __importDefault(require("opossum"));
const logger_1 = __importDefault(require("../../common/logger"));
const identity_provider_1 = require("./identity.provider");
const env = JSON.parse((_a = process.env.APP_SECRETS) !== null && _a !== void 0 ? _a : '{}');
const ACTIVE_IDENTITY_SERVICE_PROVIDER = (_b = env.ACTIVE_IDENTITY_SERVICE_PROVIDER) !== null && _b !== void 0 ? _b : '';
class IdentityProviderService {
    constructor() {
        this.identityProviders = new Map();
        identity_provider_1.IdentityProviders.forEach((Provider) => {
            this.identityProviders.set(Provider.provide, new Provider.UseValue());
        });
        if (ACTIVE_IDENTITY_SERVICE_PROVIDER === null) {
            throw new Error('Identity provider identifier was not provided');
        }
        // no identity provider found
        if (!this.identityProviders.has(ACTIVE_IDENTITY_SERVICE_PROVIDER)) {
            throw new Error('Identity provider has not been properly configured');
        }
        this.activeProviderKey = ACTIVE_IDENTITY_SERVICE_PROVIDER;
    }
    async resolveBVN(bvn) {
        try {
            const activeProvider = this.identityProviders.get(this.activeProviderKey);
            if (activeProvider === null) {
                throw new Error('Active identity provider is not properly configured');
            }
            const abortController = new AbortController();
            const options = {
                abortController,
                timeout: 3000,
                errorThresholdPercentage: 50,
                resetTimeout: 30000,
            };
            const circuitBreaker = new opossum_1.default(activeProvider.resolveBVN(bvn), options);
            circuitBreaker.fallback(() => {
                this.handleFallBack();
            });
            circuitBreaker.on('fallback', (result) => {
                this.reportFallbackEvent(result);
            });
            const response = circuitBreaker.fire(abortController.signal);
            return await response;
        }
        catch (error) {
            logger_1.default.error(error);
            return error.message;
        }
    }
    async idSelfieVerification(payload) {
        try {
            const activeProvider = this.identityProviders.get(this.activeProviderKey);
            if (activeProvider === null) {
                throw new Error('Active identity provider is not properly configured');
            }
            const abortController = new AbortController();
            const options = {
                abortController,
                timeout: 3000,
                errorThresholdPercentage: 50,
                resetTimeout: 30000,
            };
            const circuitBreaker = new opossum_1.default((await activeProvider.idSelfieVerification(payload)), options);
            circuitBreaker.fallback(() => {
                this.handleFallBack();
            });
            circuitBreaker.on('fallback', (result) => {
                this.reportFallbackEvent(result);
            });
            const response = circuitBreaker.fire(abortController.signal);
            return await response;
        }
        catch (error) {
            logger_1.default.error(error);
        }
    }
    reportFallbackEvent(result) {
        logger_1.default.info(result);
    }
    handleFallBack() {
        // using round robin to switch providers in a case of fail over
        const providerKeys = Array.from(this.identityProviders.keys());
        const currentIndex = providerKeys.indexOf(this.activeProviderKey);
        const nextIndex = (currentIndex + 1) % providerKeys.length;
        const nextProviderKey = providerKeys[nextIndex];
        this.activeProviderKey = nextProviderKey;
        logger_1.default.warn('Fallback: switching to another identity provider');
    }
}
exports.IdentityProviderService = IdentityProviderService;
//# sourceMappingURL=identity.service.js.map