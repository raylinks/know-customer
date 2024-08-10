import { type NextFunction, type Request, type Response } from 'express';
declare const auditLogMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auditLogMiddleware;
