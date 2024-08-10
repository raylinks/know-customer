import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GENDER, USER_ROLE } from '../../../utils/enums';
import { KycLevel } from './kycLevel.entity';
import { KycDocumentsEntity } from './kycDocuments.entity';
import bcrypt from 'bcrypt';
@Entity('user')
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'address', nullable: true })
  address?: string;

  @Column({ type: 'varchar', name: 'dateOfBirth', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'varchar', name: 'email', nullable: true })
  email?: string;

  @Column({ type: 'varchar', name: 'lastName', nullable: true })
  lastName?: string;

  @Column({ type: 'enum', name: 'gender', enum: GENDER, nullable: true })
  gender?: GENDER;

  @Column({ type: 'varchar', name: 'firstName', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', name: 'otherName', nullable: true })
  otherName?: string;

  @Column({ type: 'varchar', name: 'state', nullable: true })
  state?: string;

  @Column({ type: 'varchar', name: 'phoneNumber', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'password', nullable: true })
  password?: string;

  @Column({ name: 'lga', nullable: true })
  lga?: string;

  @OneToOne(() => KycLevel, (kycLevel) => kycLevel.user)
  @JoinColumn()
  kycLevel: KycLevel;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @JoinColumn()
  @OneToOne(() => KycDocumentsEntity, {
    eager: true,
    nullable: true,
  })
  imageData?: KycDocumentsEntity;

  fullName(): string {
    return `${this.firstName} ${this.otherName === null ? this.otherName : ''} ${this.lastName}`;
  }
}
