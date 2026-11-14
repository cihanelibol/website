import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL });
try {
  for (const [subtotal, fee, total] of [[2499.99, '₺200', '₺2.699,99'], [2500, '₺200', '₺2.700'], [2500.01, 'Ücretsiz', '₺2.500,01']]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.abort());
    await context.addInitScript(price => {
      localStorage.setItem('gri-analytics-consent-v1', 'denied');
      localStorage.setItem('ga_cart', JSON.stringify([{ id: 1, name: 'Kargo sınır testi', price, image: null, unit: 'Adet', maxStock: 10, qty: 1 }]));
    }, subtotal);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/sepet', { timeout: 60000 });
    const main = page.getByRole('main');
    await main.getByText('Kargo sınır testi', { exact: true }).first().waitFor();
    assert((await main.getByText('Kargo', { exact: true }).locator('..').innerText()).includes(fee));
    assert((await main.getByText('Toplam', { exact: true }).locator('..').innerText()).includes(total));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'mobile overflow');
    assert.deepEqual(errors, [], 'browser errors');
    if (subtotal === 2500) {
      await mkdir('.gstack/seo-evidence', { recursive: true });
      await page.screenshot({ path: '.gstack/seo-evidence/shipping-mobile.png', fullPage: true });
    }
    await context.close();
  }
  console.log(JSON.stringify({ status: 'passed', base, checked: 'mobile cart shipping below, at and above threshold; no orders submitted' }));
} finally { await browser.close(); }
