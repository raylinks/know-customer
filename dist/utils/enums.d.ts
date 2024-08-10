export declare enum ACCOUNT_VALIDATION {
    SIGN_UP = "signUp",
    SIGN_IN = "signIn",
    LOGOUT = "logout",
    INIT_VERIFY_PHONENUMBER = "initPhoneNumberVerify",
    CONFIRM_OTP = "confirmOTP",
    CREATE_PASSWORD = "createPassword",
    BVN_VERIFICATION = "bvnVerification",
    CREATE_API_KEY = "createApiKey",
    USER_TYPE_VERIFCATION = "userTypeVerification",
    VERIFY_SELFIE = "verifySelfie"
}
export declare enum IDENTITY_TYPE {
    INTERNATIONAL_PASSPORT = "internationalPassport",
    DRIVERS_LICENSE = "driversLicense",
    NIN_SLIP = "ninSlip",
    VOTERS_CARD = "votersCard",
    UTILITY_BILL = "utilityBill"
}
export declare enum GENDER {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other"
}
export declare enum ConfirmationOptions {
    Confirmed = "Confirmed",
    UnConfirmed = "UnConfirmed"
}
export declare enum OtpTypes {
    EMAIL = "Email",
    PHONE_NUMBER = "PhoneNumber",
    PIN = "pin"
}
export declare enum OtpUsage {
    VERIFY_PHONE_NUMBER = "Verify phone number",
    COMPLETE_TRANSACTION = "Complete transaction",
    RESET_PIN = "reset pin",
    VERIFY_LOGIN = "verify login",
    VERIFY_BVN_PHONE_NUMBER = "Verify BVN phone number",
    CHANGE_DEVICE = "change device",
    RESET_PASSCODE = "reset passcode"
}
export declare enum OtpStatus {
    UNUSED = "unused",
    USED = "used"
}
export declare enum OnboardingTracker {
    UNDETERMINED = 0,
    UPDATE_PASSCODE_V3 = 1,
    UPDATE_SECURITY_QUESTION_V3 = 2,
    UPDATE_TRANSACTION_PIN_V3 = 3,
    ONBOARDING_COMPLETED = 4
}
export declare enum KycLevelStatus {
    LEVEL_ZERO = 0,
    LEVEL_ONE = 1,
    LEVEL_TWO = 2,
    LEVEL_THREE = 3
}
export declare enum Kyc3Status {
    PENDING = "Pending",
    APPROVED = "Approved",
    NOT_INITIATED = "Not_initiated",
    REJECTED = "Rejected"
}
export declare enum USER_ROLE {
    USER = "user",
    ADMIN = "admin"
}
export declare enum UserTypes {
    IS_LAMS_CHAMPS = "isLamsChamp",
    IS_MAX_STAFF = "isMaxStaff",
    IS_EXTERNAL_USER = "isExternalUser"
}
