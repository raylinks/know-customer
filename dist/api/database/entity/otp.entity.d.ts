import { BaseEntity } from './base.entity';
import { OtpStatus, OtpTypes, OtpUsage } from '../../../utils/enums';
export declare class OtpEntity extends BaseEntity {
    otp: string;
    type: OtpTypes;
    phoneNumber: string;
    usage: OtpUsage;
    expirationTime: string;
    status: OtpStatus;
}
