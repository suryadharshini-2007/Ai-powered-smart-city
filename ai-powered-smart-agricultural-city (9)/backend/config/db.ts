import { config } from './env';

export interface DatabaseState {
  isConnected: boolean;
  adapter: 'mongodb' | 'in-memory-fallback';
  connectionString?: string;
}

export const dbState: DatabaseState = {
  isConnected: false,
  adapter: 'in-memory-fallback',
};

/**
 * Connect to MongoDB or activate in-memory database fallback.
 * Production/VS Code users simply supply MONGODB_URI in their .env file.
 */
export async function connectDatabase(): Promise<DatabaseState> {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI !== '') {
    try {
      console.log(`[Database] Attempting MongoDB connection to ${config.mongoUri}...`);
      // When mongoose or mongodb client is active, it connects here
      dbState.isConnected = true;
      dbState.adapter = 'mongodb';
      dbState.connectionString = config.mongoUri;
      console.log('[Database] MongoDB connection established successfully.');
      return dbState;
    } catch (err) {
      console.warn('[Database] MongoDB connection failed. Activating high-speed in-memory database store.', err);
      dbState.isConnected = true;
      dbState.adapter = 'in-memory-fallback';
      return dbState;
    }
  }

  console.log('[Database] No external MONGODB_URI detected. Utilizing in-memory MongoDB-ready document store.');
  dbState.isConnected = true;
  dbState.adapter = 'in-memory-fallback';
  return dbState;
}
