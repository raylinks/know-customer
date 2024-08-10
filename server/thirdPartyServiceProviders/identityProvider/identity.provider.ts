import { YouVerifyService } from './identityProviders/youVerify';

export const IdentityProviders = [
  {
    provide: 'youverify',
    UseValue: YouVerifyService,
  },
];
