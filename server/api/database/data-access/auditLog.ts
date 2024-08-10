import { type Repository } from 'typeorm';
import { dataSource } from '../../../data-source';
import L from '../../../common/logger';
import { AuditLogs } from '../entity/auditLogs.entity';

const auditLogRepository: Repository<AuditLogs> = dataSource.getRepository(AuditLogs);

export async function saveLogDetail(data: Partial<AuditLogs>): Promise<AuditLogs> {
  try {
    const createBvnEntry = auditLogRepository.create(data);
    return await auditLogRepository.save(createBvnEntry);
  } catch (error) {
    L.error(error);
    throw new Error('Unable to save record'); // FIXME: This should not be necessary but TypeORM throws a runtime
  }
}
