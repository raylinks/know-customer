import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../entity/user.entity';

export class Usage {
  @Column('timestamp')
  date: string;

  @Column('bigint')
  count: number;
}

@Entity('api_keys')
export class Apikey extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  apiKey: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  message: string;

  @Column({ type: 'varchar', nullable: true })
  serviceName: string;

  @Column({ type: 'varchar', nullable: true })
  clientUrl: string;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({ type: 'jsonb', nullable: true })
  usage: Usage[];

  @Column({ type: 'bool', default: false })
  isTestKey: boolean;

  @Column({ type: 'varchar', nullable: true })
  authToken: string;
}
