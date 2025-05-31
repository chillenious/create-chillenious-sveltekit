import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types';

// Load environment variables from .env.test file
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.test') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateToLatest() {
  // Build connection string from test environment variables
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.error('Missing required database environment variables in .env.test');
    console.error('Required: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }

  const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: join(__dirname, 'migrations'),
    }),
  });

  console.log('Running test database migrations...');
  const { error, results } = await migrator.migrateToLatest();

  if (results) {
    for (const it of results) {
      if (it.status === 'Success') {
        console.log(`Migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        console.error(`Failed to execute migration "${it.migrationName}"`);
      }
    }
  }

  if (error) {
    console.error('Failed to migrate test database');
    console.error(error);
    await db.destroy();
    process.exit(1);
  }

  console.log('Test database migrations completed.');
  await db.destroy();
}

migrateToLatest().catch((err) => {
  console.error('Test migration script failed:');
  console.error(err);
  process.exit(1);
});
