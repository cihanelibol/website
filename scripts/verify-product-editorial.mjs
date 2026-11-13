import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = new URL(process.argv[2] || 'https://griakvaryum.com');
const manifest = JSON.parse(await readFile(new URL('../config/product-editorial.json', import.meta.url), 'utf8'));
const queue = Object.entries(manifest);
const results = [];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#x27;');
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const [id, entry] = queue.shift();
    const path = `/urunler/${id}`;
    const response = await fetch(new URL(path, base), { headers: { 'User-Agent': 'bingbot' }, signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
    const product = schemas.find(s => s['@type'] === 'Product');
    assert(product, `schema missing: ${id}`);
    assert.equal(product.name, entry.name, `identity changed: ${id}`);
    assert.equal(product.sku, entry.sku, `SKU changed: ${id}`);
    assert.equal(product.description, [entry.summary, ...entry.details].join('\n\n'), `description: ${id}`);
    const visible = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
    for (const text of [entry.summary, ...entry.details]) assert(visible.includes(escape(text)), `visible content: ${id}`);
    assert(visible.includes(`href="${escape(entry.source.url)}"`), `source: ${id}`);
    assert(html.includes(`name="description" content="${escape(entry.summary)}"`), `metadata: ${id}`);
    assert(html.includes(`rel="canonical" href="https://griakvaryum.com${path}"`), `canonical: ${id}`);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `H1: ${id}`);
    assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `indexable: ${id}`);
    results.push({ id, availability: product.offers?.availability ?? null });
  }
}));
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.route(/https:\/\/[^/]*(googletagmanager|google-analytics)\.com\//, route => route.abort());
  const page = await context.newPage();
  for (const id of ['3751779', '3751304']) {
    await page.goto(new URL(`/urunler/${id}`, base).href);
    const entry = manifest[id];
    await page.getByText(entry.summary, { exact: false }).first().waitFor();
    assert(await page.getByRole('link', { name: entry.source.title, exact: true }).isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `mobile overflow: ${id}`);
  }
} finally { await browser.close(); }
await mkdir('.gstack/seo-evidence', { recursive: true });
const report = { checkedAt: new Date().toISOString(), base: base.href, status: 'passed', products: results.length, checks: 'HTTP, identity, visible description, matching Product JSON-LD, source link, metadata, canonical, H1, indexability; two mobile product pages', results };
await writeFile('.gstack/seo-evidence/product-editorial-verification.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
