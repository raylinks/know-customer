import { type ResponseI } from './interface';
export declare const sendSuccessResponse: (message: string, payload?: any, statusCode?: number) => ResponseI;
export declare const sendFailedResponse: (message: string, payload?: any, statusCode?: number) => ResponseI;
