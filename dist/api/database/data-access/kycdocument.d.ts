import { type UpdateResult, type FindOptionsWhere } from 'typeorm';
import { KycDocumentsEntity } from '../entity/kycDocuments.entity';
export declare function findOne(options: FindOptionsWhere<KycDocumentsEntity>): Promise<KycDocumentsEntity | null>;
export declare function savePrivateFileRecord(privateFileData: Partial<KycDocumentsEntity>): Promise<KycDocumentsEntity>;
export declare function updateKycDocument(id: string, kycData: Partial<KycDocumentsEntity>): Promise<UpdateResult>;
