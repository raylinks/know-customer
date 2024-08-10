import { type Request, type Response } from 'express';
import { type ValidationChain } from 'express-validator';
import { ACCOUNT_VALIDATION } from '../../../utils/enums';
export declare class Controller {
    authenticate(req: Request, res: Response): Promise<any>;
    validateBodyLogin(type: ACCOUNT_VALIDATION): ValidationChain[];
}
declare const _default: Controller;
export default _default;
