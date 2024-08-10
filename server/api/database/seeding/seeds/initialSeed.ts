import { type Repository } from 'typeorm';
import { dataSource } from '../../../../data-source';
import { User } from '../../entity/user.entity';
import { GENDER, USER_ROLE } from '../../../../utils/enums';

export default class InitialDataBaseSeed {
  public async run(): Promise<void> {
    const userRepository: Repository<User> = dataSource.getRepository(User);

    const adminKycService: Partial<User> = {
      email: 'adminkyc@maxdrive.ai',
      phoneNumber: '+2348000000000',
      firstName: 'Administrator',
      lastName: 'Administrator',
      otherName: 'Administrator',
      role: USER_ROLE.ADMIN,
      gender: GENDER.MALE,
      password: 'adminPassword',
    };
    const findAdmin = await userRepository.findOne({
      where: { email: adminKycService.email, phoneNumber: adminKycService.phoneNumber },
    });
    if (findAdmin === null) {
      const createAdmin = userRepository.create(adminKycService);
      await userRepository.save(createAdmin);
    }
  }
}
