import mongoose from 'mongoose';
import { config } from './config';
import { PersistenceError } from '../common/errors/app-error';
import { childLogger } from './logger';

const log = childLogger('mongoose');

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(config.mongo.uri);
    log.info(`Connected to MongoDB at ${connection.connection.host}`);
    return connection;
  } catch (error) {
    throw new PersistenceError('Failed to connect to MongoDB', error);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
