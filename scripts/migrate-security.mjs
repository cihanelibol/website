import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Client } from '@neondatabase/serverless';

async function main() {
const args = new Map(process.argv.slice(2).map(value => { const i=value.indexOf('='); return i<0?[value,true]:[value.slice(0,i),value.slice(i+1)]; }));
const url = process.env.DATABASE_ADMIN_URL;
if (!url || new URL(url).hostname !== args.get('--target-host')) throw new Error('DATABASE_ADMIN_URL and --target-host=<exact hostname> required.');
const runtimeRole = args.get('--runtime-role');
if (typeof runtimeRole !== 'string' || !/^[a-z_][a-z0-9_]{1,62}$/.test(runtimeRole)) throw new Error('Explicit --runtime-role required.');
if (args.has('--apply') && !args.get('--restore-evidence')) throw new Error('--restore-evidence=<verified rehearsal reference> required before applying.');
if (args.has('--apply') && !args.has('--activate')) throw new Error('Cutover requires --activate during a maintenance window; stale backfills are never left writable.');
// Local rehearsal uses TCP PostgreSQL; production Neon uses its WebSocket driver.
const Driver = ['localhost','127.0.0.1'].includes(new URL(url).hostname) ? (await import('pg')).default.Client : Client;
const client = new Driver({ connectionString: url, connectionTimeoutMillis: 10_000 });
await client.connect();
try {
  const role = await client.query('SELECT rolname, rolcreatedb, rolsuper, rolcreaterole FROM pg_roles WHERE rolname=$1', [runtimeRole]);
  if (role.rows.length !== 1 || role.rows[0].rolcreatedb || role.rows[0].rolsuper || role.rows[0].rolcreaterole) throw new Error('Runtime role must already exist and have no administrative attributes.');
  const owner = await client.query('SELECT current_user');
  if (owner.rows[0].current_user === runtimeRole) throw new Error('Runtime and migration roles must be different.');
  const existing = await client.query("SELECT to_regclass('app_security.settings') AS installed");
  if (existing.rows[0].installed) throw new Error('Migration already installed. Inspect state; never repeat blindly.');
  const source = await client.query("SELECT key, jsonb_array_length(data) AS records FROM public.json_store WHERE key IN ('users.json','orders.json') ORDER BY key");
  const migration = await readFile(new URL('../migrations/001_relational_security.sql', import.meta.url), 'utf8');
  console.log(JSON.stringify({ mode:args.has('--apply')?'apply':'dry-run', source:source.rows, migrationSha256:createHash('sha256').update(migration).digest('hex'), runtimeRole }));
  if (!args.has('--apply')) process.exitCode=0;
  else {
    await client.query('BEGIN');
    try {
      await client.query("SET LOCAL lock_timeout='5s'; SET LOCAL statement_timeout='60s'");
      await client.query('LOCK TABLE public.json_store IN SHARE ROW EXCLUSIVE MODE');
      await client.query(migration);
      for (const key of ['users.json','orders.json']) {
        const imported = await client.query('SELECT app_security.write_collection($1,0,coalesce((SELECT data FROM public.json_store WHERE key=$1),\'[]\'::jsonb),true) AS changed',[key]);
        if (!imported.rows[0].changed) throw new Error('Unexpected migration conflict');
      }
      const diff = await client.query(`SELECT count(*)::integer AS mismatches FROM public.json_store j,
        LATERAL jsonb_array_elements(j.data) original
        WHERE j.key IN ('users.json','orders.json') AND NOT EXISTS (
          SELECT 1 FROM app_security.read_collection(j.key) r, LATERAL jsonb_array_elements(r.data) migrated
          WHERE migrated->>'id'=original->>'id' AND
            migrated - ARRAY['sessions','tokens'] = original - ARRAY['sessions','tokens'] AND
            coalesce(migrated->'sessions','[]'::jsonb) @> coalesce(original->'sessions','[]'::jsonb) AND
            coalesce(original->'sessions','[]'::jsonb) @> coalesce(migrated->'sessions','[]'::jsonb) AND
            coalesce(migrated->'tokens','[]'::jsonb) @> coalesce(original->'tokens','[]'::jsonb) AND
            coalesce(original->'tokens','[]'::jsonb) @> coalesce(migrated->'tokens','[]'::jsonb))`);
      if (diff.rows[0].mismatches) throw new Error('Backfill comparison failed; rolling back');
      await client.query(`GRANT USAGE ON SCHEMA app_security TO "${runtimeRole}";
        GRANT EXECUTE ON FUNCTION app_security.read_collection(text), app_security.replace_collection(text,bigint,jsonb) TO "${runtimeRole}";
        GRANT USAGE ON SCHEMA public TO "${runtimeRole}";
        GRANT SELECT,INSERT,UPDATE,DELETE ON public.json_store TO "${runtimeRole}"`);
      // Backfill and legacy write fence are committed together, during maintenance.
      await client.query('UPDATE app_security.settings SET active=true');
      await client.query('COMMIT');
      console.log(JSON.stringify({ migrated:true, active:args.has('--activate'), comparison:'matched', next:'Set STORAGE_BACKEND=relational with the restricted runtime connection for cutover.' }));
    } catch(error) { await client.query('ROLLBACK'); throw error; }
  }
} finally { await client.end(); }
}
main().catch(error => { console.error(JSON.stringify({ error:'Migration failed; inspect configuration/schema and run dry-run again.', code:error.code ?? 'MIGRATION_ERROR' })); process.exitCode=1; });
