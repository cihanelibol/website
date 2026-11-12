// Cannot use DATABASE_URL or touch local application data.
import { neon } from '@neondatabase/serverless';
const url = process.env.TEST_DATABASE_URL;
const confirmedHost = process.argv.find(arg => arg.startsWith('--confirm-test-host='))?.split('=')[1];
if (process.env.NODE_ENV !== 'test' || !url || process.env.VERCEL_ENV === 'production')
  throw new Error('Explicit NODE_ENV=test and TEST_DATABASE_URL are required.');
const target = new URL(url);
if (target.hostname !== confirmedHost || url === process.env.DATABASE_URL || !process.argv.includes('--apply'))
  throw new Error('Requires --confirm-test-host=<hostname> --apply and a separate test database.');
const sql = neon(url);
// This marker must be provisioned by the disposable test database owner.
const marker = await sql`SELECT value FROM security_test_environment WHERE name = 'disposable'`;
if (marker[0]?.value !== 'yes') throw new Error('Database is not disposable. No changes made.');
await sql`DELETE FROM json_store WHERE key = ANY(${['users.json', 'reviews.json', 'orders.json', 'addresses.json', 'activity.json']}::text[])`;
console.log('Disposable test records removed. No local files changed.');
