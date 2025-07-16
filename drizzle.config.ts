import type { Config } from 'drizzle-kit';
import { env } from '@/lib/env/server';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config;