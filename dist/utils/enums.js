"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = exports.USER_ROLE = exports.Kyc3Status = exports.KycLevelStatus = exports.OnboardingTracker = exports.OtpStatus = exports.OtpUsage = exports.OtpTypes = exports.ConfirmationOptions = exports.GENDER = exports.IDENTITY_TYPE = exports.ACCOUNT_VALIDATION = void 0;
var ACCOUNT_VALIDATION;
(function (ACCOUNT_VALIDATION) {
    ACCOUNT_VALIDATION["SIGN_UP"] = "signUp";
    ACCOUNT_VALIDATION["SIGN_IN"] = "signIn";
    ACCOUNT_VALIDATION["LOGOUT"] = "logout";
    ACCOUNT_VALIDATION["INIT_VERIFY_PHONENUMBER"] = "initPhoneNumberVerify";
    ACCOUNT_VALIDATION["CONFIRM_OTP"] = "confirmOTP";
    ACCOUNT_VALIDATION["CREATE_PASSWORD"] = "createPassword";
    ACCOUNT_VALIDATION["BVN_VERIFICATION"] = "bvnVerification";
    ACCOUNT_VALIDATION["CREATE_API_KEY"] = "createApiKey";
    ACCOUNT_VALIDATION["USER_TYPE_VERIFCATION"] = "userTypeVerification";
    ACCOUNT_VALIDATION["VERIFY_SELFIE"] = "verifySelfie";
})(ACCOUNT_VALIDATION || (exports.ACCOUNT_VALIDATION = ACCOUNT_VALIDATION = {}));
var IDENTITY_TYPE;
(function (IDENTITY_TYPE) {
    IDENTITY_TYPE["INTERNATIONAL_PASSPORT"] = "internationalPassport";
    IDENTITY_TYPE["DRIVERS_LICENSE"] = "driversLicense";
    IDENTITY_TYPE["NIN_SLIP"] = "ninSlip";
    IDENTITY_TYPE["VOTERS_CARD"] = "votersCard";
    IDENTITY_TYPE["UTILITY_BILL"] = "utilityBill";
})(IDENTITY_TYPE || (exports.IDENTITY_TYPE = IDENTITY_TYPE = {}));
var GENDER;
(function (GENDER) {
    GENDER["MALE"] = "Male";
    GENDER["FEMALE"] = "Female";
    GENDER["OTHER"] = "Other";
})(GENDER || (exports.GENDER = GENDER = {}));
var ConfirmationOptions;
(function (ConfirmationOptions) {
    ConfirmationOptions["Confirmed"] = "Confirmed";
    ConfirmationOptions["UnConfirmed"] = "UnConfirmed";
})(ConfirmationOptions || (exports.ConfirmationOptions = ConfirmationOptions = {}));
var OtpTypes;
(function (OtpTypes) {
    OtpTypes["EMAIL"] = "Email";
    OtpTypes["PHONE_NUMBER"] = "PhoneNumber";
    OtpTypes["PIN"] = "pin";
})(OtpTypes || (exports.OtpTypes = OtpTypes = {}));
var OtpUsage;
(function (OtpUsage) {
    OtpUsage["VERIFY_PHONE_NUMBER"] = "Verify phone number";
    OtpUsage["COMPLETE_TRANSACTION"] = "Complete transaction";
    OtpUsage["RESET_PIN"] = "reset pin";
    OtpUsage["VERIFY_LOGIN"] = "verify login";
    OtpUsage["VERIFY_BVN_PHONE_NUMBER"] = "Verify BVN phone number";
    OtpUsage["CHANGE_DEVICE"] = "change device";
    OtpUsage["RESET_PASSCODE"] = "reset passcode";
})(OtpUsage || (exports.OtpUsage = OtpUsage = {}));
var OtpStatus;
(function (OtpStatus) {
    OtpStatus["UNUSED"] = "unused";
    OtpStatus["USED"] = "used";
})(OtpStatus || (exports.OtpStatus = OtpStatus = {}));
var OnboardingTracker;
(function (OnboardingTracker) {
    OnboardingTracker[OnboardingTracker["UNDETERMINED"] = 0] = "UNDETERMINED";
    OnboardingTracker[OnboardingTracker["UPDATE_PASSCODE_V3"] = 1] = "UPDATE_PASSCODE_V3";
    OnboardingTracker[OnboardingTracker["UPDATE_SECURITY_QUESTION_V3"] = 2] = "UPDATE_SECURITY_QUESTION_V3";
    OnboardingTracker[OnboardingTracker["UPDATE_TRANSACTION_PIN_V3"] = 3] = "UPDATE_TRANSACTION_PIN_V3";
    OnboardingTracker[OnboardingTracker["ONBOARDING_COMPLETED"] = 4] = "ONBOARDING_COMPLETED";
})(OnboardingTracker || (exports.OnboardingTracker = OnboardingTracker = {}));
var KycLevelStatus;
(function (KycLevelStatus) {
    KycLevelStatus[KycLevelStatus["LEVEL_ZERO"] = 0] = "LEVEL_ZERO";
    KycLevelStatus[KycLevelStatus["LEVEL_ONE"] = 1] = "LEVEL_ONE";
    KycLevelStatus[KycLevelStatus["LEVEL_TWO"] = 2] = "LEVEL_TWO";
    KycLevelStatus[KycLevelStatus["LEVEL_THREE"] = 3] = "LEVEL_THREE";
})(KycLevelStatus || (exports.KycLevelStatus = KycLevelStatus = {}));
var Kyc3Status;
(function (Kyc3Status) {
    Kyc3Status["PENDING"] = "Pending";
    Kyc3Status["APPROVED"] = "Approved";
    Kyc3Status["NOT_INITIATED"] = "Not_initiated";
    Kyc3Status["REJECTED"] = "Rejected";
})(Kyc3Status || (exports.Kyc3Status = Kyc3Status = {}));
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["USER"] = "user";
    USER_ROLE["ADMIN"] = "admin";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
var UserTypes;
(function (UserTypes) {
    UserTypes["IS_LAMS_CHAMPS"] = "isLamsChamp";
    UserTypes["IS_MAX_STAFF"] = "isMaxStaff";
    UserTypes["IS_EXTERNAL_USER"] = "isExternalUser";
})(UserTypes || (exports.UserTypes = UserTypes = {}));
//# sourceMappingURL=enums.js.map