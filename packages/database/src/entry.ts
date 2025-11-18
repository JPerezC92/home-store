// Database configuration
export { db, DATABASE_CONNECTION } from './config';
export type { Database } from './config';

// Task schema and Drizzle types
export { tasks } from './schemas/tasks.schema';
export type { DbTask, NewDbTask } from './schemas/tasks.schema';

// Transaction schema and Drizzle types
export { transactions, uploadHistory } from './schemas/transactions.schema';
export type {
  DbTransaction,
  NewDbTransaction,
  DbUploadHistory,
  NewDbUploadHistory,
} from './schemas/transactions.schema';

// Test utilities
export {
  createTestDatabase,
  migrateTestDatabase,
  cleanTestDatabase,
} from './test-config';
export type { TestDatabase } from './test-config';
