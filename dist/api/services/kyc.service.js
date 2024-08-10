"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const identity_service_1 = require("../../thirdPartyServiceProviders/identityProvider/identity.service");
const base_1 = require("../../utils/base");
const enums_1 = require("../../utils/enums");
const bvn_1 = require("../database/data-access/bvn");
const user_1 = require("../database/data-access/user");
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../../common/logger"));
const kycdocument_1 = require("../database/data-access/kycdocument");
const axios_1 = __importDefault(require("axios"));
const cloudinary_service_1 = require("../../thirdPartyServiceProviders/cloudinary/cloudinary.service");
const kycLevel_1 = require("../database/data-access/kycLevel");
require('dotenv').config();
const sec = JSON.parse((_a = process.env.APP_SECRETS) !== null && _a !== void 0 ? _a : '{}');
class KycService {
    async verifyBvn(user, payload, isLamsVerified = false) {
        var _a, _b, _c, _d, _e;
        try {
            const { bvn } = payload;
            let canCallProvider = true;
            if (user === null) {
                return (0, base_1.sendFailedResponse)('User not found');
            }
            let userKyc = user.kycLevel;
            if (userKyc !== undefined && userKyc !== null && (userKyc === null || userKyc === void 0 ? void 0 : userKyc.kyclevel) !== null) {
                if (userKyc.verifiedBvn === true && userKyc.bvn !== null) {
                    return (0, base_1.sendSuccessResponse)('Customer BVN already Verified');
                }
            }
            userKyc = (0, kycLevel_1.createKyc)({
                user,
                kyclevel: enums_1.KycLevelStatus.LEVEL_ONE,
                Kyc3Status: enums_1.Kyc3Status.NOT_INITIATED,
            });
            if (isLamsVerified) {
                user.kycLevel.verifiedBvn = true;
                user.kycLevel.kyclevel = enums_1.KycLevelStatus.LEVEL_ONE;
                const updatedUser = await (0, user_1.updateUser)(user, user.fullName());
                return (0, base_1.sendSuccessResponse)('BVN verified successfully', {
                    user: updatedUser,
                    bvnPhoneNumber: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.phoneNumber,
                });
            }
            const bvnRecord = await (0, bvn_1.isBVNValidatedByAnyUser)({ bvn: bvn.trim() });
            if (bvnRecord !== null && ((_a = bvnRecord === null || bvnRecord === void 0 ? void 0 : bvnRecord.user) === null || _a === void 0 ? void 0 : _a.id) !== user.id) {
                return (0, base_1.sendFailedResponse)('This BVN is linked to another! account');
            }
            let bvnResponse;
            if (bvnRecord !== null) {
                canCallProvider = false;
                bvnResponse = {
                    success: true,
                    data: bvnRecord.bvnData,
                };
            }
            if (canCallProvider) {
                const identityProviderService = new identity_service_1.IdentityProviderService();
                bvnResponse = await identityProviderService.resolveBVN(bvn);
            }
            if (bvnResponse !== undefined && bvnResponse.success === true && bvnResponse.data.status === 'found') {
                let savedBvnData;
                if (canCallProvider) {
                    const bvnDataInput = {
                        user,
                        bvn,
                        bvnData: bvnResponse.data,
                    };
                    savedBvnData = await (0, bvn_1.saveBvnRecord)(bvnDataInput);
                }
                else {
                    savedBvnData = bvnRecord;
                }
                const providerValidationDetails = {
                    firstName: bvnResponse.data.firstName,
                    middleName: bvnResponse.data.middleName,
                    lastName: bvnResponse.data.lastName,
                    dateOfBirth: bvnResponse.data.dateOfBirth,
                };
                const validation = await this.bvnVerificationPercentage(payload, providerValidationDetails);
                if (!validation.status) {
                    return (0, base_1.sendFailedResponse)(validation.message);
                }
                if (validation.validityPercentage < 80) {
                    userKyc.bvn = undefined;
                    userKyc.bvnVerificationCount = 0;
                    if ((savedBvnData === null || savedBvnData === void 0 ? void 0 : savedBvnData.id) !== undefined) {
                        await (0, bvn_1.updateBvn)(savedBvnData.id, { validityPercentage: validation.validityPercentage });
                    }
                    return (0, base_1.sendFailedResponse)('Incorrect Bvn');
                }
                if ((savedBvnData === null || savedBvnData === void 0 ? void 0 : savedBvnData.id) !== undefined) {
                    await (0, bvn_1.updateBvn)(savedBvnData.id, { validityPercentage: validation.validityPercentage, isValid: true });
                }
                user.firstName = (_b = bvnResponse.data.firstName) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                user.otherName = (_c = bvnResponse.data.middleName) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase();
                user.lastName = (_d = bvnResponse.data.lastName) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase();
                user.dateOfBirth = (0, moment_1.default)((_e = bvnResponse.data) === null || _e === void 0 ? void 0 : _e.dateOfBirth).format('YYYY-MM-DD');
            }
            else {
                userKyc.bvnVerificationCount =
                    userKyc.bvnVerificationCount === undefined ? 0 : userKyc.bvnVerificationCount + 1;
                userKyc.bvn = undefined;
                userKyc.comment = 'bvn not found';
                await (0, kycLevel_1.saveKycDetails)(userKyc);
                return (0, base_1.sendFailedResponse)('BVN verification failed');
            }
            userKyc.verifiedBvn = true;
            userKyc.kyclevel = enums_1.KycLevelStatus.LEVEL_ONE;
            userKyc.bvn = bvn.trim();
            const kycDet = await (0, kycLevel_1.saveKycDetails)(userKyc);
            user.kycLevel = kycDet;
            const updatedUser = await (0, user_1.updateUser)(user, user.fullName());
            return (0, base_1.sendSuccessResponse)('BVN verified successfully', {
                user: updatedUser,
                bvnPhoneNumber: bvnResponse.data.mobile,
            });
        }
        catch (error) {
            logger_1.default.error(error);
            return (0, base_1.sendFailedResponse)('an error occurred');
        }
    }
    async bvnVerificationPercentage(payload, bvnResponse) {
        let namePercentage = 0;
        let dobPercentage = 0;
        const fullName = [payload.firstName.trim().toLowerCase(), payload.lastName.trim().toLowerCase()];
        if (payload.otherName !== undefined)
            fullName.push(payload.otherName.trim().toLowerCase());
        const providerFullNameArray = [];
        if (bvnResponse.firstName !== null)
            providerFullNameArray.push(bvnResponse.firstName.toLowerCase());
        if (bvnResponse.middleName !== null)
            providerFullNameArray.push(bvnResponse.middleName.toLowerCase());
        if (bvnResponse.lastName !== null)
            providerFullNameArray.push(bvnResponse.lastName.toLowerCase());
        const providerFullName2 = providerFullNameArray.join(' ');
        const userLenght = fullName.length;
        let nameMatch = 0;
        const unmatchedValue = [];
        for (const name of fullName) {
            providerFullName2.includes(name) ? (nameMatch += 1) : unmatchedValue.push(name);
        }
        namePercentage = Math.trunc(Number(((nameMatch / userLenght) * 50).toFixed(2)));
        const payloadDate = (0, moment_1.default)(new Date(payload.dateOfBirth)).format('YYYY-MM-DD');
        const bvnDate = (0, moment_1.default)(new Date(bvnResponse.dateOfBirth)).format('YYYY-MM-DD');
        const dobMatch = (0, moment_1.default)(payloadDate).isSame((0, moment_1.default)(bvnDate));
        if (dobMatch)
            dobPercentage = 50;
        if (namePercentage !== 50 || dobPercentage !== 50) {
            const message = [];
            if (namePercentage !== 50) {
                message.push(fullName.join(' '));
            }
            if (dobPercentage !== 50) {
                message.push(payload.dateOfBirth);
            }
            return {
                status: false,
                message: dobPercentage !== 50 && namePercentage !== 50
                    ? `${message.join(' and ')} does not match what you have on your BVN. Please confirm your details and try again.`
                    : `${message.join(' ')}  does not match what you have on your BVN. Please confirm your details and try again.`,
                validityPercentage: 0,
            };
        }
        return {
            status: true,
            validityPercentage: namePercentage + dobPercentage,
            message: 'success',
        };
    }
    async uploadIdForKYC2(user, payload, files) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            const validBackFileType = [enums_1.IDENTITY_TYPE.DRIVERS_LICENSE];
            if (validBackFileType.includes(payload.verificationType) && files.backSide === undefined) {
                return (0, base_1.sendFailedResponse)('back document missing');
            }
            if (((_a = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _a === void 0 ? void 0 : _a.verifiedBvn) === null && ((_b = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _b === void 0 ? void 0 : _b.kyclevel) !== enums_1.KycLevelStatus.LEVEL_ONE) {
                return (0, base_1.sendFailedResponse)('Kindly Complete Bvn and next of kin steps to proceed');
            }
            if (((_c = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _c === void 0 ? void 0 : _c.kyclevel) === enums_1.KycLevelStatus.LEVEL_TWO) {
                return (0, base_1.sendFailedResponse)('ID verification completed already');
            }
            const idVerifyData = {
                identityNo: payload.identityNo,
                verificationType: payload.verificationType,
                firstName: payload.firstName,
                lastName: payload.lastName,
                dateOfBirth: payload.dateOfBirth,
                imageData: `data:image/jpeg;base64,${files.selfie[0].buffer.toString('base64')}`,
            };
            /*  */
            const identityProviderService = new identity_service_1.IdentityProviderService();
            const processIdVerification = await identityProviderService.idSelfieVerification(idVerifyData);
            if (processIdVerification !== undefined &&
                processIdVerification.success === true &&
                processIdVerification.data.status === 'found') {
                const { data } = processIdVerification;
                const { validations } = data;
                const validId = (validations === null || validations === void 0 ? void 0 : validations.data) !== undefined ? this.resolveIdValidation(validations.data) : true;
                if (validId) {
                    if ([enums_1.IDENTITY_TYPE.NIN_SLIP, enums_1.IDENTITY_TYPE.INTERNATIONAL_PASSPORT].includes(payload.verificationType)) {
                        const { selfie } = validations;
                        const validSelfie = this.resolveSelfieDataMatch(selfie.selfieVerification);
                        if (!validSelfie) {
                            return (0, base_1.sendFailedResponse)(validations.validationMessages);
                        }
                    }
                    if ((files === null || files === void 0 ? void 0 : files.frontSide) !== undefined) {
                        const NIN_SLIP = [files.frontSide[0]];
                        if ((files === null || files === void 0 ? void 0 : files.backSide) !== undefined) {
                            NIN_SLIP.push(files.backSide[0]);
                        }
                        if (((_e = (_d = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _d === void 0 ? void 0 : _d.kycdocuments) === null || _e === void 0 ? void 0 : _e.id) === undefined) {
                            return (0, base_1.sendFailedResponse)('an error occured');
                        }
                        const uploadNINslip = await this.uploadOtherFiles(NIN_SLIP, (_g = (_f = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _f === void 0 ? void 0 : _f.kycdocuments) === null || _g === void 0 ? void 0 : _g.id, enums_1.IDENTITY_TYPE.NIN_SLIP);
                        if (uploadNINslip === undefined) {
                            return (0, base_1.sendFailedResponse)('error uploading files');
                        }
                        user.imageData = uploadNINslip;
                    }
                    await (0, user_1.updateUser)(user, user.fullName());
                }
                else {
                    return (0, base_1.sendFailedResponse)(validations.validationMessages);
                }
            }
            else {
                return (0, base_1.sendFailedResponse)('Identity verification failed');
            }
            /* Adding a kyc level to a customer. */
            const bvnVerificationAdded = user.kycLevel.verifiedBvn;
            const level = (_h = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _h === void 0 ? void 0 : _h.kyclevel;
            switch (level) {
                case enums_1.KycLevelStatus.LEVEL_ONE:
                    if (bvnVerificationAdded !== undefined && user.imageData !== undefined) {
                        user.kycLevel.kyclevel = enums_1.KycLevelStatus.LEVEL_ONE;
                    }
                    await (0, user_1.updateUser)(user, user.fullName());
                    break;
                case enums_1.KycLevelStatus.LEVEL_TWO:
                    if (bvnVerificationAdded === true && user.kycLevel.kyclevel === enums_1.KycLevelStatus.LEVEL_ONE) {
                        user.kycLevel.kyclevel = enums_1.KycLevelStatus.LEVEL_TWO;
                    }
                    await (0, user_1.updateUser)(user, user.fullName());
                    break;
            }
            return (0, base_1.sendSuccessResponse)('ID Verification upload was successfull');
        }
        catch (error) {
            return (0, base_1.sendFailedResponse)('an error occurred');
        }
    }
    async updateToKYC3(user, payload, file) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        try {
            if (file === undefined) {
                return (0, base_1.sendFailedResponse)('utility Bill document missing');
            }
            if (((_a = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _a === void 0 ? void 0 : _a.verifiedBvn) === false) {
                return (0, base_1.sendFailedResponse)('Kindly Complete Bvn verification first');
            }
            if (((_b = user.kycLevel) === null || _b === void 0 ? void 0 : _b.kyclevel) != null && user.kycLevel.kyclevel < enums_1.KycLevelStatus.LEVEL_TWO) {
                return (0, base_1.sendFailedResponse)('Kindly Complete Government ID verification first');
            }
            const utilityBill = (_e = (_d = (_c = user.kycLevel) === null || _c === void 0 ? void 0 : _c.kycdocuments) === null || _d === void 0 ? void 0 : _d.otherFiles) === null || _e === void 0 ? void 0 : _e.find((each) => each.type === enums_1.IDENTITY_TYPE.UTILITY_BILL);
            if (utilityBill !== null && ((_f = user.kycLevel) === null || _f === void 0 ? void 0 : _f.kyclevel) === enums_1.KycLevelStatus.LEVEL_TWO) {
                return (0, base_1.sendFailedResponse)('Your Kyc level 3 verification is awaiting approval');
            }
            if (((_g = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _g === void 0 ? void 0 : _g.kyclevel) === enums_1.KycLevelStatus.LEVEL_THREE) {
                return (0, base_1.sendFailedResponse)('Third Tier Verification completed already');
            }
            const payloadData = {
                address: (_h = payload === null || payload === void 0 ? void 0 : payload.address) !== null && _h !== void 0 ? _h : user === null || user === void 0 ? void 0 : user.address,
                state: (_j = payload === null || payload === void 0 ? void 0 : payload.state) !== null && _j !== void 0 ? _j : user === null || user === void 0 ? void 0 : user.state,
                lga: (_k = payload === null || payload === void 0 ? void 0 : payload.lga) !== null && _k !== void 0 ? _k : user === null || user === void 0 ? void 0 : user.lga,
            };
            if (payloadData.address === undefined || payloadData.state === undefined || payloadData.lga === undefined) {
                return (0, base_1.sendFailedResponse)('Adress, state, lga are all required fields');
            }
            user.address = payloadData.address;
            user.state = payloadData.state;
            user.lga = payloadData.lga;
            const UTILITYBILL = [file];
            if (((_m = (_l = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _l === void 0 ? void 0 : _l.kycdocuments) === null || _m === void 0 ? void 0 : _m.id) === undefined) {
                return (0, base_1.sendFailedResponse)('an error occured');
            }
            const uploadUtilityBill = await this.uploadOtherFiles(UTILITYBILL, (_p = (_o = user === null || user === void 0 ? void 0 : user.kycLevel) === null || _o === void 0 ? void 0 : _o.kycdocuments) === null || _p === void 0 ? void 0 : _p.id, enums_1.IDENTITY_TYPE.UTILITY_BILL);
            if (uploadUtilityBill === undefined) {
                return (0, base_1.sendFailedResponse)('error uploading files');
            }
            user.imageData = uploadUtilityBill;
            user.kycLevel.Kyc3Status = enums_1.Kyc3Status.PENDING;
            const updatedUser = await (0, user_1.updateUser)(user, user.fullName());
            return (0, base_1.sendSuccessResponse)('ID Verification upload was successfull', {
                user: updatedUser,
            });
        }
        catch (error) {
            return (0, base_1.sendFailedResponse)('an error occurred');
        }
    }
    //public async userKYCDetails(user: User) {}
    resolveIdValidation(data) {
        const getValidated = Object.keys(data).map((keyName) => {
            return data[`${keyName}`].validated;
        });
        return getValidated.every((value) => value);
    }
    resolveSelfieDataMatch(data) {
        return data.match;
    }
    async verifyLamsBvn(phoneNumber) {
        var _a, _b;
        try {
            const env = JSON.parse((_a = process.env.APP_SECRETS) !== null && _a !== void 0 ? _a : '{}');
            console.log('lamsENV', env);
            const lamsServer = env.MAX_LAMS_SERVER;
            const maxSecret = env.MAX_CLIENT_SECRET;
            const maxClientAccess = env.MAX_CLIENT_ACCESS_KEY;
            const req = await axios_1.default.get(`${lamsServer}/contract?phone=${phoneNumber}`, {
                headers: {
                    secret: `${maxSecret}`,
                    'access-key': `${maxClientAccess}`,
                },
            });
            const user = await (0, user_1.findUser)({ phoneNumber });
            const champ = {
                maxChampion: (_b = req.data.data.champion_status) !== null && _b !== void 0 ? _b : 'NOT_MAX_CHAMPION',
                championId: req.data.data.virtual_accounts,
                kycDetails: user,
            };
            if (req.data.status === 'success') {
                return (0, base_1.sendSuccessResponse)('Lams Verification Successful', champ);
            }
            return (0, base_1.sendFailedResponse)('Verification Failed', req.data);
        }
        catch (error) {
            return (0, base_1.sendFailedResponse)('an error occurred');
        }
    }
    async uploadImageToCloudinary(file) {
        const cloudinary = new cloudinary_service_1.CloudinaryService();
        return await cloudinary.uploadImage(file).catch(() => {
            throw new Error('Invalid file type.');
        });
    }
    async uploadOtherFiles(payload, privateFileId, fileType) {
        const findImageFile = await (0, kycdocument_1.findOne)({ id: privateFileId });
        if (findImageFile === null) {
            throw new Error('FileId not found');
        }
        const uploadResults = await Promise.all(payload.map(async (file) => {
            const uploadResult = await this.uploadImageToCloudinary(file);
            return { key: uploadResult.public_id, url: uploadResult.secure_url, type: fileType };
        }));
        if ((findImageFile === null || findImageFile === void 0 ? void 0 : findImageFile.otherFiles) !== undefined) {
            findImageFile.otherFiles = [...findImageFile.otherFiles, ...uploadResults];
        }
        else {
            findImageFile.otherFiles = uploadResults;
        }
        return await (0, kycdocument_1.savePrivateFileRecord)(findImageFile);
    }
}
exports.KycService = KycService;
exports.default = new KycService();
//# sourceMappingURL=kyc.service.js.map