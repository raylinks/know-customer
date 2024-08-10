import { IdentityProviderService } from '../../thirdPartyServiceProviders/identityProvider/identity.service';
import { sendFailedResponse, sendSuccessResponse } from '../../utils/base';
import { IDENTITY_TYPE, Kyc3Status, KycLevelStatus } from '../../utils/enums';
import { isBVNValidatedByAnyUser, saveBvnRecord, updateBvn } from '../database/data-access/bvn';
import { findUser, updateUser } from '../database/data-access/user';
import { type Bvn } from '../database/entity/bvn.entity';
import moments from 'moment';
import L from '../../common/logger';
import { findOne, savePrivateFileRecord } from '../database/data-access/kycdocument';
import { type LamsResponseFailed, type LamsResponseSuccess, type ResponseI } from '../../utils/interface';
import { type User } from '../database/entity/user.entity';
import { type KycDocumentsEntity } from '../database/entity/kycDocuments.entity';
import axios from 'axios';
import { type VerifyBvnDto } from '../controllers/kyc/dto/verifyBvn.dto';
import { CloudinaryService } from '../../thirdPartyServiceProviders/cloudinary/cloudinary.service';
import { createKyc, saveKycDetails } from '../database/data-access/kycLevel';
import { type VerifySelfieIdDto } from '../controllers/kyc/dto/verifySelfieId.dto';

require('dotenv').config();
const sec = JSON.parse(process.env.APP_SECRETS ?? '{}');
export class KycService {
  public async verifyBvn(user: User, payload: VerifyBvnDto, isLamsVerified: boolean = false): Promise<ResponseI> {
    try {
      const { bvn }: { bvn: string } = payload;

      let canCallProvider = true;

      if (user === null) {
        return sendFailedResponse('User not found');
      }
      let userKyc = user.kycLevel;

      if (userKyc !== undefined && userKyc !== null && userKyc?.kyclevel !== null) {
        if (userKyc.verifiedBvn === true && userKyc.bvn !== null) {
          return sendSuccessResponse('Customer BVN already Verified');
        }
      }

      userKyc = createKyc({
        user,
        kyclevel: KycLevelStatus.LEVEL_ONE,
        Kyc3Status: Kyc3Status.NOT_INITIATED,
      });

      if (isLamsVerified) {
        user.kycLevel.verifiedBvn = true;
        user.kycLevel.kyclevel = KycLevelStatus.LEVEL_ONE;

        const updatedUser = await updateUser(user, user.fullName());

        return sendSuccessResponse('BVN verified successfully', {
          user: updatedUser,
          bvnPhoneNumber: updatedUser?.phoneNumber,
        });
      }

      const bvnRecord = await isBVNValidatedByAnyUser({ bvn: bvn.trim() });

      if (bvnRecord !== null && bvnRecord?.user?.id !== user.id) {
        return sendFailedResponse('This BVN is linked to another! account');
      }

      let bvnResponse;
      if (bvnRecord !== null) {
        canCallProvider = false;
        bvnResponse = {
          success: true,
          data: bvnRecord.bvnData,
        };
      }

      if (canCallProvider) {
        const identityProviderService = new IdentityProviderService();
        bvnResponse = await identityProviderService.resolveBVN(bvn);
      }

      if (bvnResponse !== undefined && bvnResponse.success === true && bvnResponse.data.status === 'found') {
        let savedBvnData: Partial<Bvn | null>;
        if (canCallProvider) {
          const bvnDataInput = {
            user,
            bvn,
            bvnData: bvnResponse.data,
          };

          savedBvnData = await saveBvnRecord(bvnDataInput);
        } else {
          savedBvnData = bvnRecord;
        }

        const providerValidationDetails = {
          firstName: bvnResponse.data.firstName,
          middleName: bvnResponse.data.middleName,
          lastName: bvnResponse.data.lastName,
          dateOfBirth: bvnResponse.data.dateOfBirth,
        };

        const validation = await this.bvnVerificationPercentage(payload, providerValidationDetails);
        if (!validation.status) {
          return sendFailedResponse(validation.message);
        }

        if (validation.validityPercentage < 80) {
          userKyc.bvn = undefined;
          userKyc.bvnVerificationCount = 0;
          if (savedBvnData?.id !== undefined) {
            await updateBvn(savedBvnData.id, { validityPercentage: validation.validityPercentage });
          }

          return sendFailedResponse('Incorrect Bvn');
        }

        if (savedBvnData?.id !== undefined) {
          await updateBvn(savedBvnData.id, { validityPercentage: validation.validityPercentage, isValid: true });
        }
        user.firstName = bvnResponse.data.firstName?.trim().toLowerCase();
        user.otherName = bvnResponse.data.middleName?.trim().toLowerCase();
        user.lastName = bvnResponse.data.lastName?.trim().toLowerCase();
        user.dateOfBirth = moments(bvnResponse.data?.dateOfBirth as string).format('YYYY-MM-DD');
      } else {
        userKyc.bvnVerificationCount =
          userKyc.bvnVerificationCount === undefined ? 0 : userKyc.bvnVerificationCount + 1;
        userKyc.bvn = undefined;
        userKyc.comment = 'bvn not found';
        await saveKycDetails(userKyc);

        return sendFailedResponse('BVN verification failed');
      }

      userKyc.verifiedBvn = true;
      userKyc.kyclevel = KycLevelStatus.LEVEL_ONE;
      userKyc.bvn = bvn.trim();

      const kycDet = await saveKycDetails(userKyc);

      user.kycLevel = kycDet;
      const updatedUser = await updateUser(user, user.fullName());

      return sendSuccessResponse('BVN verified successfully', {
        user: updatedUser,
        bvnPhoneNumber: bvnResponse.data.mobile,
      });
    } catch (error) {
      L.error(error);
      return sendFailedResponse('an error occurred');
    }
  }

