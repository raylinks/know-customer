import express from 'express';
import controller from './controller';
import multer from 'multer';
import { ACCOUNT_VALIDATION } from '../../../utils/enums';
import AuthMiddleWare from '../../middlewares/authentication.middleware';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post(
  '/verify-selfieid',
  // AuthMiddleWare.authKey,
  upload.fields([
    { name: 'frontside', maxCount: 1 },
    { name: 'backside', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  controller.verifySelfieId,
);
router.post(
  '/kyc3-utility-upload',
  //AuthMiddleWare.authKey,
  upload.single('file'),
  controller.updateToKYC3,
);

router.post(
  '/verify-bvn',
  // AuthMiddleWare.authKey,
  controller.validateBodyDto(ACCOUNT_VALIDATION.BVN_VERIFICATION),
  controller.verifyBvn,
);
router.get(
  '/verify-user',
  //AuthMiddleWare.authKey,
  controller.validateBodyDto(ACCOUNT_VALIDATION.USER_TYPE_VERIFCATION),
  controller.verifyLams,
);

export default router;
