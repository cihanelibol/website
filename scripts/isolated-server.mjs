import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { resolve, dirname, delimiter } from 'node:path';
const env = { ...process.env, DATABASE_URL: 'postgresql://isolated:isolated@127.0.0.1:1/isolated',
  SESSION_SECRET: randomBytes(32).toString('base64url'), RESEND_API_KEY: '', GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '',
  IYZICO_API_KEY: '', IYZICO_SECRET_KEY: '', EASYTRADE_CATALOG_SLUG: 'isolated', VERCEL_OIDC_TOKEN: '',
  VERCEL: '', CRON_SECRET: '', CSP_ENFORCE: '1', STORAGE_BACKEND: 'legacy', APP_ORIGIN: 'https://test.example', NEXT_TELEMETRY_DISABLED: '1', SECURITY_BUILD: '1',
  NODE_OPTIONS: `--require="${resolve('scripts/no-network.cjs').replaceAll('\\', '/')}"` };
const pathKey = Object.keys(env).find(key => key.toLowerCase() === 'path') || 'PATH';
env[pathKey] = dirname(process.execPath) + delimiter + (env[pathKey] || '');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3107'], { env, stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