  public async bvnVerificationPercentage(
    payload: any,
    bvnResponse: { firstName: string; lastName: string; middleName: string; dateOfBirth: string },
  ): Promise<{ status: boolean; message: string; validityPercentage: number }> {
    let namePercentage = 0;
    let dobPercentage = 0;
    const fullName: string[] = [payload.firstName.trim().toLowerCase(), payload.lastName.trim().toLowerCase()];
    if (payload.otherName !== undefined) fullName.push(payload.otherName.trim().toLowerCase() as string);
    const providerFullNameArray = [];
    if (bvnResponse.firstName !== null) providerFullNameArray.push(bvnResponse.firstName.toLowerCase());
    if (bvnResponse.middleName !== null) providerFullNameArray.push(bvnResponse.middleName.toLowerCase());
    if (bvnResponse.lastName !== null) providerFullNameArray.push(bvnResponse.lastName.toLowerCase());
    const providerFullName2 = providerFullNameArray.join(' ');

    const userLenght = fullName.length;
    let nameMatch = 0;
    const unmatchedValue = [];
    for (const name of fullName) {
      providerFullName2.includes(name) ? (nameMatch += 1) : unmatchedValue.push(name);
    }
    namePercentage = Math.trunc(Number(((nameMatch / userLenght) * 50).toFixed(2)));

    const payloadDate = moments(new Date(payload.dateOfBirth as string)).format('YYYY-MM-DD');
    const bvnDate = moments(new Date(bvnResponse.dateOfBirth)).format('YYYY-MM-DD');
    const dobMatch = moments(payloadDate).isSame(moments(bvnDate));
    if (dobMatch) dobPercentage = 50;

    if (namePercentage !== 50 || dobPercentage !== 50) {
      const message = [];
      if (namePercentage !== 50) {
        message.push(fullName.join(' '));
      }

      if (dobPercentage !== 50) {
        message.push(payload.dateOfBirth);
      }
      return {
        status: false,
        message:
          dobPercentage !== 50 && namePercentage !== 50
            ? `${message.join(
                ' and ',
              )} does not match what you have on your BVN. Please confirm your details and try again.`
            : `${message.join(
                ' ',
              )}  does not match what you have on your BVN. Please confirm your details and try again.`,
        validityPercentage: 0,
      };
    }

    return {
      status: true,
      validityPercentage: namePercentage + dobPercentage,
      message: 'success',
    };
  }

