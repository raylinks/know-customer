import { type NextFunction, type Request, type Response } from 'express';
export declare class AuthMiddleWare {
    adminAuth(req: Request, res: Response, next: NextFunction): Promise<any>;
    authKey(req: Request, res: Response, next: NextFunction): Promise<any>;
}
declare const _default: AuthMiddleWare;
export default _default;
