import { type NextFunction, type Request, type Response } from 'express';

import { AuditLogs } from '../database/entity/auditLogs.entity';
import { findByKey } from '../database/data-access/apikey';
import { findUser } from '../database/data-access/user';
import { saveLogDetail } from '../database/data-access/auditLog';

const auditLogMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const xApiKey: string = req.headers['x-api-key'] as string;
  const logReqLifeCycle = new AuditLogs();

  logReqLifeCycle.apiService = (await findByKey(xApiKey)) ?? null;
  logReqLifeCycle.requestBody =
    Object.keys(req.body as Record<string, any>).length > 0 ? JSON.stringify(req.body) : null;
  logReqLifeCycle.requestEndpoint = req.url;
  logReqLifeCycle.requestMethod = req.method;
  logReqLifeCycle.requestInitiatedAt = new Date();
  logReqLifeCycle.responseSentAt = new Date();
  logReqLifeCycle.responseTime = String(Number(new Date().getTime()) - Number(new Date().getTime()));
  logReqLifeCycle.user = (await findUser({ phoneNumber: req.body.phoneNumber })) ?? null;

  const send = res.send;

  res.send = function (body: any): any {
    logReqLifeCycle.responseBody = body;
    send.call(this, body);
    saveLogDetail(logReqLifeCycle)
      .then((res: any) => res)
      .catch();
  };

  next();
};

export default auditLogMiddleware;
