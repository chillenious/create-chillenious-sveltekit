import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { getLogger } from '@riffcraft/logger';

import { type DatabaseConfig, getDatabaseConfig } from './config';
import type { Database } from './types';

const logger = getLogger();

let db: Kysely<Database> | null = null;
let pool: Pool | null = null;

export function createDatabaseConnection(config?: DatabaseConfig): Kysely<Database> {
  const dbConfig = config || getDatabaseConfig();

  // Create a new PostgreSQL pool
  pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    max: dbConfig.max,
    idleTimeoutMillis: dbConfig.idleTimeoutMillis,
    connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
    ssl: dbConfig.ssl,
  });

  // Log pool events in development
  if (process.env.NODE_ENV !== 'production') {
    pool.on('connect', () => {
      logger.debug('Database pool: client connected');
    });

    pool.on('error', (err) => {
      logger.error('Database pool error:', err);
    });
  }

  // Create Kysely instance
  const dialect = new PostgresDialect({ pool });

  db = new Kysely<Database>({
    dialect,
    log(event) {
      if (event.level === 'query') {
        logger.debug('Query:', {
          sql: event.query.sql,
          parameters: event.query.parameters,
          duration: event.queryDurationMillis,
        });
      } else if (event.level === 'error') {
        logger.error('Query error:', event.error);
      }
    },
  });

  logger.info('Database connection established', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
  });

  return db;
}

export function getDatabase(): Kysely<Database> {
  if (!db) {
    db = createDatabaseConnection();
  }
  return db;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
    logger.info('Database connection closed');
  }

  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});
