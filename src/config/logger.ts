import pino from 'pino';
import { config } from './config';

const isProduction = config.nodeEnv === 'production';

export const logger = pino({
  level: config.logLevel,
  base: { service: 'car-inventory-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
});

export function childLogger(context: string) {
  return logger.child({ context });
}
