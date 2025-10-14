import { defineConfig } from 'drizzle-kit';

// Explicitly check databaseUrl is defined before passing it to Drizzle's config
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('❌ Missing DATABASE_URL environment variable');
}

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
