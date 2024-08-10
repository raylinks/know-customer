import './common/env';
import Server from './common/server';
import express, { type Express } from 'express';
import pino from 'pino-http';

const app: Express = express();

app.use(pino());

const port = parseInt(process.env.PORT ?? '80');

export default new Server().listen(port);
