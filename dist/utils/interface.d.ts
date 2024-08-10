import { type IDENTITY_TYPE } from './enums';
export interface ResponseI<T = any> {
    success: boolean;
    payload: T;
    message: string;
    statusCode: number;
}
export interface FileStoreInfo {
    key: string;
    url: string;
    type: IDENTITY_TYPE;
}
export interface IdentityProvider {
    resolveBVN: (bvn: string) => Promise<any>;
}
export interface LamsResponseSuccess {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bvn: string;
    address: any;
    championId: string;
}
export interface LamsResponseFailed {
    status: string;
    code: number;
    message: string;
}
