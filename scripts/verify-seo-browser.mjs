import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://127.0.0.1:3011';
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  let tags = 0;
  // Verify integration without sending QA activity to the real Analytics property.
  await context.route('https://www.googletagmanager.com/**', route => { tags++; return route.fulfill({ contentType: 'application/javascript', body: '' }); });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + '/kategori/filtreler');
  await page.getByRole('button', { name: 'Yalnızca gerekli', exact: true }).click();
  assert.equal(tags, 0, 'No Google tag before consent');
  await page.reload();
  await page.getByRole('region', { name: 'Analitik çerez tercihleri' }).waitFor({ state: 'detached' });
  assert.equal(await page.getByRole('region', { name: 'Analitik çerez tercihleri' }).count(), 0);
  assert.equal(tags, 0, 'Declining persists');
  await page.getByRole('button', { name: 'Çerez tercihleri', exact: true }).click();
  await page.getByRole('button', { name: 'Analitiğe izin ver', exact: true }).click();
  await page.waitForFunction(() => Boolean(document.getElementById('gri-google-tag')));
  await page.waitForFunction(() => window.dataLayer?.some(item => item[0] === 'consent' && item[1] === 'update' && item[2]?.analytics_storage === 'granted'));
  assert.equal(tags, 1, 'Load the tag once after consent');
  await page.getByRole('combobox', { name: 'Sıralama' }).selectOption('price_asc');
  await page.waitForURL('**/kategori/filtreler?sirala=price_asc');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'Mobile horizontal overflow');
  await page.locator('h1').scrollIntoViewIfNeeded();
  await mkdir('.gstack/seo-evidence', { recursive: true });
  await page.screenshot({ path: '.gstack/seo-evidence/category-mobile.png' });
  await page.goto(base + '/magaza/eminonu');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'Store mobile overflow');
  await page.screenshot({ path: '.gstack/seo-evidence/store-mobile.png' });
  await page.getByRole('button', { name: 'Çerez tercihleri', exact: true }).click();
  await Promise.all([page.waitForEvent('load'), page.getByRole('button', { name: 'Yalnızca gerekli', exact: true }).click()]);
  assert.equal(await page.evaluate(() => localStorage.getItem('gri-analytics-consent-v1')), 'denied');
  assert.equal(await page.locator('#gri-google-tag').count(), 0, 'Revocation unloads tag');
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log(JSON.stringify({ status: 'passed', base, checks: 'mobile layout, sorting route, analytics opt-in, persistence, revocation, one script per document', screenshots: '.gstack/seo-evidence' }));
} finally { await browser.close(); }
