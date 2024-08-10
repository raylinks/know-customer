import { type UpdateResult } from 'typeorm';
import { KycLevel } from '../entity/kycLevel.entity';
export declare function createKyc(kycData: Partial<KycLevel>): KycLevel;
export declare function updateKycDetails(id: string, kycData: Partial<KycLevel>): Promise<UpdateResult>;
export declare function saveKycDetails(kycData: Partial<KycLevel>): Promise<KycLevel>;
