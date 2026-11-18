import { spawn } from 'node:child_process';
import { createHmac, randomBytes } from 'node:crypto';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, sep, basename } from 'node:path';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

// Real Next pages, synthetic local orders, no payment/provider/database connections.
const storage = await mkdtemp(join(tmpdir(), 'gri-checkout-preview-'));
const secret = randomBytes(32).toString('base64url');
const origin = 'http://127.0.0.1:3118';
const evidence = resolve('.impeccable/evidence/checkout');
await mkdir(evidence, { recursive: true });
const base = { userId: null, customerName: 'Deneme Müşterisi', email: 'buyer@example.test', phone: '05555555555', addressText: 'Örnek Mahallesi, Akvaryum Sokak No: 12, Kadıköy, İstanbul 34710', items: [{ id: 1, name: 'Akvaryum dış filtre seti', price: 749.5, qty: 2 }], total: 1699, shippingFee: 200, paymentMethod: 'iyzico', createdAt: new Date().toISOString() };
const variants = [
  { id: 'GA-111111111111111111111111', paymentStatus: 'odendi', submission: 'sent', status: 'onaylandi' },
  { id: 'GA-222222222222222222222222', paymentStatus: 'odendi', submission: 'unknown', status: 'yeni' },
  { id: 'GA-333333333333333333333333', paymentStatus: 'basarisiz', status: 'yeni' },
  { id: 'GA-444444444444444444444444', paymentStatus: 'kontrol', status: 'yeni' },
  { id: 'GA-555555555555555555555555', paymentStatus: 'odendi', status: 'iptal' },
];
await writeFile(join(storage, 'orders.json'), JSON.stringify(variants.map(v => ({ ...base, ...v }))));
const env = { ...process.env, DATABASE_URL: '', STORAGE_BACKEND: 'legacy', STORAGE_DIR: storage, SESSION_SECRET: secret, IYZICO_API_KEY: '', IYZICO_SECRET_KEY: '', IYZICO_BASE_URL: '', RESEND_API_KEY: '', GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', VERCEL: '', VERCEL_ENV: '', SECURITY_BUILD: '1', APP_ORIGIN: origin, EASYTRADE_CATALOG_SLUG: 'isolated', NEXT_TELEMETRY_DISABLED: '1', NODE_OPTIONS: `--require="${resolve('scripts/no-network.cjs').replaceAll('\\', '/')}"` };
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3118'], { env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let logs = '';
server.stdout.on('data', c => { logs = (logs + c).slice(-6000); });
server.stderr.on('data', c => { logs = (logs + c).slice(-6000); });
let browser;
try {
  for (let attempt = 0; attempt < 90; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview exited: ${logs}`);
    try { const r = await fetch(`${origin}/sepet/sonuc`); if (r.ok) break; } catch { /* compile */ }
    if (attempt === 89) throw new Error(`Preview timed out: ${logs}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/sepet/sonuc?durum=tamam&siparis=${variants[0].id}`);
  assert.match(await page.locator('h1').innerText(), /erişilemiyor/);
  assert.equal(await page.locator('.receipt-summary').count(), 0);
  const cart = [{ id: 1, name: 'Akvaryum dış filtre seti', price: 749.5, image: null, unit: 'adet', maxStock: 10, qty: 3 }, { id: 2, name: 'Sonradan eklenen ürün', price: 20, image: null, unit: 'adet', maxStock: 10, qty: 1 }];
  await page.evaluate(cart => localStorage.setItem('ga_cart', JSON.stringify(cart)), cart);
  await page.reload();
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('ga_cart')))[0].qty, 3);
  for (const [index, variant] of variants.entries()) {
    if (index === 0) await page.evaluate(id => sessionStorage.setItem('ga_checkout_draft', JSON.stringify({ resultUrl: `/sepet/sonuc?siparis=${id}` })), variant.id);
    if (index === 4) await page.evaluate(id => sessionStorage.setItem('ga_checkout_draft', JSON.stringify({ resultUrl: `/sepet/sonuc?siparis=${id}` })), variant.id);
    const expires = Math.floor(Date.now() / 1000) + 30 * 86400;
    const access = `${expires}.${createHmac('sha256', secret).update(`order-read:${variant.id}:${expires}`).digest('hex')}`;
    await page.goto(`${origin}/sepet/sonuc?siparis=${variant.id}&access=${access}`);
    await page.locator('.receipt-summary').waitFor();
    assert.ok(await page.locator('h1').innerText());
    if (index === 0) {
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('ga_cart'))[0].qty === 1);
      await page.reload();
      await page.locator('.receipt-summary').waitFor();
      assert.deepEqual(JSON.parse(await page.evaluate(() => localStorage.getItem('ga_cart'))).map(i => [i.id, i.qty]), [[1, 1], [2, 1]]);
    }
    if (index === 1 || index === 3) assert.equal(await page.getByRole('button', { name: 'Güvenli ödemeye devam et' }).count(), 0);
    if (index === 4) {
      await page.waitForFunction(() => sessionStorage.getItem('ga_checkout_draft') === null);
      assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('ga_cart')))[0].qty, 1);
    }
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}, ${variant.paymentStatus}`);
      await page.screenshot({ path: join(evidence, `receipt-${index}-${width}.png`), fullPage: true });
    }
  }
  await page.goto(`${origin}/sepet`);
  await page.getByRole('button', { name: /Teslimat Bilgilerine Geç/i }).click();
  for (const [id, value] of Object.entries({ customer_name: 'Deneme Müşterisi', customer_email: 'buyer@example.test', customer_phone: '05555555555', address: 'Örnek Mahallesi Akvaryum Sokak 12', city: 'İstanbul' })) {
    await page.locator(`#checkout-${id}`).fill(value);
  }
  await page.getByRole('button', { name: /Ödemeye Geç/i }).click();
  assert.ok(await page.getByRole('button', { name: 'Ödeme kullanılamıyor' }).isDisabled());
  await page.screenshot({ path: join(evidence, 'checkout-unavailable-mobile.png'), fullPage: true });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, checks: ['forged-success', 'guest-receipt', 'paid-processing-failed-review', 'cart-quantity-preserved', 'refresh-idempotent', 'mobile-overflow', 'payment-unavailable'], screenshots: evidence }));
} finally {
  await browser?.close();
  server.kill();
  await new Promise(r => server.exitCode !== null ? r() : server.once('exit', r));
  assert.ok(resolve(storage).startsWith(resolve(tmpdir()) + sep) && basename(storage).startsWith('gri-checkout-preview-'));
  await rm(storage, { recursive: true, force: true });
}
