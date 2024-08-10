import { type IDENTITY_TYPE } from 'server/utils/enums';

export class VerifySelfieIdDto {
  identityNo: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;

  verificationType: IDENTITY_TYPE;
}
