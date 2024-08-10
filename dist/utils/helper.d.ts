export declare function validPhoneNumber(phoneNumber: string): void;
export declare function encode(text: string, secret?: null): Promise<any>;
export declare function decode(text: string, secret?: null): Promise<any>;
export declare function generateOtp(payload: {
    validityDuration: number;
    size: number;
    phoneNumber: string;
}): Promise<{
    otp: string;
    timestamp: Date;
    expirationTime: string;
}>;
