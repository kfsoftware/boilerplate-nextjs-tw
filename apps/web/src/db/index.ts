import { drizzle } from 'drizzle-orm/better-sqlite3';
import postgres from 'postgres'

const conn = postgres(process.env.POSTGRES_URL!)
export const db = drizzle(conn);

export * from './auth';
