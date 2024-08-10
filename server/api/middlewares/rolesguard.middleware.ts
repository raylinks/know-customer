import { type Request, type Response, type NextFunction } from 'express';
import { sendFailedResponse } from '../../utils/base';
import { type USER_ROLE } from '../../utils/enums';

const RolesGuard =
  (role: USER_ROLE) =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userRole = req.user;
      if (userRole !== undefined && userRole.role === role) {
        next();
      } else {
        res.status(401).json(sendFailedResponse('UnAuthorized'));
      }
    } catch (error) {
      res.status(401).json(sendFailedResponse('UnAuthorized'));
    }
  };

export default RolesGuard;
