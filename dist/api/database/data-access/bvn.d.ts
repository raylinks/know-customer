import { type UpdateResult, type FindOptionsWhere } from 'typeorm';
import { Bvn } from '../entity/bvn.entity';
export declare function isBVNValidatedByAnyUser(options: FindOptionsWhere<Bvn>, relations?: string[]): Promise<Bvn | null>;
export declare function saveBvnRecord(bvnData: Partial<Bvn>): Promise<Bvn>;
export declare function updateBvn(id: string, bvnData: Partial<Bvn>): Promise<UpdateResult>;
