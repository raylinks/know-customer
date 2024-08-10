import { dataSource } from '../../../data-source';
import { type UpdateResult, type FindOptionsWhere, type Repository } from 'typeorm';
import { KycDocumentsEntity } from '../entity/kycDocuments.entity';

const privateFileRepository: Repository<KycDocumentsEntity> = dataSource.getRepository(KycDocumentsEntity);

export async function findOne(options: FindOptionsWhere<KycDocumentsEntity>): Promise<KycDocumentsEntity | null> {
  try {
    const result = await privateFileRepository.findOne({
      where: options,
    });

    return result;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

export async function savePrivateFileRecord(privateFileData: Partial<KycDocumentsEntity>): Promise<KycDocumentsEntity> {
  try {
    const createPrivateFileEntry = privateFileRepository.create(privateFileData);
    return await privateFileRepository.save(createPrivateFileEntry);
  } catch (error) {
    throw new Error('Unable to save private file record'); // FIXME: This should not be necessary but TypeORM throws a runtime
  }
}

export async function updateKycDocument(id: string, kycData: Partial<KycDocumentsEntity>): Promise<UpdateResult> {
  try {
    return await privateFileRepository.update(id, kycData);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
