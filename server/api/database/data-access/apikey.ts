import { type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import * as crypto from 'crypto';
import { Apikey } from '../entity/apiKey.entity';

const apiKeyRepository: Repository<Apikey> = dataSource.getRepository(Apikey);

const getQueryBuilder = (): any => {
  return apiKeyRepository.createQueryBuilder('apikey').leftJoinAndSelect('apikey.creator', 'creator');
};

export async function updateApiKey(apiInfo: Partial<Apikey>): Promise<Apikey> {
  return await apiKeyRepository.save(apiInfo);
}

export async function regenerateApiKey(isTestKey: boolean, creator: any, serviceName?: string): Promise<Apikey> {
  // await apiKeyRepository.update({ creator, isTestKey }, { isActive: false });

  const key = crypto.randomBytes(32).toString('hex');
  const today = new Date().toISOString().split('T')[0];

  const findKey = await apiKeyRepository.findOne({
    where: {
      creator: { id: creator.id },
      serviceName,
      isTestKey,
    },
  });

  if (findKey !== null) {
    findKey.apiKey = key;
    findKey.serviceName = serviceName ?? '';
    findKey.usage = [{ date: today, count: 0 }];
    await apiKeyRepository.update(findKey.id, findKey);

    return findKey;
  }

  const apikey = apiKeyRepository.create({
    apiKey: key,
    creator,
    serviceName,
    isTestKey,
    usage: [{ date: today, count: 0 }],
  });

  await apiKeyRepository.save(apikey);
  return apikey;
}

export async function findById(id: string): Promise<Apikey | null> {
  return getQueryBuilder().where('api.id = :id', { id }).getOne();
}

export async function findByKey(apiKey: string): Promise<Apikey | null> {
  return getQueryBuilder().where('apikey.apiKey = :apiKey', { apiKey }).getOne();
}
