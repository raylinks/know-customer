import { type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import L from '../../../common/logger';
import { OtpEntity } from '../entity/otp.entity';

const otpRepository: Repository<OtpEntity> = dataSource.getRepository(OtpEntity);
export async function saveOtpDetails(options: Partial<OtpEntity>): Promise<OtpEntity> {
  try {
    return (await otpRepository.save(options)) ?? null;
  } catch (error) {
    L.error(error);
    throw Error('Unable to save otp details');
  }
}
