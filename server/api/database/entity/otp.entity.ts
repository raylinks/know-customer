import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OtpStatus, OtpTypes, OtpUsage } from '../../../utils/enums';

@Entity('otp')
export class OtpEntity extends BaseEntity {
  @Column({ name: 'otp', nullable: false })
  otp: string;

  @Column({ name: 'type', nullable: false, enum: OtpTypes })
  type: OtpTypes;

  @Column({ name: 'phoneNumber', nullable: true })
  phoneNumber: string;

  @Column({ name: 'usage', nullable: false, enum: OtpUsage })
  usage: OtpUsage;

  @Column({ name: 'expirationTime', nullable: false })
  expirationTime: string;

  @Column({ name: 'status', nullable: false, enum: OtpStatus, default: OtpStatus.UNUSED })
  status: OtpStatus;
}
