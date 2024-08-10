import { BaseEntity } from 'typeorm';
import { User } from '../entity/user.entity';
export declare class Usage {
    date: string;
    count: number;
}
export declare class Apikey extends BaseEntity {
    id: string;
    apiKey: string;
    isActive: boolean;
    message: string;
    serviceName: string;
    clientUrl: string;
    creator: User;
    usage: Usage[];
    isTestKey: boolean;
    authToken: string;
}
