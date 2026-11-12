// Real PostgreSQL integration suite. Explicit disposable database only; no .env.local loading.
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { randomBytes, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const url=process.env.TEST_DATABASE_URL;
if(!url || !['127.0.0.1','localhost'].includes(new URL(url).hostname) || !new URL(url).pathname.startsWith('/security_test'))
  throw new Error('TEST_DATABASE_URL must explicitly target a localhost security_test database.');
const pool=new pg.Pool({connectionString:url,max:16});
const client=await pool.connect();
let assertions=0;
const checked=async(name,fn)=>{await fn();assertions++;console.log(`PASS ${name}`);};
const user=(id,email)=>({id,name:'Synthetic user',email,passwordHash:'',role:'customer',authVersion:1,createdAt:new Date().toISOString(),sessions:[],tokens:[]});
const uid='a'.repeat(24), uid2='b'.repeat(24), hash='c'.repeat(64);
try {
  await client.query('BEGIN');
  // Suite owns a dedicated local database. Refuse reruns against any existing schema.
  const existing=await client.query("SELECT to_regclass('app_security.users') AS present");
  if(existing.rows[0].present)throw new Error('Test database already contains schema; supply a fresh disposable database.');
  await client.query('CREATE TABLE public.json_store(key text PRIMARY KEY,data jsonb NOT NULL,updated_at timestamptz NOT NULL DEFAULT now())');
  await client.query(await readFile(new URL('../migrations/001_relational_security.sql',import.meta.url),'utf8'));
  const runtime=`security_test_${randomBytes(6).toString('hex')}`;
  await client.query(`CREATE ROLE "${runtime}"; GRANT USAGE ON SCHEMA app_security TO "${runtime}"; GRANT EXECUTE ON FUNCTION app_security.read_collection(text),app_security.replace_collection(text,bigint,jsonb) TO "${runtime}"`);
  await client.query('COMMIT');
  const snapshot=async(key='users.json')=>(await pool.query('SELECT * FROM app_security.read_collection($1)',[key])).rows[0];
  const replace=async(rows,rev,key='users.json')=>(await pool.query('SELECT app_security.replace_collection($1,$2,$3) AS changed',[key,rev,JSON.stringify(rows)])).rows[0].changed;
  const initial=user(uid,'a@example.test');
  await checked('inserts normalized user and reads safe canonical snapshot',async()=>{assert.equal(await replace([initial],0),true);assert.equal((await snapshot()).data[0].email,initial.email);});
  await checked('rejects stale revision without overwriting current data',async()=>{assert.equal(await replace([user(uid,'wrong@example.test')],0),false);assert.equal((await snapshot()).data[0].email,initial.email);});
  await checked('enforces email uniqueness with atomic rollback',async()=>{const s=await snapshot();await assert.rejects(replace([...s.data,user(uid2,initial.email)],s.revision),{code:'23505'});assert.equal((await snapshot()).revision,s.revision);assert.equal((await snapshot()).data.length,1);});
  await checked('enforces role boundary in the database function',async()=>{const s=await snapshot();s.data[0].role='admin';await assert.rejects(replace(s.data,s.revision),/cannot assign roles/);});
  await checked('persists sessions in rows and rejects foreign user references',async()=>{const s=await snapshot();s.data[0].sessions=[{hash,created:Date.now(),expires:Date.now()+60000}];await replace(s.data,s.revision);assert.equal((await pool.query('SELECT count(*)::int AS n FROM app_security.sessions')).rows[0].n,1);await assert.rejects(pool.query('INSERT INTO app_security.sessions(user_id,data) VALUES($1,$2)',['f'.repeat(24),JSON.stringify({hash:'e'.repeat(64),created:Date.now(),expires:Date.now()+60000})]),{code:'23503'});});
  await checked('preserves all parallel updates across separate connections',async()=>{await Promise.all(Array.from({length:12},async()=>{for(let n=0;n<30;n++){const s=await snapshot();s.data[0].authVersion++;if(await replace(s.data,s.revision))return;}throw new Error('Retries exhausted');}));assert.equal((await snapshot()).data[0].authVersion,13);});
  await checked('makes one-time token consumption atomic',async()=>{let s=await snapshot();s.data[0].tokens=[{hash,purpose:'reset',expires:Date.now()+60000}];await replace(s.data,s.revision);const consume=async()=>{for(let n=0;n<10;n++){const current=await snapshot();if(!current.data[0].tokens.length)return false;current.data[0].tokens=[];if(await replace(current.data,current.revision))return true;}return false;};assert.equal((await Promise.all([consume(),consume(),consume()])).filter(Boolean).length,1);});
  await checked('enforces identity subject uniqueness',async()=>{const s=await snapshot();s.data[0].googleSub='same-subject';await replace([...s.data,{...user(uid2,'b@example.test'),googleSub:'other-subject'}],s.revision);const next=await snapshot();next.data[1].googleSub='same-subject';await assert.rejects(replace(next.data,next.revision),{code:'23505'});});
  const order={id:`GA-${randomUUID()}`,userId:uid,requestKey:'unique-request',total:12.34,items:[],paymentStatus:'beklemede',status:'yeni'};
  await checked('enforces order idempotency and amount constraints',async()=>{assert.equal(await replace([order],0,'orders.json'),true);let s=await snapshot('orders.json');await assert.rejects(replace([...s.data,{...order,id:'another-order'}],s.revision,'orders.json'),{code:'23505'});s=await snapshot('orders.json');s.data[0].total=-1;await assert.rejects(replace(s.data,s.revision,'orders.json'),{code:'23514'});});
  await checked('runtime role cannot run DDL, private import or read raw credential tables',async()=>{await client.query(`SET ROLE "${runtime}"`);try{await assert.rejects(client.query('CREATE TABLE app_security.forbidden(id int)'),{code:'42501'});await assert.rejects(client.query('SELECT * FROM app_security.users'),{code:'42501'});await assert.rejects(client.query("SELECT app_security.write_collection('users.json',0,'[]',true)"),{code:'42501'});assert.equal((await client.query("SELECT data FROM app_security.read_collection('users.json')")).rows.length,1);}finally{await client.query('RESET ROLE');}});
  await checked('cutover fences writes from an old application version',async()=>{await pool.query('UPDATE app_security.settings SET active=true');await assert.rejects(pool.query("INSERT INTO public.json_store(key,data) VALUES('users.json','[]')"),/Legacy core writes/);});
  await checked('legacy fence cannot be bypassed by renaming a protected key',async()=>{await pool.query('UPDATE app_security.settings SET active=false');await pool.query("INSERT INTO public.json_store(key,data) VALUES('users.json','[]')");await pool.query('UPDATE app_security.settings SET active=true');await assert.rejects(pool.query("UPDATE public.json_store SET key='renamed.json' WHERE key='users.json'"),/Legacy core writes/);});
  await checked('failed transaction leaves no partial schema changes',async()=>{await client.query('BEGIN');await client.query('CREATE TABLE app_security.rollback_probe(id int)');await client.query('ROLLBACK');assert.equal((await client.query("SELECT to_regclass('app_security.rollback_probe') AS present")).rows[0].present,null);});
  await checked('operator migration backfills, compares and fences a fresh database atomically',async()=>{
    const database=`security_test_migration_${randomBytes(6).toString('hex')}`;
    await pool.query(`CREATE DATABASE "${database}"`);
    const target=new URL(url);target.pathname=`/${database}`;
    const rehearsal=new pg.Client({connectionString:target.href});await rehearsal.connect();
    try {
      await rehearsal.query('CREATE TABLE public.json_store(key text PRIMARY KEY,data jsonb NOT NULL,updated_at timestamptz NOT NULL DEFAULT now())');
      const users=(await snapshot()).data,orders=(await snapshot('orders.json')).data;
      for(const [key,data] of [['users.json',users],['orders.json',orders]])await rehearsal.query('INSERT INTO public.json_store(key,data) VALUES($1,$2)',[key,JSON.stringify(data)]);
      const code=await new Promise((resolve,reject)=>{
        const child=spawn(process.execPath,['scripts/migrate-security.mjs',`--target-host=${target.hostname}`,`--runtime-role=${runtime}`,'--apply','--activate','--restore-evidence=isolated-synthetic-rehearsal'],{env:{...process.env,DATABASE_ADMIN_URL:target.href},stdio:['ignore','pipe','pipe']});
        let output='';child.stdout.on('data',chunk=>{output+=chunk;});child.stderr.on('data',chunk=>{output+=chunk;});child.on('error',reject);child.on('exit',code=>{if(code)reject(new Error(`Migration rehearsal failed: ${output}`));else resolve(code);});
      });
      assert.equal(code,0);
      for(const [key,expected] of [['users.json',users],['orders.json',orders]])assert.deepEqual((await rehearsal.query('SELECT data FROM app_security.read_collection($1)',[key])).rows[0].data,expected);
      await assert.rejects(rehearsal.query("UPDATE public.json_store SET data='[]' WHERE key='users.json'"),/Legacy core writes/);
      await rehearsal.query(`SET ROLE "${runtime}"`);
      assert.equal((await rehearsal.query("SELECT data FROM app_security.read_collection('users.json')")).rows[0].data.length,users.length);
      await assert.rejects(rehearsal.query('DROP SCHEMA app_security CASCADE'),{code:'42501'});
    } finally {await rehearsal.end();}
  });
  console.log(JSON.stringify({postgresIntegrationChecks:assertions,passed:true}));
} finally {client.release();await pool.end();}
