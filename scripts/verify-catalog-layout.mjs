/** Read-only browser checks for shared catalogue layouts and the static hero.
 * Run against a local server: node scripts/verify-catalog-layout.mjs [baseURL]
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
  await page.route('**/api/etkinlik', route => route.fulfill({ status: 204 }));
  await page.goto(`${base}/urunler`, { waitUntil: 'networkidle' });
  await page.locator('.store-catalog-toolbar').waitFor();
  const groups = await page.locator('.store-filter-sidebar a[href*="grup="]').evaluateAll(links => links.map(link => link.getAttribute('href')));
  const category = await page.locator('.store-filter-sidebar a[href*="kategori="]').first().getAttribute('href');
  const routes = [...new Set(['/urunler', ...groups, category, '/urunler?marka=sera', '/urunler?q=sera', '/urunler?q=no-product-matches-this', '/urunler?grup=yemler&sirala=price_desc'])];
  for (const route of routes) {
    await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
    await page.locator('.store-catalog-toolbar').waitFor();
    for (const width of [320, 390, 768, 1024, 1366]) {
      await page.setViewportSize({ width, height: 900 });
      const issues = await page.evaluate(() => {
        const issues = [];
        const toolbar = document.querySelector('.store-catalog-toolbar');
        const title = toolbar.querySelector('h1');
        if (!title || !title.textContent.trim()) issues.push('missing page heading');
        if (document.querySelectorAll('main h1').length !== 1) issues.push('duplicate heading');
        if (document.documentElement.scrollWidth > innerWidth) issues.push('page overflow');
        const select = toolbar.querySelector('select');
        const font = getComputedStyle(select);
        if (innerWidth > 800 && font.fontSize !== '13px') issues.push('oversized desktop sorting');
        const measure = document.createElement('canvas').getContext('2d');
        measure.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
        for (const option of select.options) {
          if (measure.measureText(option.text).width > select.clientWidth - 42) issues.push('clipped sorting option');
        }
        const card = document.querySelector('.store-catalog-products .store-product');
        if (card && innerWidth >= 1024) {
          const header = document.querySelector('.store-header');
          if (header && card.getBoundingClientRect().top - header.getBoundingClientRect().bottom > 160) issues.push('excessive heading space');
        }
        for (const name of document.querySelectorAll('.store-category-name')) {
          if (name.getBoundingClientRect().width && name.scrollWidth > name.clientWidth + 1) issues.push('clipped category');
        }
        return issues;
      });
      assert.deepEqual(issues, [], `${route} at ${width}px`);
    }
    console.log(`PASS ${route}: 5 viewport sizes`);
  }

  await page.goto(`${base}/urunler?grup=yemler`, { waitUntil: 'networkidle' });
  await page.locator('.store-catalog-sort').selectOption('price_asc');
  await page.waitForURL('**/urunler?grup=yemler&sirala=price_asc');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.store-catalog-mobile-filters > summary').click();
  await page.locator('#catalog-search-mobile').fill('sera');
  await page.locator('.store-catalog-mobile-filters button[type="submit"]').click();
  await page.waitForURL(url => url.searchParams.get('q') === 'sera');
  assert.equal(new URL(page.url()).searchParams.get('grup'), 'yemler');
  assert.equal(new URL(page.url()).searchParams.get('sirala'), 'price_asc');
  console.log('PASS sorting and mobile search preserve active filters');

  await page.goto(base, { waitUntil: 'networkidle' });
  const hero = page.locator('.store-hero-column section');
  await hero.waitFor();
  const photos = hero.locator('img[src*="store-hero"]');
  assert.equal(await photos.count(), 1);
  assert.ok((await photos.getAttribute('src')).includes('magaza-3.webp'));
  assert.equal(await hero.locator('button').count(), 0, 'Static hero needs no slideshow controls');
  for (const width of [320, 390, 640, 1024, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Home overflow at ${width}px`);
  }
  console.log('PASS hero displays only photo 3, without slideshow controls');
} finally {
  await browser.close();
}