  async uploadIdForKYC2(user: User, payload: VerifySelfieIdDto, files: any): Promise<ResponseI> {
    try {
      const validBackFileType = [IDENTITY_TYPE.DRIVERS_LICENSE];
      if (validBackFileType.includes(payload.verificationType as IDENTITY_TYPE) && files.backSide === undefined) {
        return sendFailedResponse('back document missing');
      }

      if (user?.kycLevel?.verifiedBvn === null && user?.kycLevel?.kyclevel !== KycLevelStatus.LEVEL_ONE) {
        return sendFailedResponse('Kindly Complete Bvn and next of kin steps to proceed');
      }

      if (user?.kycLevel?.kyclevel === KycLevelStatus.LEVEL_TWO) {
        return sendFailedResponse('ID verification completed already');
      }

      const idVerifyData = {
        identityNo: payload.identityNo,
        verificationType: payload.verificationType,
        firstName: payload.firstName,
        lastName: payload.lastName,
        dateOfBirth: payload.dateOfBirth,
        imageData: `data:image/jpeg;base64,${files.selfie[0].buffer.toString('base64')}`,
      };
      /*  */
      const identityProviderService = new IdentityProviderService();
      const processIdVerification = await identityProviderService.idSelfieVerification(idVerifyData);

      if (
        processIdVerification !== undefined &&
        processIdVerification.success === true &&
        processIdVerification.data.status === 'found'
      ) {
        const { data } = processIdVerification;
        const { validations } = data;
        const validId =
          validations?.data !== undefined ? this.resolveIdValidation(validations.data as Record<string, any>) : true;

        if (validId) {
          if ([IDENTITY_TYPE.NIN_SLIP, IDENTITY_TYPE.INTERNATIONAL_PASSPORT].includes(payload.verificationType)) {
            const { selfie } = validations;
            const validSelfie = this.resolveSelfieDataMatch(selfie.selfieVerification);
            if (!validSelfie) {
              return sendFailedResponse(validations.validationMessages as string);
            }
          }
          if (files?.frontSide !== undefined) {
            const NIN_SLIP: Express.Multer.File[] = [files.frontSide[0]];
            if (files?.backSide !== undefined) {
              NIN_SLIP.push(files.backSide[0] as Express.Multer.File);
            }

            if (user?.kycLevel?.kycdocuments?.id === undefined) {
              return sendFailedResponse('an error occured');
            }

            const uploadNINslip = await this.uploadOtherFiles(
              NIN_SLIP,
              user?.kycLevel?.kycdocuments?.id,
              IDENTITY_TYPE.NIN_SLIP,
            );

            if (uploadNINslip === undefined) {
              return sendFailedResponse('error uploading files');
            }
            user.imageData = uploadNINslip;
          }
          await updateUser(user, user.fullName());
        } else {
          return sendFailedResponse(validations.validationMessages as string);
        }
      } else {
        return sendFailedResponse('Identity verification failed');
      }
      /* Adding a kyc level to a customer. */

      const bvnVerificationAdded = user.kycLevel.verifiedBvn;
      const level = user?.kycLevel?.kyclevel as KycLevelStatus;

      switch (level) {
        case KycLevelStatus.LEVEL_ONE:
          if (bvnVerificationAdded !== undefined && user.imageData !== undefined) {
            user.kycLevel.kyclevel = KycLevelStatus.LEVEL_ONE;
          }
          await updateUser(user, user.fullName());
          break;

        case KycLevelStatus.LEVEL_TWO:
          if (bvnVerificationAdded === true && user.kycLevel.kyclevel === KycLevelStatus.LEVEL_ONE) {
            user.kycLevel.kyclevel = KycLevelStatus.LEVEL_TWO;
          }
          await updateUser(user, user.fullName());
          break;
      }
      return sendSuccessResponse('ID Verification upload was successfull');
    } catch (error) {
      return sendFailedResponse('an error occurred');
    }
  }

