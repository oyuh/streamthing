import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Simple client that works in all environments
const client = postgres(process.env.DATABASE_URL || '');
export const db = drizzle(client, { schema });
