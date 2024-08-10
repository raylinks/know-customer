import { type UpdateResult, type FindOptionsWhere, type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import L from '../../../common/logger';
import { Bvn } from '../entity/bvn.entity';

const bvnRepository: Repository<Bvn> = dataSource.getRepository(Bvn);
export async function isBVNValidatedByAnyUser(
  options: FindOptionsWhere<Bvn>,
  relations: string[] = ['user'],
): Promise<Bvn | null> {
  try {
    const result = await bvnRepository.findOne({
      where: options,
      relations,
    });

    return result;
  } catch (error) {
    L.error(error);
    throw new Error(`${error.message}`);
  }
}

export async function saveBvnRecord(bvnData: Partial<Bvn>): Promise<Bvn> {
  try {
    const createBvnEntry = bvnRepository.create(bvnData);
    return await bvnRepository.save(createBvnEntry);
  } catch (error) {
    L.error(error);
    throw new Error('Unable to save bvn record'); // FIXME: This should not be necessary but TypeORM throws a runtime
  }
}

export async function updateBvn(id: string, bvnData: Partial<Bvn>): Promise<UpdateResult> {
  try {
    return await bvnRepository.update(id, bvnData);
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
