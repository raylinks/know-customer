import { type UpdateResult, type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import { KycLevel } from '../entity/kycLevel.entity';

const kycRepository: Repository<KycLevel> = dataSource.getRepository(KycLevel);

export function createKyc(kycData: Partial<KycLevel>): KycLevel {
  return kycRepository.create(kycData);
}

export async function updateKycDetails(id: string, kycData: Partial<KycLevel>): Promise<UpdateResult> {
  try {
    return await kycRepository.update(id, kycData);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function saveKycDetails(kycData: Partial<KycLevel>): Promise<KycLevel> {
  try {
    return await kycRepository.save(kycData);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
