import { ACCOUNT_VALIDATION } from '../../../utils/enums';
import { type ValidationChain } from 'express-validator';
import { type Request, type Response } from 'express';
export declare class Controller {
    verifyBvn(req: Request, res: Response): Promise<any>;
    verifyLams(req: Request, res: Response): Promise<any>;
    validateBodyDto(type: ACCOUNT_VALIDATION): ValidationChain[];
    verifySelfieId(req: Request, res: Response): Promise<any>;
    updateToKYC3(req: Request, res: Response): Promise<any>;
    validateBodyVerifySelfie(): ValidationChain[];
}
declare const _default: Controller;
export default _default;
