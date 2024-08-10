export declare class IdentityProviderService {
    private readonly identityProviders;
    private activeProviderKey;
    constructor();
    resolveBVN(bvn: string): Promise<any>;
    idSelfieVerification(payload: any): Promise<any>;
    reportFallbackEvent(result: any): void;
    handleFallBack(): void;
}
