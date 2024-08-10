import { type Request, type Response, type NextFunction } from 'express';
import { type USER_ROLE } from '../../utils/enums';
declare const RolesGuard: (role: USER_ROLE) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
export default RolesGuard;
