import { BaseEntity } from './base.entity';
import { KycDocumentsEntity } from './kycDocuments.entity';
import { Kyc3Status, KycLevelStatus } from '../../../utils/enums';
import { User } from './user.entity';
export declare class KycLevel extends BaseEntity {
    bvn?: string;
    bvnVerificationCount: number;
    verifiedBvn?: boolean;
    kyclevel?: KycLevelStatus;
    Kyc3Status?: Kyc3Status;
    kycdocuments?: KycDocumentsEntity;
    comment: string;
    adminId: string;
    user: User;
}
