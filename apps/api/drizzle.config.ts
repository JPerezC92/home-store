import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../../packages/database/src/schemas/*.schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
