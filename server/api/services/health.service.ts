import L from '../../common/logger';
export class HeallthService {
  async health(): Promise<string> {
    L.info('health endpoint check');
    return await Promise.resolve('200 OK');
  }
}
export default new HeallthService();
