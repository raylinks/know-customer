import { type UpdateResult, type FindOptionsWhere } from 'typeorm';
import { User } from '../entity/user.entity';
export declare function findUser(options: FindOptionsWhere<User>, relations?: string[]): Promise<User | null>;
export declare function updateUser(user: Partial<User>, updatedBy?: string): Promise<User | null>;
export declare function findAndUpdateUser(options: FindOptionsWhere<User>, user: Partial<User>): Promise<UpdateResult>;
