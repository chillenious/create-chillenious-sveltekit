import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').onDelete('cascade').notNull())
    .addColumn('expires_at', 'timestamp', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema.createIndex('session_user_id_index').on('sessions').column('user_id').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sessions').execute();
  // The index session_user_id_index will be dropped automatically when the table is dropped.
}
