import express, { type Application } from 'express';
import path from 'path';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import l from './logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import routes from '../routes';
import { dataSource } from '../data-source';
import pino from 'pino-http';
// import auditLogMiddleware from '../api/middlewares/auditLogger.middleware';
const app = express();
const env = JSON.parse(process.env.APP_SECRETS ?? '{}');

// app.use(bodyParser.json())

// unleash.on('synchronized', () => {
//   l.info('Feature flags loaded');
// });

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../..');

    app.use(express.json({ limit: env.REQUEST_LIMIT ?? '100kb' }));
    app.use(
      express.urlencoded({
        extended: true,
        limit: env.REQUEST_LIMIT ?? '100kb',
      }),
    );
    app.use(express.text({ limit: env.REQUEST_LIMIT ?? '100kb' }));
    app.use(cookieParser(env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.use(
      pino({
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      }),
    );
    //app.use(auditLogMiddleware);

    app.use('/', routes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // load all secrets
    //SecretManager.loadSecrets();
    dataSource
      .initialize()
      .then(async () => {
        // await runSeeders(dataSource);
        l.info('Data source intitialized...');
        // process.exit();
      })
      .catch((err: any) => {
        l.error(err);
      });
  }

  router(routes: (app: Application) => void): this {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void => {
      l.info('---------------------------------');
      l.info(`🚀 App is up and running in ${env.NODE_ENV ?? 'development'} @: ${os.hostname()} on port: ${p}} 🚀`);
      l.info('---------------------------------');
    };

    const server = http.createServer(app);

    server.on('error', (err) => {
      l.info(err.message);
      throw err;
    });
    server.listen(port, welcome(port));

    return app;
  }
}
