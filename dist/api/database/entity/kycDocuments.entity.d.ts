import { type FileStoreInfo } from '../../../utils/interface';
import { KycLevel } from './kycLevel.entity';
import { BaseEntity } from './base.entity';
export declare class KycDocumentsEntity extends BaseEntity {
    imageurl: string;
    filekey: string;
    otherFiles?: FileStoreInfo[];
    kycLevel: KycLevel;
}
