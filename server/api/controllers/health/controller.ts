import HealthService from '../../services/health.service';
import { type Request, type Response } from 'express';

export class Controller {
  health(_: Request, res: Response): void {
    /* 	#swagger.tags = ['Health']
#swagger.description = 'Endpoint for health' */
    HealthService.health().then((r: any) => res.json(r));
  }
}
export default new Controller();
