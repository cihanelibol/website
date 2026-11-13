import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = new URL(process.argv[2] || 'http://127.0.0.1:3012');
const origin = 'https://griakvaryum.com';
async function read(path) {
  const response = await fetch(new URL(path, base), { headers: { 'User-Agent': 'bingbot' }, signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const xml = await read('/sitemap.xml');
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const guides = paths.filter(path => path.startsWith('/rehber/'));
const categories = new Set(paths.filter(path => path.startsWith('/kategori/')));
assert(guides.length > 0, 'guide sitemap entries');
const destinations = new Set();
let linkedGuides = 0;
let sourcedGuides = 0;
const queue = [...guides];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const path = queue.shift();
    const html = await read(path);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
    assert(html.includes(`rel="canonical" href="${origin}${path}"`), `canonical: ${path}`);
    assert(html.includes('Yayınlayan: Gri Akvaryum'), `visible publisher: ${path}`);
    const section = html.match(/<section aria-labelledby="rehber-urunler"[\s\S]*?<\/section>/)?.[0];
    if (section) {
      linkedGuides++;
      const links = [...section.matchAll(/href="(\/kategori\/[^"?]+)"/g)].map(m => m[1]);
      assert(links.length > 0, `category links: ${path}`);
      for (const link of links) { assert(categories.has(link), `not in sitemap: ${link}`); destinations.add(link); }
    }
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
    const article = schemas.find(s => s['@type'] === 'Article');
    assert(article, `Article schema: ${path}`);
    if (article.citation?.length) {
      sourcedGuides++;
      const sourceSection = html.match(/<section aria-labelledby="makale-kaynaklar"[\s\S]*?<\/section>/)?.[0];
      assert(sourceSection, `visible sources: ${path}`);
      for (const citation of article.citation) assert(sourceSection.includes(`href="${citation.url}"`), `citation must be visible: ${citation.url}`);
    }
  }
}));
assert(linkedGuides > 0 && sourcedGuides >= 2, 'editorial content package present');
for (const path of destinations) {
  const html = await read(path);
  assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `indexable destination: ${path}`);
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.route('https://www.googletagmanager.com/**', route => route.abort());
  await context.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.abort());
  const page = await context.newPage();
  await page.goto(new URL('/rehber/filtre-rehberi', base).href);
  await page.getByRole('button', { name: 'Yalnızca gerekli', exact: true }).click();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile guide overflow');
  await page.getByRole('region', { name: 'Bu rehberle ilgili ürün kategorileri' }).getByRole('link', { name: 'Akvaryum Filtreleri ve Filtre Malzemeleri', exact: false }).click();
  await page.waitForURL('**/kategori/filtreler');
  await page.getByRole('link', { name: 'Akvaryum Filtresi Türleri, Seçimi ve Bakımı', exact: false }).first().waitFor();
  const productLink = page.locator('main a[href^="/urunler/"]').first();
  const productPath = await productLink.getAttribute('href');
  assert(productPath);
  await productLink.click();
  await page.waitForURL(`**${productPath}`);
  await page.getByRole('navigation', { name: 'İlgili ürün kategorileri' }).getByRole('link', { name: 'Akvaryum Filtreleri ve Filtre Malzemeleri' }).waitFor();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'mobile product overflow');
  await mkdir('.gstack/seo-evidence', { recursive: true });
  const report = { status: 'passed', base: base.href, guides: guides.length, linkedGuides, sourcedGuides, categoryDestinations: destinations.size, productPath, checks: 'all guide canonicals, publisher, visible citations, indexable category destinations, mobile guide-category-product navigation' };
  await writeFile('.gstack/seo-evidence/content-verification.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
