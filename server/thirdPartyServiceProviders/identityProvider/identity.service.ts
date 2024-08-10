import CircuitBreaker from 'opossum';
import L from '../../common/logger';
import { IdentityProviders as idProviders } from './identity.provider';
const env = JSON.parse(process.env.APP_SECRETS ?? '{}');

const ACTIVE_IDENTITY_SERVICE_PROVIDER = env.ACTIVE_IDENTITY_SERVICE_PROVIDER ?? '';

export class IdentityProviderService {
  private readonly identityProviders: Map<string, any>; // Map to store identity providers
  private activeProviderKey: string;

  constructor() {
    this.identityProviders = new Map();
    idProviders.forEach((Provider) => {
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

  async resolveBVN(bvn: string): Promise<any> {
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
      const circuitBreaker = new CircuitBreaker(
        activeProvider.resolveBVN(bvn) as (...args: unknown[]) => Promise<unknown>,
        options,
      );

      circuitBreaker.fallback(() => {
        this.handleFallBack();
      });
      circuitBreaker.on('fallback', (result) => {
        this.reportFallbackEvent(result);
      });

      const response = circuitBreaker.fire(abortController.signal);
      return await response;
    } catch (error) {
      L.error(error);
      return error.message;
    }
  }

  async idSelfieVerification(payload: any): Promise<any> {
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
      const circuitBreaker = new CircuitBreaker(
        (await activeProvider.idSelfieVerification(payload)) as (...args: unknown[]) => Promise<unknown>,
        options,
      );
      circuitBreaker.fallback(() => {
        this.handleFallBack();
      });
      circuitBreaker.on('fallback', (result) => {
        this.reportFallbackEvent(result);
      });

      const response = circuitBreaker.fire(abortController.signal);

      return await response;
    } catch (error) {
      L.error(error);
    }
  }

  reportFallbackEvent(result: any): void {
    L.info(result);
  }

  handleFallBack(): void {
    // using round robin to switch providers in a case of fail over
    const providerKeys = Array.from(this.identityProviders.keys());
    const currentIndex = providerKeys.indexOf(this.activeProviderKey);
    const nextIndex = (currentIndex + 1) % providerKeys.length;
    const nextProviderKey = providerKeys[nextIndex];

    this.activeProviderKey = nextProviderKey;
    L.warn('Fallback: switching to another identity provider');
  }
}
