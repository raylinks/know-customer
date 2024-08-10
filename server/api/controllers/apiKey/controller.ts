import { type Request, type Response } from 'express';
import { ACCOUNT_VALIDATION } from '../../../utils/enums';
import { type ValidationChain, query, validationResult } from 'express-validator';
import { sendFailedResponse, sendSuccessResponse } from '../../../utils/base';
// import { regenerateApiKey } from '../../database/data-access/apikey';

export class Controller {
  // async createAPiKey(req: Request, res: Response): Promise<any> {
  //   /* #swagger.tags = ['API']
  //   #swagger.description = 'Endpoint to create api key' */
  //   const validateRequest = validationResult(req);
  //   if (!validateRequest.isEmpty()) {
  //     return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
  //   }

  //   const isTestKey = req.query.is_test_key === 'true';
  //   const serviceName = req.query.service_name as string;
  //   try {
  //     if (req.user !== undefined) {
  //       const apiKey = await regenerateApiKey(isTestKey, req.user, serviceName);
  //       res.status(200).json(sendSuccessResponse('api created successfully', { apiKey })).end();
  //     } else {
  //       throw new Error('Forbidden Access');
  //     }
  //   } catch (error: any) {
  //     return res
  //       .status(403)
  //       .json(sendFailedResponse((error.message as string) ?? 'An unexpected error occurred'))
  //       .end();
  //   }
  // }

  // public validateApiKeyDto(type: ACCOUNT_VALIDATION): ValidationChain[] {
  //   let validationScope: ValidationChain[] = [];
  //   switch (type) {
  //     case ACCOUNT_VALIDATION.CREATE_API_KEY:
  //       validationScope = [query('is_test_key').notEmpty().isBoolean(), query('service_name').notEmpty().isString()];
  //       break;

  //     default:
  //       break;
  //   }

  //   return validationScope;
  // }
}

export default new Controller();
