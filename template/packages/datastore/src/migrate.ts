import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types'; // Import your Database type

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') }); // Assuming .env is in monorepo root

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateToLatest() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  // Use your Database type here
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  });

  const migrator = new Migrator({
    db, // db is Kysely<Database>
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: join(__dirname, 'migrations'),
    }),
  });

  console.log('Running migrations...');
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
    console.error('Failed to migrate');
    console.error(error);
    await db.destroy();
    process.exit(1);
  }

  console.log('Migrations completed.');
  await db.destroy();
}

migrateToLatest().catch((err) => {
  console.error('Migration script failed:');
  console.error(err);
  process.exit(1);
});
