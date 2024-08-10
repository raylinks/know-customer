import { IDENTITY_TYPE } from '../../utils/enums';
import { type LamsResponseFailed, type LamsResponseSuccess, type ResponseI } from '../../utils/interface';
import { type User } from '../database/entity/user.entity';
import { type KycDocumentsEntity } from '../database/entity/kycDocuments.entity';
import { type VerifyBvnDto } from '../controllers/kyc/dto/verifyBvn.dto';
import { type VerifySelfieIdDto } from '../controllers/kyc/dto/verifySelfieId.dto';
export declare class KycService {
    verifyBvn(user: User, payload: VerifyBvnDto, isLamsVerified?: boolean): Promise<ResponseI>;
    bvnVerificationPercentage(payload: any, bvnResponse: {
        firstName: string;
        lastName: string;
        middleName: string;
        dateOfBirth: string;
    }): Promise<{
        status: boolean;
        message: string;
        validityPercentage: number;
    }>;
    uploadIdForKYC2(user: User, payload: VerifySelfieIdDto, files: any): Promise<ResponseI>;
    updateToKYC3(user: User, payload: any, file: Express.Multer.File): Promise<ResponseI>;
    resolveIdValidation(data: Record<string, any>): boolean;
    resolveSelfieDataMatch(data: any): boolean;
    verifyLamsBvn(phoneNumber: string): Promise<ResponseI<LamsResponseSuccess & LamsResponseFailed>>;
    uploadImageToCloudinary(file: Express.Multer.File): Promise<any>;
    uploadOtherFiles(payload: Express.Multer.File[], privateFileId: string, fileType: IDENTITY_TYPE): Promise<KycDocumentsEntity>;
}
declare const _default: KycService;
export default _default;
