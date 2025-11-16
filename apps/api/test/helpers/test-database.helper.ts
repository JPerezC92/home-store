import {
  cleanTestDatabase,
  createTestDatabase,
  migrateTestDatabase,
  type TestDatabase,
} from '@repo/database';

/**
 * Cleans all data from the test database
 * Use in afterEach hooks to ensure test isolation
 */
export async function resetTestDatabase(db: TestDatabase): Promise<void> {
  await cleanTestDatabase(db);
}

/**
 * Gets a fresh test database instance for a test suite
 * Useful for test files that need their own database
 */
export async function setupTestDatabase() {
  const { db, client } = createTestDatabase();
  await migrateTestDatabase(db);
  return { db, client };
}
