import { type User } from './server/api/database/entity/user.entity';
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export {};
