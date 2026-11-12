/** Layout regression checks against a running storefront. No cart or order writes.
 * Run: node scripts/verify-product-cards.mjs [http://localhost:3000]
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/api/etkinlik', route => route.fulfill({ status: 204 }));
  await page.goto(`${base}/urunler?grup=filtreler`, { waitUntil: 'networkidle' });
  const cards = page.locator('.store-catalog-products .store-product');
  await cards.first().waitFor({ state: 'visible' });
  assert.ok(await cards.count() >= 3, 'The filter catalogue must contain at least three products');
  assert.ok(await cards.locator('img').count(), 'Exercise real product images');
  assert.ok(await cards.locator('.store-product-placeholder').count(), 'Exercise missing images');

  async function checkLayout(label) {
    const sizes = await cards.evaluateAll(elements => elements.map(card => {
      const box = element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      };
      return {
        card: box(card),
        media: box(card.querySelector('.store-product-media')),
        body: box(card.querySelector('.store-product-body')),
        title: box(card.querySelector('.store-product-body h2, .store-product-body h3')),
        buy: box(card.querySelector('.store-product-buy')),
        trigger: box(card.querySelector('.store-quick-trigger')),
      };
    }));
    for (const item of sizes) {
      assert.ok(Math.abs(Math.max(160, item.media.width * 9 / 16) - item.media.height) <= 1, `${label}: media must keep its compact ratio and minimum control space (${item.media.width} x ${item.media.height})`);
      if (item.card.width >= 280) {
        assert.ok(item.card.height <= item.card.width * 1.15, `${label}: desktop cards must stay close to square`);
      }
      assert.ok(item.title.x + item.title.width <= item.card.x + item.card.width, `${label}: title must fit the card`);
      assert.ok(item.trigger.y + item.trigger.height <= item.media.y + item.media.height, `${label}: quick view must fit the media`);
      for (const peer of sizes.filter(peer => Math.abs(peer.card.y - item.card.y) < 1)) {
        for (const part of ['body', 'title', 'trigger']) {
          assert.ok(Math.abs(item[part].y - peer[part].y) <= 1, `${label}: ${part} must align across a row`);
        }
        assert.ok(Math.abs(item.buy.y + item.buy.height - peer.buy.y - peer.buy.height) <= 1, `${label}: purchase areas must align at the bottom`);
        assert.ok(Math.abs(item.card.height - peer.card.height) <= 1, `${label}: cards must have equal heights`);
      }
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no page overflow`);
    return sizes;
  }

  for (const width of [320, 390, 640, 768, 1024, 1387, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await checkLayout(`${width}px`);
    console.log(`PASS ${width}px: mixed image states, aligned content and no overflow`);
  }

  for (const width of [320, 1387]) {
    await page.setViewportSize({ width, height: 900 });
    const before = await checkLayout(`${width}px before long text`);
    const original = await cards.first().evaluate(card => {
      const title = card.querySelector('.store-product-body h2, .store-product-body h3');
      const brand = card.querySelector('.store-product-category');
      const original = { title: title.textContent, brand: brand.textContent };
      title.textContent = 'VeryLongProductCode'.repeat(30);
      brand.textContent = 'VeryLongBrandName'.repeat(30);
      return original;
    });
    const after = await checkLayout(`${width}px long text`);
    assert.equal(after[0].card.height, before[0].card.height, 'Long names must not change card height');
    await cards.first().evaluate((card, original) => {
      card.querySelector('.store-product-body h2, .store-product-body h3').textContent = original.title;
      card.querySelector('.store-product-category').textContent = original.brand;
    }, original);
  }
  // A failed image must reserve exactly the same space as a loaded image.
  const before = await checkLayout('before failed image');
  await cards.locator('img').first().evaluate(image => { image.src = 'data:image/png;base64,invalid'; });
  const after = await checkLayout('failed image');
  assert.deepEqual(after, before, 'Image failure must not change layout');
  await cards.first().locator('.store-quick-trigger').click();
  const dialog = page.locator('.store-dialog[open]');
  await dialog.waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  console.log('PASS long names, failed images and quick-view interaction');
} finally {
  await browser.close();
}
