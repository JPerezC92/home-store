import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schemas/tasks.schema';

// Create libsql client
const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Type export for dependency injection
export type Database = typeof db;

// Symbol for dependency injection
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');
