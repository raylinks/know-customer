import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { KycDocumentsEntity } from './kycDocuments.entity';
import { Kyc3Status, KycLevelStatus } from '../../../utils/enums';
import { User } from './user.entity';

@Entity('kyc_level')
export class KycLevel extends BaseEntity {
  @Column({ name: 'bvn', nullable: true })
  bvn?: string;

  @Column({ name: 'bvnVerificationCount', nullable: false, default: 0 })
  bvnVerificationCount: number;

  @Column({ name: 'verifiedBvn', default: false })
  verifiedBvn?: boolean;

  @Column({
    name: 'kyclevel',
    type: 'enum',
    enum: KycLevelStatus,
    default: KycLevelStatus.LEVEL_ZERO,
  })
  kyclevel?: KycLevelStatus;

  @Column({ name: 'Kyc3Status', enum: Kyc3Status, default: Kyc3Status.NOT_INITIATED })
  Kyc3Status?: Kyc3Status;

  @JoinColumn()
  @OneToOne(() => KycDocumentsEntity, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  kycdocuments?: KycDocumentsEntity;

  @Column({
    type: 'varchar',
    name: 'comment',
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'varchar',
    name: 'adminId',
    nullable: true,
  })
  adminId: string;

  @OneToOne(() => User, (user) => user.kycLevel)
  @JoinColumn()
  user: User;
}
