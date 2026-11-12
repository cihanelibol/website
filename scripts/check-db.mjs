// Read-only check. Never creates or mutates tables.
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT to_regclass('public.json_store') IS NOT NULL AS ready`;
if (!rows[0]?.ready) throw new Error('json_store is missing. Use a separate migration role.');
console.log('Database reachable; json_store exists. No data read or changed.');
