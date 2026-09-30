import 'dotenv/config';
import { envSchema } from './env.schema';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  mongo: {
    uri: string;
  };
  nhtsa: {
    baseUrl: string;
    requestTimeoutMs: number;
    ingestionPersistBatchSize: number;
    skipExistingMakes: boolean;
  };
  logLevel: string;
}

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed. See logged field errors above.');
  }

  const env = parsed.data;

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    mongo: {
      uri: env.MONGODB_URI,
    },
    nhtsa: {
      baseUrl: env.NHTSA_BASE_URL,
      requestTimeoutMs: env.NHTSA_REQUEST_TIMEOUT_MS,
      ingestionPersistBatchSize: env.NHTSA_INGESTION_PERSIST_BATCH_SIZE,
      skipExistingMakes: env.NHTSA_INGESTION_SKIP_EXISTING,
    },
    logLevel: env.LOG_LEVEL,
  };
}

export const config: AppConfig = loadConfig();

console.log('Loaded configuration:', config);
