import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Optionally, ensure the uuid-ossp extension is available if you were to use uuid_generate_v4()
  // For gen_random_uuid() (PostgreSQL 13+), no extension is typically needed.
  // await db.executeQuery(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.compile(db))

  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)')
    .addColumn('picture', 'text')
    .addColumn('email_verified', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
