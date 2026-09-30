import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().positive(),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  NHTSA_BASE_URL: z.string().url(),
  NHTSA_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive(),
  NHTSA_INGESTION_PERSIST_BATCH_SIZE: z.coerce.number().int().positive(),
  NHTSA_INGESTION_SKIP_EXISTING: z.string().transform((value) => value.toLowerCase() === 'true'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
});

export type EnvShape = z.infer<typeof envSchema>;
