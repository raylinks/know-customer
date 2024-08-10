import axios from 'axios';
import { IDENTITY_TYPE } from '../../../utils/enums';
import L from '../../../common/logger';
require('dotenv').config();
const env = JSON.parse(process.env.APP_SECRETS ?? '{}');

const YOUVERIFY_TOKEN = env.YOUVERIFY_TOKEN;
const YOUVERIFY_BASE_URL = env.YOUVERIFY_BASE_URL;

export class YouVerifyService {
  constructor() {
    if (YOUVERIFY_TOKEN === null || YOUVERIFY_BASE_URL === null) {
      throw new Error('YouVerify service has not been properly configured');
    }
  }

  async resolveBVN(bvn: any): Promise<any> {
    try {
      const data = {
        id: bvn,
        isSubjectConsent: true,
      };
      const result = await axios.post(`${YOUVERIFY_BASE_URL}/v2/api/identity/ng/bvn`, data, {
        headers: { Token: `${YOUVERIFY_TOKEN}` },
      });

      return result.data;
    } catch (error) {
      L.error(error);
      throw new Error(`Error validating user BVN: ${error.message}`);
    }
  }

  async idSelfieVerification(payload: any): Promise<any> {
    try {
      const verificationMethod = payload.verificationType;
      let req, reqData: any;

      switch (verificationMethod) {
        case IDENTITY_TYPE.INTERNATIONAL_PASSPORT:
          reqData = {
            id: payload.identityNo,
            lastName: payload.lastName,
            isSubjectConsent: true,
            validations: {
              selfie: {
                image: payload.imageData,
              },
            },
          };
          req = await axios.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/passport`, reqData, {
            headers: { Token: `${env.YOUVERIFY_TOKEN}` },
          });
          break;
        case IDENTITY_TYPE.DRIVERS_LICENSE:
          reqData = {
            id: payload.identityNo,
            isSubjectConsent: true,
            validations: {
              selfie: {
                image: payload.imageData,
              },
            },
          };

          req = await axios.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/drivers-license`, reqData, {
            headers: { Token: `${env.YOUVERIFY_TOKEN}` },
          });
          break;
        case IDENTITY_TYPE.NIN_SLIP:
          reqData = {
            id: payload.identityNo,
            isSubjectConsent: true,
            validations: {
              selfie: {
                image: payload.imageData,
              },
            },
          };
          req = await axios.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/nin`, reqData, {
            headers: { Token: `${env.YOUVERIFY_TOKEN}` },
          });
          break;
        case IDENTITY_TYPE.VOTERS_CARD:
          reqData = {
            id: payload.identityNo,
            isSubjectConsent: true,
            validations: {
              data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                dateOfBirth: payload.dateOfBirth,
              },
            },
          };

          req = await axios.post(`${env.YOUVERIFY_BASE_URL}/v2/api/identity/ng/pvc`, reqData, {
            headers: { Token: `${env.YOUVERIFY_TOKEN}` },
          });

          break;
      }

      const result = req?.data;

      return result;
    } catch (error) {
      L.error(error);

      return { success: false, message: error.message };
    }
  }
}
