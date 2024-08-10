import { type UpdateResult, type FindOptionsWhere, type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import { User } from '../entity/user.entity';
import L from '../../../common/logger';

const userPoolRepository: Repository<User> = dataSource.getRepository(User);
export async function findUser(
  options: FindOptionsWhere<User>,
  relations: string[] = ['kycLevel'],
): Promise<User | null> {
  try {
    return (
      (await userPoolRepository.findOne({
        where: options,
        relations,
      })) ?? null
    );
  } catch (error) {
    console.log(error);
    L.error(error);
    return null;
  }
}

export async function updateUser(user: Partial<User>, updatedBy?: string): Promise<User | null> {
  try {
    if (updatedBy !== undefined) {
      user.lastModifiedBy = updatedBy;
    }
    return await userPoolRepository.save(user);
  } catch (error) {
    L.error(error);
    return null;
  }
}

export async function findAndUpdateUser(options: FindOptionsWhere<User>, user: Partial<User>): Promise<UpdateResult> {
  try {
    return await userPoolRepository.update(options, user);
  } catch (error: any) {
    L.error(error);
    throw new Error(error.message as string);
  }
}
