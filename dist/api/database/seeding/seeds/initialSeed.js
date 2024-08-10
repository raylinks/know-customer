"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../../../../data-source");
const user_entity_1 = require("../../entity/user.entity");
const enums_1 = require("../../../../utils/enums");
class InitialDataBaseSeed {
    async run() {
        const userRepository = data_source_1.dataSource.getRepository(user_entity_1.User);
        const adminKycService = {
            email: 'adminkyc@maxdrive.ai',
            phoneNumber: '+2348000000000',
            firstName: 'Administrator',
            lastName: 'Administrator',
            otherName: 'Administrator',
            role: enums_1.USER_ROLE.ADMIN,
            gender: enums_1.GENDER.MALE,
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
exports.default = InitialDataBaseSeed;
//# sourceMappingURL=initialSeed.js.map