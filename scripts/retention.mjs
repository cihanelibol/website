// Operator-only, dry run by default. Never logs personal data or secrets.
import { neon } from '@neondatabase/serverless';
const url = process.env.DATABASE_ADMIN_URL;
const host = process.argv.find(arg => arg.startsWith('--target-host='))?.slice(14);
if (!url || new URL(url).hostname !== host) throw new Error('Requires DATABASE_ADMIN_URL and --target-host=<exact hostname>.');
const apply = process.argv.includes('--apply');
const sql = neon(url);
const now = Date.now();
const installed = await sql`SELECT to_regclass('app_security.settings') AS installed`;
const relational = installed[0].installed && (await sql`SELECT active FROM app_security.settings`)[0].active;
const rows = await sql`SELECT key, data, updated_at::text AS revision FROM json_store
  WHERE key IN ('users.json', 'messages.json', 'activity.json', 'oauth.json') OR key ~ '^limits-[a-f0-9]{2}[.]json$'`;
if (relational) {
  const snapshot = (await sql`SELECT data, revision FROM app_security.read_collection('users.json')`)[0];
  const legacyIndex = rows.findIndex(row => row.key === 'users.json');
  if (legacyIndex >= 0) rows.splice(legacyIndex, 1);
  rows.push({ key: 'users.json', ...snapshot });
}
function recent(entries, field, days) {
  if (!Array.isArray(entries) || entries.some(entry => !Number.isFinite(Date.parse(entry[field]))))
    throw new Error('Unexpected timestamp schema; no deletion attempted for this key.');
  return entries.filter(entry => Date.parse(entry[field]) > now - days * 86400_000);
}
for (const row of rows) {
  const before = JSON.stringify(row.data);
  let data = row.data;
  if (row.key === 'users.json') data = data.map(user => ({ ...user,
    sessions: (user.sessions || []).filter(s => s.expires > now), tokens: (user.tokens || []).filter(t => t.expires > now),
    ...(user.pendingMfa?.expires <= now ? { pendingMfa: undefined } : {}),
  }));
  else if (row.key === 'messages.json') data = recent(data, 'createdAt', 90);
  else if (row.key === 'activity.json') data = recent(data, 'at', 30).slice(-2000);
  else data = Object.fromEntries(Object.entries(data).filter(([, value]) => (typeof value === 'number' ? value : value.expires) > now));
  if (before === JSON.stringify(data)) continue;
  console.log(JSON.stringify({ key: row.key, changed: true, recordsBefore: Object.keys(row.data).length, recordsAfter: Object.keys(data).length, mode: apply ? 'apply' : 'dry-run' }));
  if (apply) {
    if (relational && row.key === 'users.json') {
      const result = await sql`SELECT app_security.replace_collection('users.json', ${row.revision}::bigint, ${JSON.stringify(data)}::jsonb) AS changed`;
      if (!result[0].changed) throw new Error('Concurrent identity update; re-run dry run.');
      continue;
    }
    const result = await sql`UPDATE json_store SET data = ${JSON.stringify(data)}::jsonb,
      updated_at = GREATEST(clock_timestamp(), updated_at + interval '1 microsecond')
      WHERE key = ${row.key} AND updated_at = ${row.revision}::timestamptz RETURNING key`;
    if (!result.length) throw new Error('Concurrent update; no overwrite. Re-run dry run. Earlier keys may have completed.');
  }
}
// Audit partitions contain identifiers, not message bodies. Keep 90 complete days.
const auditPartitions = await sql`SELECT key FROM json_store WHERE key ~ '^audit-[0-9]{4}-[0-9]{2}-[0-9]{2}[.]json$'`;
for (const { key } of auditPartitions) {
  const date = Date.parse(key.slice(6, 16));
  if (!Number.isFinite(date) || date >= now - 91 * 86400_000) continue;
  console.log(JSON.stringify({ key, expiredAuditPartition: true, mode: apply ? 'apply' : 'dry-run' }));
  if (apply) await sql`DELETE FROM json_store WHERE key=${key}`;
}
console.log('Retention inspection complete. Orders and account records are never deleted by this script.');
