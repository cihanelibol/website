/** Mobile image alignment regression, including WebKit's flex/aspect-ratio sizing.
 * Run: node scripts/verify-product-image-alignment.mjs [http://localhost:3000]
 */
import assert from 'node:assert/strict';
import { chromium, webkit } from '@playwright/test';

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce', hasTouch: true });
    await page.route('**/api/etkinlik', route => route.fulfill({ status: 204 }));
    await page.goto(`${base}/kategori/filtreler`, { waitUntil: 'networkidle' });
    const cards = page.locator('.store-catalog-products .store-product');
    await cards.first().waitFor({ state: 'visible' });
    assert.ok(await cards.locator('.store-product-image img').count(), 'Exercise product photographs');
    for (const width of [320, 375, 390, 430, 640, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const measurements = await cards.evaluateAll(elements => elements.map(card => {
        const box = element => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        };
        const image = card.querySelector('.store-product-image img');
        return {
          card: box(card),
          media: box(card.querySelector('.store-product-media')),
          link: box(card.querySelector('.store-product-image')),
          image: image ? box(image) : null,
          fit: image ? getComputedStyle(image).objectFit : null,
          position: image ? getComputedStyle(image).objectPosition : null,
        };
      }));
      const label = `${engine.name()} ${width}px`;
      for (const item of measurements) {
        for (const part of [item.media, item.link, item.image].filter(Boolean)) {
          assert.ok(part.width <= item.card.width, `${label}: image area must fit the card`);
          assert.ok(Math.abs(part.x + part.width / 2 - item.card.x - item.card.width / 2) <= 1, `${label}: image area must be horizontally centered`);
        }
        if (item.image) {
          assert.equal(item.fit, 'contain', `${label}: preserve the entire photograph`);
          assert.equal(item.position, '50% 50%', `${label}: center photograph within its box`);
          assert.ok(Math.abs(item.image.y + item.image.height / 2 - item.media.y - item.media.height / 2) <= 1, `${label}: image must be vertically centered`);
        }
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no horizontal page overflow`);
      console.log(`PASS ${label}: ${measurements.length} cards, centered images and no overflow`);
    }
  } finally {
    await browser.close();
  }
}
