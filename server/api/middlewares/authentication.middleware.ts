import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { findByKey, updateApiKey } from '../database/data-access/apikey';
import { findUser } from '../database/data-access/user';
import { sendFailedResponse } from '../../utils/base';

export class AuthMiddleWare {
  async adminAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    const authHeader = req.headers.authorization ?? '';
    if (authHeader === '') return res.status(401).json(sendFailedResponse('UnAuthorized'));

    const token = authHeader.split(' ')[1];
    jwt.verify(token, '88', async (err, decoded: any): Promise<any> => {
      if (err !== null) return res.status(401).json(sendFailedResponse('UnAuthorized'));
      if (decoded === undefined || decoded.phoneNumber === undefined)
        return res.status(401).json(sendFailedResponse('UnAuthorized'));
      const user = await findUser({ phoneNumber: decoded?.phoneNumber });
      if (user === null) return res.status(401).json(sendFailedResponse('UnAuthorized'));
      req.user = user ?? undefined;
      next();
    });
  }

  async authKey(req: Request, res: Response, next: NextFunction): Promise<any> {
    const apiKey = req.header('x-api-key') ?? '';
    if (apiKey === '') {
      return res.status(403).json(sendFailedResponse('api  key required'));
    }
    const account = await findByKey(apiKey);

    if (account !== null) {
      const today = new Date().toISOString().split('T')[0];
      const usageCount = account.usage.findIndex((day) => day.date === today);
      if (usageCount >= 0) {
        if (account.usage[usageCount].count >= Number(7)) {
          return res.status(429).json(sendFailedResponse('Max API calls exceeded.', {}, 429));
        } else {
          account.usage[usageCount].count++;
          next();
        }
      } else {
        account.usage.push({ date: today, count: 1 });
        updateApiKey(account);
        next();
      }
    } else {
      return res.status(403).json(sendFailedResponse('Access Denied', 403));
    }
  }
}

export default new AuthMiddleWare();