  public async updateToKYC3(user: User, payload: any, file: Express.Multer.File): Promise<ResponseI> {
    try {
      if (file === undefined) {
        return sendFailedResponse('utility Bill document missing');
      }
      if (user?.kycLevel?.verifiedBvn === false) {
        return sendFailedResponse('Kindly Complete Bvn verification first');
      }

      if (user.kycLevel?.kyclevel != null && user.kycLevel.kyclevel < KycLevelStatus.LEVEL_TWO) {
        return sendFailedResponse('Kindly Complete Government ID verification first');
      }

      const utilityBill = user.kycLevel?.kycdocuments?.otherFiles?.find(
        (each) => each.type === IDENTITY_TYPE.UTILITY_BILL,
      );

      if (utilityBill !== null && user.kycLevel?.kyclevel === KycLevelStatus.LEVEL_TWO) {
        return sendFailedResponse('Your Kyc level 3 verification is awaiting approval');
      }

      if (user?.kycLevel?.kyclevel === KycLevelStatus.LEVEL_THREE) {
        return sendFailedResponse('Third Tier Verification completed already');
      }

      const payloadData = {
        address: payload?.address ?? user?.address,
        state: payload?.state ?? user?.state,
        lga: payload?.lga ?? user?.lga,
      };

      if (payloadData.address === undefined || payloadData.state === undefined || payloadData.lga === undefined) {
        return sendFailedResponse('Adress, state, lga are all required fields');
      }

      user.address = payloadData.address;
      user.state = payloadData.state;
      user.lga = payloadData.lga;
      const UTILITYBILL = [file];

      if (user?.kycLevel?.kycdocuments?.id === undefined) {
        return sendFailedResponse('an error occured');
      }

      const uploadUtilityBill = await this.uploadOtherFiles(
        UTILITYBILL,
        user?.kycLevel?.kycdocuments?.id,
        IDENTITY_TYPE.UTILITY_BILL,
      );
      if (uploadUtilityBill === undefined) {
        return sendFailedResponse('error uploading files');
      }

      user.imageData = uploadUtilityBill;
      user.kycLevel.Kyc3Status = Kyc3Status.PENDING;

      const updatedUser = await updateUser(user, user.fullName());

      return sendSuccessResponse('ID Verification upload was successfull', {
        user: updatedUser,
      });
    } catch (error) {
      return sendFailedResponse('an error occurred');
    }
  }

  //public async userKYCDetails(user: User) {}

  resolveIdValidation(data: Record<string, any>): boolean {
    const getValidated: boolean[] = Object.keys(data).map((keyName: string) => {
      return data[`${keyName}`].validated as boolean;
    });

    return getValidated.every((value) => value);
  }

  resolveSelfieDataMatch(data: any): boolean {
    return data.match;
  }

  public async verifyLamsBvn(phoneNumber: string): Promise<ResponseI<LamsResponseSuccess & LamsResponseFailed>> {
    try {
      const env = JSON.parse(process.env.APP_SECRETS ?? '{}');
      console.log('lamsENV', env);
      const lamsServer = env.MAX_LAMS_SERVER;
      const maxSecret = env.MAX_CLIENT_SECRET;
      const maxClientAccess = env.MAX_CLIENT_ACCESS_KEY;

      const req = await axios.get(`${lamsServer}/contract?phone=${phoneNumber}`, {
        headers: {
          secret: `${maxSecret}`,
          'access-key': `${maxClientAccess}`,
        },
      });
      const user = await findUser({ phoneNumber });

      const champ = {
        maxChampion: req.data.data.champion_status ?? 'NOT_MAX_CHAMPION',
        championId: req.data.data.virtual_accounts,
        kycDetails: user,
      };
      if (req.data.status === 'success') {
        return sendSuccessResponse('Lams Verification Successful', champ);
      }

      return sendFailedResponse('Verification Failed', req.data);
    } catch (error) {
      return sendFailedResponse('an error occurred');
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<any> {
    const cloudinary = new CloudinaryService();
    return await cloudinary.uploadImage(file).catch(() => {
      throw new Error('Invalid file type.');
    });
  }

  async uploadOtherFiles(
    payload: Express.Multer.File[],
    privateFileId: string,
    fileType: IDENTITY_TYPE,
  ): Promise<KycDocumentsEntity> {
    const findImageFile = await findOne({ id: privateFileId });

    if (findImageFile === null) {
      throw new Error('FileId not found');
    }
    const uploadResults = await Promise.all(
      payload.map(async (file) => {
        const uploadResult = await this.uploadImageToCloudinary(file);

        return { key: uploadResult.public_id, url: uploadResult.secure_url, type: fileType };
      }),
    );

    if (findImageFile?.otherFiles !== undefined) {
      findImageFile.otherFiles = [...findImageFile.otherFiles, ...uploadResults];
    } else {
      findImageFile.otherFiles = uploadResults;
    }

    return await savePrivateFileRecord(findImageFile);
  }
}

export default new KycService();
