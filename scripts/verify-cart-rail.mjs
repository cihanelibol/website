/** Run against a local storefront: node scripts/verify-cart-rail.mjs [baseURL]
 * Uses an isolated browser cart. Never submits an order or changes server data.
 */
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const fixtures = [
  { id: 900001, name: 'Deneme filtre', price: 471.99, image: null, unit: 'Adet', maxStock: 2, qty: 1 },
  { id: 900002, name: 'Deneme yem', price: 354.6, image: null, unit: 'Adet', maxStock: 5, qty: 2 },
];
const errors = [];

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  await context.route('**/api/etkinlik', route => route.fulfill({ status: 204 }));
  await context.addInitScript(items => {
    if (!sessionStorage.getItem('rail-test-seeded')) {
      localStorage.setItem('ga_cart', JSON.stringify(items));
      sessionStorage.setItem('rail-test-seeded', '1');
    }
  }, fixtures);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const rail = page.getByRole('complementary', { name: 'Hızlı sepet' });
  const expanded = page.locator('[data-cart-rail-open="true"]');
  await expect(rail.getByRole('button', { name: 'Sepeti aç, 3 ürün' })).toBeVisible();
  await expect(expanded).toHaveCount(0);
  await expect(expanded).toBeVisible({ timeout: 5000 });
  assert.equal(await expanded.evaluate(el => el.getBoundingClientRect().width), 144);
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  const support = page.getByRole('button', { name: 'Uzmana sor', exact: true });
  const supportBox = await support.boundingBox();
  const railBox = await expanded.boundingBox();
  assert.ok(supportBox.x + supportBox.width < railBox.x, 'Support launcher must clear the cart');

  await rail.getByRole('button', { name: 'Deneme filtre adedini artır' }).click();
  await expect(rail.getByRole('button', { name: 'Deneme filtre adedini artır' })).toBeDisabled();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ga_cart')));
  assert.equal(stored[0].qty, 2);
  await expect(rail.getByText('₺1.653,18', { exact: true })).toBeVisible();
  await rail.getByRole('button', { name: 'Deneme filtre adedini azalt' }).click();
  await expect(rail.getByRole('button', { name: 'Deneme filtre adedini azalt' })).toBeDisabled();
  await rail.getByRole('button', { name: 'Deneme yem ürününü sepetten kaldır' }).click();
  await expect(rail.getByRole('article')).toHaveCount(1);
  await expect(page.locator('.store-cart-button')).toHaveAccessibleName('Sepetim, 1 ürün');

  await rail.getByRole('button', { name: 'Sepeti küçült' }).click();
  await expect(rail.getByRole('button', { name: 'Sepeti aç, 1 ürün' })).toBeFocused();
  await page.waitForTimeout(2700);
  await expect(expanded).toHaveCount(0);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(rail.getByRole('button', { name: 'Sepeti aç, 1 ürün' })).toBeVisible();
  await page.waitForTimeout(2700);
  await expect(expanded).toHaveCount(0);
  await page.locator('.store-cart-button').click();
  await expect(expanded).toBeVisible();

  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: no horizontal overflow`);
    await rail.getByRole('button', { name: 'Sepeti küçült' }).click();
    const layout = () => page.locator('.store-header, .store-intro').evaluateAll(elements => elements.map(element => {
      const { x, width } = element.getBoundingClientRect();
      return { x, width };
    }));
    const closedLayout = await layout();
    await rail.getByRole('button', { name: 'Sepeti aç, 1 ürün' }).click();
    await expect(expanded).toBeVisible();
    assert.deepEqual(await layout(), closedLayout, `${width}px: opening the cart must not shift or resize the page`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(expanded).toHaveCount(0);
  await expect(page.locator('.store-cart[open]')).toBeVisible();
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).paddingRight), '0px');
  await page.keyboard.press('Escape');
  await expect(page.locator('.store-cart[open]')).toHaveCount(0);
  await page.waitForTimeout(2700);
  await expect(page.locator('.store-cart[open]')).toHaveCount(0);
  await page.locator('.store-cart-button').click();
  await expect(page.locator('.store-cart[open]')).toBeVisible();
  await page.getByRole('button', { name: 'Sepeti kapat', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.locator('.store-cart-button').click();
  await rail.getByRole('button', { name: 'Deneme filtre ürününü sepetten kaldır' }).click();
  await expect(rail.getByText('Sepetiniz henüz boş.')).toBeVisible();
  await expect(rail.getByRole('link', { name: /Siparişe geç/ })).toHaveCount(0);
  await rail.getByRole('button', { name: 'Sepeti küçült' }).click();
  await expect(rail).toHaveCount(0);
  // A new product reopens a minimized rail using the existing add-to-cart flow.
  await page.locator('.store-add-icon:enabled').first().click();
  await expect(expanded).toBeVisible();
  await expect(rail.getByRole('article')).toHaveCount(1);
  await rail.getByRole('link', { name: 'Sepete git', exact: true }).click();
  await expect(page).toHaveURL(`${base}/sepet`);
  await page.waitForTimeout(2700);
  await expect(expanded).toHaveCount(0);
  await context.close();
  assert.deepEqual(errors, [], 'No browser runtime errors');
  console.log('PASS delayed opening, totals, stock limits, removal, persistent minimize, focus, responsive layout, support spacing, mobile dialog, empty cart, product addition, cart navigation');
} finally {
  await browser.close();
}
