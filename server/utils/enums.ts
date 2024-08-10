export enum ACCOUNT_VALIDATION {
  SIGN_UP = 'signUp',
  SIGN_IN = 'signIn',
  LOGOUT = 'logout',
  INIT_VERIFY_PHONENUMBER = 'initPhoneNumberVerify',
  CONFIRM_OTP = 'confirmOTP',
  CREATE_PASSWORD = 'createPassword',
  BVN_VERIFICATION = 'bvnVerification',
  CREATE_API_KEY = 'createApiKey',
  USER_TYPE_VERIFCATION = 'userTypeVerification',
  VERIFY_SELFIE = 'verifySelfie',
}

export enum IDENTITY_TYPE {
  INTERNATIONAL_PASSPORT = 'internationalPassport',
  DRIVERS_LICENSE = 'driversLicense',
  NIN_SLIP = 'ninSlip',
  VOTERS_CARD = 'votersCard',
  UTILITY_BILL = 'utilityBill',
}

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum ConfirmationOptions {
  Confirmed = 'Confirmed',
  UnConfirmed = 'UnConfirmed',
}

export enum OtpTypes {
  EMAIL = 'Email',
  PHONE_NUMBER = 'PhoneNumber',
  PIN = 'pin',
}

export enum OtpUsage {
  VERIFY_PHONE_NUMBER = 'Verify phone number',
  COMPLETE_TRANSACTION = 'Complete transaction',
  RESET_PIN = 'reset pin',
  VERIFY_LOGIN = 'verify login',
  VERIFY_BVN_PHONE_NUMBER = 'Verify BVN phone number',
  CHANGE_DEVICE = 'change device',
  RESET_PASSCODE = 'reset passcode',
}

export enum OtpStatus {
  UNUSED = 'unused',
  USED = 'used',
}

export enum OnboardingTracker {
  UNDETERMINED,
  UPDATE_PASSCODE_V3,
  UPDATE_SECURITY_QUESTION_V3,
  UPDATE_TRANSACTION_PIN_V3,
  ONBOARDING_COMPLETED,
}

export enum KycLevelStatus {
  LEVEL_ZERO,
  LEVEL_ONE,
  LEVEL_TWO,
  LEVEL_THREE,
}

export enum Kyc3Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  NOT_INITIATED = 'Not_initiated',
  REJECTED = 'Rejected',
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserTypes {
  IS_LAMS_CHAMPS = 'isLamsChamp',
  IS_MAX_STAFF = 'isMaxStaff',
  IS_EXTERNAL_USER = 'isExternalUser',
}
