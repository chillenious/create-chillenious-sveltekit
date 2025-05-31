import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { Kysely } from 'kysely';

import { getDatabase } from '../src/connection';
import type { Database, NewUser, User } from '../src/types';

describe('User CRUD operations', () => {
  let db: Kysely<Database>;

  beforeAll(async () => {
    db = getDatabase();
  });

  afterAll(async () => {
    // Clean up any created users to leave the database in a clean state.
    // This is important if tests are run repeatedly or against a shared test DB.
    // Consider a more robust cleanup strategy if needed, e.g., transactions or specific test data markers.
    try {
      await db.deleteFrom('users').execute();
    } catch (error) {
      console.error('Error cleaning up users:', error);
    }
    // If getDatabase creates a connection pool that needs explicit closing:
    // await db.destroy(); // Or similar method depending on Kysely/driver setup
  });

  test('should create, query, and delete a user', async () => {
    const newUser: NewUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      // picture and email_verified will use default values or can be specified
    };

    // Create User
    let createdUser: User | undefined;
    try {
      createdUser = await db
        .insertInto('users')
        .values(newUser)
        .returningAll()
        .executeTakeFirstOrThrow();

      expect(createdUser).toBeDefined();
      expect(createdUser!.email).toBe(newUser.email);
      expect(createdUser!.name).toBe('Test User');
      expect(createdUser!.id).toBeTypeOf('string'); // ID should be generated
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw to fail the test
    }

    // Query User
    let queriedUser: User | undefined;
    if (createdUser) {
      try {
        queriedUser = await db
          .selectFrom('users')
          .selectAll()
          .where('id', '=', createdUser.id)
          .executeTakeFirst();

        expect(queriedUser).toBeDefined();
        expect(queriedUser!.id).toBe(createdUser.id);
        expect(queriedUser!.email).toBe(newUser.email);
      } catch (error) {
        console.error('Error querying user:', error);
        throw error;
      }
    } else {
      throw new Error('Created user is undefined, cannot proceed to query.');
    }

    // Delete User
    if (createdUser) {
      try {
        const result = await db
          .deleteFrom('users')
          .where('id', '=', createdUser.id)
          .executeTakeFirst();

        // executeTakeFirst returns an object like { numDeletedRows: 1n } for pg
        expect(result?.numDeletedRows || 0n).toBeGreaterThan(0n);

        // Verify Deletion
        const deletedUser = await db
          .selectFrom('users')
          .selectAll()
          .where('id', '=', createdUser.id)
          .executeTakeFirst();
        expect(deletedUser).toBeUndefined();
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    } else {
      throw new Error('Created user is undefined, cannot proceed to delete.');
    }
  });
});
