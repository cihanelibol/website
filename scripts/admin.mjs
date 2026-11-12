import { neon } from '@neondatabase/serverless';
const args = new Map(process.argv.slice(2).map(arg => { const i = arg.indexOf('='); return i < 0 ? [arg, true] : [arg.slice(0, i), arg.slice(i + 1)]; }));
const url = process.env.DATABASE_ADMIN_URL;
const id = args.get('--user-id'), email = args.get('--expected-email');
const role = args.get('--role');
if (!url || !id || !email || !['admin', 'customer'].includes(role) || args.get('--target-host') !== new URL(url).hostname)
  throw new Error('Required: DATABASE_ADMIN_URL, --user-id=..., --expected-email=..., --role=admin|customer, --target-host=...');
const sql = neon(url);
const schema = await sql`SELECT to_regclass('app_security.settings') AS installed`;
if (schema[0]?.installed) {
  const state = await sql`SELECT active FROM app_security.settings`;
  if (!state[0]?.active) throw new Error('Relational cutover is incomplete. Resolve migration before role changes.');
  const target = await sql`SELECT data FROM app_security.users WHERE id=${id} AND email=${email}`;
  const account = target[0]?.data;
  if (!account?.emailVerifiedAt || account.disabled) throw new Error('Verified active identity required.');
  if (!args.has('--apply')) { console.log('Relational identity matched; dry run only.'); process.exit(0); }
  const results = await sql.transaction([
    sql`SELECT key FROM app_security.revisions WHERE key='users.json' FOR UPDATE`,
    sql`UPDATE app_security.users SET data=data || jsonb_build_object('role',${role}::text,'authVersion',coalesce((data->>'authVersion')::bigint,0)+1)
      WHERE id=${id} AND email=${email} AND data->>'emailVerifiedAt' IS NOT NULL AND coalesce((data->>'disabled')::boolean,false)=false RETURNING id`,
    sql`DELETE FROM app_security.sessions WHERE user_id=${id}`,
    sql`DELETE FROM app_security.account_tokens WHERE user_id=${id}`,
    sql`UPDATE app_security.revisions SET revision=revision+1 WHERE key='users.json'`,
  ]);
  if (results[1].length !== 1) throw new Error('Account changed; role was not assigned.');
  console.log(JSON.stringify({event:'admin.role_changed',userId:id,role,sessionsRevoked:true,backend:'relational'}));
  process.exit(0);
}
const rows = await sql`SELECT data, updated_at::text AS revision FROM json_store WHERE key = 'users.json'`;
const users = rows[0]?.data;
const user = users?.find(u => u.id === id && u.email === email && !u.disabled);
if (!user || !user.emailVerifiedAt) throw new Error('Verified, active account and exact identity match required. No changes made.');
if (!args.has('--apply')) { console.log('Identity matched. Dry run only; add --apply after independently verifying the account owner.'); process.exit(0); }
user.role = role; user.sessions = []; user.tokens = []; user.authVersion = (user.authVersion ?? 0) + 1;
const changed = await sql`UPDATE json_store SET data = ${JSON.stringify(users)}::jsonb,
  updated_at = GREATEST(clock_timestamp(), updated_at + interval '1 microsecond')
  WHERE key = 'users.json' AND updated_at = ${rows[0].revision}::timestamptz RETURNING key`;
if (changed.length !== 1) throw new Error('Concurrent change. Re-run the dry run; nothing was overwritten.');
console.log(JSON.stringify({ event: 'admin.role_changed', userId: id, role, sessionsRevoked: true }));
