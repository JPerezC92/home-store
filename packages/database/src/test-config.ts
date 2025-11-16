import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { sql } from 'drizzle-orm';
import * as schema from './schemas/tasks.schema';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

export type TestDatabase = LibSQLDatabase<typeof schema>;

/**
 * Creates an in-memory test database instance
 * Each call creates a new isolated database
 */
export function createTestDatabase() {
  const client = createClient({
    url: ':memory:', // In-memory database for fast, isolated tests
  });

  const db = drizzle(client, { schema });
  return { db, client };
}

/**
 * Runs migrations on a test database
 * @param db - Test database instance
 * @param migrationsFolder - Path to migrations folder (relative to apps/api)
 */
export async function migrateTestDatabase(
  db: TestDatabase,
  migrationsFolder: string = './drizzle',
) {
  await migrate(db, { migrationsFolder });
}

/**
 * Cleans all data from test database tables
 * @param db - Test database instance
 */
export async function cleanTestDatabase(db: TestDatabase) {
  // Delete all rows from tasks table
  await db.delete(schema.tasks);

  // Reset SQLite auto-increment sequences
  await db.run(sql`DELETE FROM sqlite_sequence`);
}
