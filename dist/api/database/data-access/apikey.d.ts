import { Apikey } from '../entity/apiKey.entity';
export declare function updateApiKey(apiInfo: Partial<Apikey>): Promise<Apikey>;
export declare function regenerateApiKey(isTestKey: boolean, creator: any, serviceName?: string): Promise<Apikey>;
export declare function findById(id: string): Promise<Apikey | null>;
export declare function findByKey(apiKey: string): Promise<Apikey | null>;
