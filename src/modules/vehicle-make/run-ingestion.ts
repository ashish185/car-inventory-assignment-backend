import { connectDatabase, disconnectDatabase } from '../../config/database';
import { IngestionService } from './vehicle-make.service';
import { childLogger } from '../../config/logger';

const log = childLogger('run-ingestion');

async function main() {
  await connectDatabase();

  try {
    const result = await new IngestionService().run();
    process.exitCode = result.failed > 0 ? 1 : 0;
  } finally {
    await disconnectDatabase();
  }
}

main().catch((error) => {
  log.error('Ingestion crashed: %s', error);
  process.exitCode = 1;
});
