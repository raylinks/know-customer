import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Apikey } from './apiKey.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLogs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Apikey, (apiKey) => apiKey.id, { nullable: true })
  apiService: Apikey | null;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  user: User | null;

  @Column({ name: 'endpoint' })
  requestEndpoint: string;

  @Column({ name: 'requestMethod' })
  requestMethod: string;

  @Column({ name: 'requestBody', nullable: true, type: 'jsonb' })
  requestBody: string | null;

  @Column({ name: 'responseBody', nullable: true, type: 'jsonb' })
  responseBody: string | null;

  @Column({ name: 'requestInitiatedAt' })
  requestInitiatedAt: Date;

  @Column({ name: 'responseSentAt' })
  responseSentAt: Date;

  @Column({ name: 'responseTime' })
  responseTime: string;
}
