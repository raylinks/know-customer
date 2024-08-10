import express from 'express';
import controller from './controller';
import { ACCOUNT_VALIDATION } from '../../../utils/enums';

const router = express.Router();

router.post('/admin-authenticate', controller.validateBodyLogin(ACCOUNT_VALIDATION.SIGN_IN), controller.authenticate);

export default router;
