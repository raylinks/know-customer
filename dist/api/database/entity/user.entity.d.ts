import { BaseEntity } from './base.entity';
import { GENDER, USER_ROLE } from '../../../utils/enums';
import { KycLevel } from './kycLevel.entity';
import { KycDocumentsEntity } from './kycDocuments.entity';
export declare class User extends BaseEntity {
    address?: string;
    dateOfBirth?: string;
    email?: string;
    lastName?: string;
    gender?: GENDER;
    firstName?: string;
    otherName?: string;
    state?: string;
    phoneNumber: string;
    password?: string;
    lga?: string;
    kycLevel: KycLevel;
    role: USER_ROLE;
    imageData?: KycDocumentsEntity;
    fullName(): string;
}
