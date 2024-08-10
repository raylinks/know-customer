import express from 'express';
import healthRouter from './api/controllers/health/router';
import kycRouter from './api/controllers/kyc/router';
import apiKeyRouter from './api/controllers/apiKey/router';
import adminUserRouter from './api/controllers/user/router';

const router = express.Router();

router.get('/', (_, res) => {
  res.send('OK');
});
router.use('/kyc', (req, res, next) => {
  const subRouter = express.Router();

  subRouter.use('/health', healthRouter);
  subRouter.use('/api/v1/customer', kycRouter);
  subRouter.use('/api/v1/api', apiKeyRouter);
  subRouter.use('/api/v1/admin', adminUserRouter);

  subRouter(req, res, next);
});

export default router;
