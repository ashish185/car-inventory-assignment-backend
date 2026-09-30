import { NextFunction, Request, Response } from 'express';
import { AppError } from './errors/app-error';
import { childLogger } from '../config/logger';

const log = childLogger('error-handler');

// Express error-handling middleware (4 args) for anything outside GraphQL.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    log.error(err.toJSON());
    res.status(502).json({ error: err.toJSON() });
    return;
  }

  log.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}
