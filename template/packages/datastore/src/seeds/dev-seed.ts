import { getDatabase } from '../connection';
// import { yourSchema } from '../schema'; // Assuming you have a schema definition

const db = getDatabase();

async function seed() {
  console.log('Seeding development database...');

  // Example: Clear existing data (optional, use with caution)
  // await db.delete(yourSchema.users);
  // await db.delete(yourSchema.posts);

  // Example: Insert new data
  // await db.insert(yourSchema.users).values([
  //   { id: 'user1', name: 'Dev User 1', email: 'dev1@example.com' },
  //   { id: 'user2', name: 'Dev User 2', email: 'dev2@example.com' },
  // ]);

  // await db.insert(yourSchema.posts).values([
  //   { title: 'Dev Post 1', content: 'Content for dev post 1', userId: 'user1' },
  //   { title: 'Dev Post 2', content: 'Content for dev post 2', userId: 'user2' },
  // ]);

  console.log('Development database seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding development database:', error);
  process.exit(1);
});
