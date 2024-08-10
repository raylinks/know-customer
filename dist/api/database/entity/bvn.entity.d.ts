import { BaseEntity } from './base.entity';
import { User } from './user.entity';
export declare class Bvn extends BaseEntity {
    user: User;
    bvn: string;
    bvnData: JSON;
    isValid: boolean;
    validityPercentage: number;
}
