import { ACCOUNT_VALIDATION, UserTypes } from '../../../utils/enums';
import { type ValidationChain, body, validationResult, query } from 'express-validator';
import { type Request, type Response } from 'express';
import KycService from '../../services/kyc.service';
import { findUser, updateUser } from '../../database/data-access/user';
import { User } from '../../database/entity/user.entity';
import { VerifyBvnDto } from './dto/verifyBvn.dto';
import { sendFailedResponse, sendSuccessResponse } from '../../../utils/base';
import { type VerifySelfieIdDto } from './dto/verifySelfieId.dto';

export class Controller {
  public async verifyBvn(req: Request, res: Response): Promise<any> {
    /* 	#swagger.tags = ['KYC']
#swagger.description = 'Endpoint for bvn verification' */
    const validateRequest = validationResult(req);
    if (!validateRequest.isEmpty()) {
      return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
    }
    let createUser;
    const {
      phoneNumber,
      firstName,
      otherName,
      lastName,
      dateOfBirth,
    }: {
      phoneNumber: string;
      firstName: string;
      otherName: string;
      lastName: string;
      dateOfBirth: string;
    } = req.body;

    const userExists = await findUser({ phoneNumber });

    if (userExists === null) {
      // const create user from payload
      const user = new User();
      user.dateOfBirth = dateOfBirth;
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.otherName = otherName;

      createUser = await updateUser(user, user.fullName());

      if (createUser === null) {
        createUser = user;
      }
    } else {
      createUser = userExists;
    }

    // TODO: handle error if unable to create user

    /* check lams if user has already been verified */
    const lamsVerification = await KycService.verifyLamsBvn(phoneNumber);

    if (lamsVerification.success) {
      createUser.email = lamsVerification.payload.email;
      const lamUserPayload = new VerifyBvnDto();

      lamUserPayload.bvn = lamsVerification.payload.bvn;
      lamUserPayload.dateOfBirth = dateOfBirth;
      lamUserPayload.firstName = firstName;
      lamUserPayload.lastName = lastName;
      lamUserPayload.otherName = otherName;
      lamUserPayload.phoneNumber = phoneNumber;

      const result = await KycService.verifyBvn(createUser, lamUserPayload, lamsVerification.success);
      return res.status(200).json({ ...result });
    }

    try {
      if (createUser !== null) {
        const verify = await KycService.verifyBvn(createUser, req.body as VerifyBvnDto);
        return res.status(verify.statusCode).json({ ...verify });
      } else {
        throw new Error('Forbidden Access');
      }
    } catch (error) {
      return res.status(403).json(sendFailedResponse('An unexpected error occurred'));
    }
  }

  public async verifyLams(req: Request, res: Response): Promise<any> {
    /* 	#swagger.tags = ['KYC']
#swagger.description = 'Endpoint for lams verification' */
    const validateRequest = validationResult(req);
    if (!validateRequest.isEmpty()) {
      return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
    }
    let phoneNumber = req?.query?.phoneNumber as string;
    if (phoneNumber !== undefined && phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber.trim();
    }

    // if (!/^\+[1-9]{3,3}\d{10,10}$/.test(phoneNumber.replace(/\s+/g, ''))) {
    //   return res.status(422).json(sendFailedResponse(`Invalid Phone Number Format`));
    // }
    const payload = {
      userType: UserTypes.IS_EXTERNAL_USER,
      phoneNumber,
      data: {},
    };

    const lamsVerification = await KycService.verifyLamsBvn(phoneNumber);
    //console.log('ee', lamsVerification);
    if (lamsVerification.success) {
      payload.userType = UserTypes.IS_LAMS_CHAMPS;
      payload.data = lamsVerification.payload;
      return res.status(200).json(sendSuccessResponse(lamsVerification.message, payload));
    }

    // TODO!:- check user exists in a spread sheet for external users (MAX STAFF)
    if (phoneNumber === '+2348095607948') {
      // this is for theo update
      payload.userType = UserTypes.IS_MAX_STAFF;
      return res.status(200).json(sendSuccessResponse('success', payload));
    }

    /** this block returns default response such that user is not a max staff or lams champ */
    return res.status(200).json(sendSuccessResponse('success', payload));
  }

  public validateBodyDto(type: ACCOUNT_VALIDATION): ValidationChain[] {
    let validationScope: ValidationChain[] = [];

    switch (type) {
      case ACCOUNT_VALIDATION.BVN_VERIFICATION:
        validationScope = [
          body('phoneNumber')
            .notEmpty()
            .custom((value: string) => {
              if (!/^\+[1-9]{3,3}\d{10,10}$/.test(value.replace(/\s+/g, ''))) {
                throw new Error(`Phone number invalid, please provide your phone number in the format +234XXXXXXXX`);
              }
              return true;
            }),
          body('bvn').notEmpty().isString().isLength({ min: 11, max: 11 }),
          body('firstName').isString().notEmpty(),
          body('otherName').isString().optional(),
          body('lastName').isString().notEmpty(),
          body('dateOfBirth').isString().notEmpty().withMessage('Date of birth must be in the format YYYY-MM-DD'),
        ];
        break;
      case ACCOUNT_VALIDATION.USER_TYPE_VERIFCATION:
        validationScope = [query('phoneNumber').notEmpty()];
        break;

      default:
        break;
    }

    return validationScope;
  }

  public async verifySelfieId(req: Request, res: Response): Promise<any> {
    const validateRequest = validationResult(req);
    if (!validateRequest.isEmpty()) {
      return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
    }

    const {
      phoneNumber,
    }: {
      phoneNumber: string;
    } = req.body;

    try {
      const user = await findUser({ phoneNumber });

      if (user?.kycLevel?.verifiedBvn === false) {
        throw new Error('kindly verify BVN to proceed');
      }

      if (user !== null) {
        const files = req.files as Record<string, Express.Multer.File[]>;

        const verify = await KycService.uploadIdForKYC2(user, req.body as VerifySelfieIdDto, files);
        return res.status(verify.statusCode).json({ ...verify });
      } else {
        throw new Error('Forbidden Access');
      }
    } catch (error) {
      res.status(403).send({ error: error.message ?? 'An unexpected error occurred' });
    }
  }

  public async updateToKYC3(req: Request, res: Response): Promise<any> {
    const validateRequest = validationResult(req);
    if (!validateRequest.isEmpty()) {
      return res.status(422).json({ errors: validateRequest.array({ onlyFirstError: true }) });
    }

    const {
      phoneNumber,
    }: {
      phoneNumber: string;
    } = req.body;

    const utility = req.file;

    try {
      const user = await findUser({ phoneNumber });

      if (user !== null && utility !== undefined) {
        const verify = await KycService.updateToKYC3(user, req.body, utility);
        return res.status(verify.statusCode).json({ ...verify });
      } else {
        throw new Error('Forbidden Access');
      }
    } catch (error) {
      res.status(403).send({ error: error.message ?? 'An unexpected error occurred' });
    }
  }

  public validateBodyVerifySelfie(): ValidationChain[] {
    let validationScope: ValidationChain[] = [];

    validationScope = [
      body('identityNo').notEmpty().isString(),
      body('firstName').isString().notEmpty(),
      body('lastName').isString().optional(),
      body('verificationType').isString().notEmpty(),
      body('dateOfBirth').isString().notEmpty().withMessage('Date of birth must be in the format YYYY-MM-DD'),
    ];

    return validationScope;
  }
}
export default new Controller();
