import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { config } from './config/config';
import { childLogger } from './config/logger';

const log = childLogger('bootstrap');

async function bootstrap() {
  await connectDatabase();

  const app = await createApp();

  const server = app.listen(config.port, () => {
    log.info(`Server listening on port ${config.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

bootstrap().catch((error) => {
  log.error('Fatal startup error: %s', error);
  process.exit(1);
});
