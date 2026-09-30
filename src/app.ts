import express, { Express } from 'express';
import pinoHttp from 'pino-http';
import { attachGraphQLServer } from './graphql/server';
import { errorHandler } from './common/error-handler';
import { logger } from './config/logger';

export async function createApp(): Promise<Express> {
  const app = express();

  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  await attachGraphQLServer(app, '/graphql');

  app.use(errorHandler);

  return app;
}
