import express from 'express';
import controller from './controller';
import { ACCOUNT_VALIDATION, USER_ROLE } from '../../../utils/enums';
import AuthMiddleWare from '../../middlewares/authentication.middleware';
import RolesGuard from '../../middlewares/rolesguard.middleware';

const router = express.Router();

//router.post(
  ////'/create-api-key',
  //AuthMiddleWare.adminAuth,
 // RolesGuard(USER_ROLE.ADMIN),
  //controller.validateApiKeyDto(ACCOUNT_VALIDATION.CREATE_API_KEY),
  //controller.createAPiKey,
//);

export default router;
