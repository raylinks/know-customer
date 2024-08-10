import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('bvn')
export class Bvn extends BaseEntity {
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'bvn' })
  bvn: string;

  @Column({ name: 'bvnData', type: 'simple-json' })
  bvnData: JSON;

  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @Column({ type: 'integer', default: 0 })
  validityPercentage: number;
}
