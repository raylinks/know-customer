import { BaseEntity } from 'typeorm';
import { Apikey } from './apiKey.entity';
import { User } from './user.entity';
export declare class AuditLogs extends BaseEntity {
    id: string;
    apiService: Apikey | null;
    user: User | null;
    requestEndpoint: string;
    requestMethod: string;
    requestBody: string | null;
    responseBody: string | null;
    requestInitiatedAt: Date;
    responseSentAt: Date;
    responseTime: string;
}
