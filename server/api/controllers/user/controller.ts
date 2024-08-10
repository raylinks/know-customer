import { type Request, type Response } from 'express';
import { type ValidationChain, body, validationResult } from 'express-validator';
import { ACCOUNT_VALIDATION } from '../../../utils/enums';
import UserService from '../../services/user.service';
import { sendSuccessResponse } from '../../../utils/base';

export class Controller {
  async authenticate(req: Request, res: Response): Promise<any> {
    /* 	#swagger.tags = ['Admin']
#swagger.description = 'Endpoint to authenticate admin' */
    const validateRequest = validationResult(req);
    if (!validateRequest.isEmpty()) {
      return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
    }
    const { phoneNumber, password }: { phoneNumber: string; password: string } = req.body;
    try {
      const accessToken = await UserService.signInUser(phoneNumber, password);
      if (accessToken === false) {
        return res.status(400).json({
          status: 400,
          message: 'UnAuthorized',
        });
      }
      return res.status(200).json(sendSuccessResponse('success', { accessToken }));
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message.toString(),
      });
    }
  }

  public validateBodyLogin(type: ACCOUNT_VALIDATION): ValidationChain[] {
    let validationScope: ValidationChain[] = [];

    switch (type) {
      case ACCOUNT_VALIDATION.SIGN_IN:
        validationScope = [
          body('phoneNumber')
            .notEmpty()
            .custom((value: string) => {
              if (!/^\+[1-9]{3,3}\d{10,10}$/.test(value.replace(/\s+/g, ''))) {
                throw new Error(`Phone number invalid, please provide your phone number in the format +234XXXXXXXX`);
              }
              return true;
            }),

          body('password').notEmpty().notEmpty().withMessage('Password is required'),
        ];
    }

    return validationScope;
  }
}

export default new Controller();
