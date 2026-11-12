import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { resolve, dirname, delimiter } from 'node:path';
try { process.loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const database = process.env.DEVELOPMENT_DATABASE_URL || '';
if (database && database === process.env.DATABASE_URL) throw new Error('Development must use a separate database.');
const env = { ...process.env, NODE_ENV: 'development', DATABASE_URL: database,
  STORAGE_DIR: resolve('.gstack/dev-data'), SESSION_SECRET: process.env.DEVELOPMENT_SESSION_SECRET || randomBytes(32).toString('base64url'),
  APP_ORIGIN: process.env.DEVELOPMENT_APP_ORIGIN || 'http://localhost:3000', VERCEL: '',
  GOOGLE_CLIENT_ID: process.env.DEVELOPMENT_GOOGLE_CLIENT_ID || '', GOOGLE_CLIENT_SECRET: process.env.DEVELOPMENT_GOOGLE_CLIENT_SECRET || '',
  RESEND_API_KEY: process.env.DEVELOPMENT_RESEND_API_KEY || '', MAIL_FROM: process.env.DEVELOPMENT_MAIL_FROM || '',
  ADMIN_EMAILS: process.env.DEVELOPMENT_ADMIN_EMAILS || '',
  CRON_SECRET: '', STORAGE_BACKEND: process.env.DEVELOPMENT_STORAGE_BACKEND || 'legacy',
  IYZICO_API_KEY: '', IYZICO_SECRET_KEY: '',
};
const pathKey = Object.keys(env).find(key => key.toLowerCase() === 'path') || 'PATH';
env[pathKey] = dirname(process.execPath) + delimiter + (env[pathKey] || '');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)], { env, stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
