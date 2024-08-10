import { findUser } from '../database/data-access/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  async signInUser(phoneNumber: string, password: string): Promise<string | boolean> {
    try {
      const userExists = await findUser({ phoneNumber });
      if (userExists === null) {
        return false;
      }

      if (userExists.password === undefined) {
        return false;
      }
      const isPasswordMatched = await bcrypt.compare(password, userExists.password);
      if (!isPasswordMatched) {
        return false;
      }

      const jwtPayload = {
        phoneNumber: userExists.phoneNumber,
        email: userExists.email,
      };

      const token = jwt.sign(jwtPayload, 'JWT_SIGNATURE', { expiresIn: '1d' });

      return token;
    } catch (error) {
      return false;
    }
  }
}

export default new UserService();
