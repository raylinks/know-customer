import { Entity, Column, OneToOne } from 'typeorm';
import { type FileStoreInfo } from '../../../utils/interface';
import { KycLevel } from './kycLevel.entity';
import { BaseEntity } from './base.entity';

@Entity('kyc_documents')
export class KycDocumentsEntity extends BaseEntity {
  @Column({ name: 'imageurl', nullable: true })
  imageurl: string;

  @Column({ name: 'filekey', nullable: true })
  filekey: string;

  @Column('jsonb', { name: 'otherFile', comment: 'includes NIN file, Drivers License,PVC etc', nullable: true })
  otherFiles?: FileStoreInfo[];

  @OneToOne(() => KycLevel, (kycLevel) => kycLevel.kycdocuments)
  kycLevel: KycLevel;
}
