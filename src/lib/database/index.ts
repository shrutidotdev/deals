import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schemas/schema';
import { env } from '../env/server';

const sql = neon(env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

