import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = new URL(process.argv[2] || 'https://griakvaryum.com');
const groups = ['filtreler', 'yemler', 'isitma-aydinlatma'];
const candidates = new Map();
async function read(path) {
  const response = await fetch(new URL(path, base), { headers: { 'User-Agent': 'bingbot' }, signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.text();
}
for (const group of groups) {
  let next = `/kategori/${group}?stok=1`;
  const visited = new Set();
  while (next) {
    assert(!visited.has(next) && visited.size < 100, 'pagination loop or unexpected catalogue size');
    visited.add(next);
    const html = await read(next);
    for (const match of html.matchAll(/href="(\/urunler\/\d+)"/g)) {
      if (!candidates.has(match[1])) candidates.set(match[1], { path: match[1], groups: [] });
      const item = candidates.get(match[1]);
      if (!item.groups.includes(group)) item.groups.push(group);
    }
    next = html.match(/<a[^>]*href="([^"]+)"[^>]*>\s*Sonraki[^<]*<\/a>/)?.[1]?.replaceAll('&amp;', '&') ?? null;
    if (next) assert(new URL(next, base).pathname === `/kategori/${group}`, 'pagination must stay in category');
  }
}
const queue = [...candidates.values()];
const items = [];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const item = queue.shift();
    const html = await read(item.path);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
    const product = schemas.find(s => s['@type'] === 'Product');
    assert(product, `Product schema: ${item.path}`);
    const barcode = html.match(/<dt[^>]*>Barkod<\/dt>\s*<dd[^>]*>(.*?)<\/dd>/s)?.[1]?.replace(/<[^>]*>/g, '') ?? null;
    const description = product.description?.trim() ?? '';
    items.push({ ...item, id: Number(item.path.split('/').at(-1)), name: product.name, sku: product.sku ?? null, barcode, brand: product.brand?.name ?? null, price: product.offers?.price ?? null, availability: product.offers?.availability ?? null, description, descriptionCharacters: description.length, imageCount: product.image?.length ?? 0 });
  }
}));
items.sort((a, b) => a.descriptionCharacters - b.descriptionCharacters || a.id - b.id);
const report = { capturedAt: new Date().toISOString(), base: base.href, scope: 'Live stock-filtered filter, food, and heating/lighting categories. Product stock is rechecked in Product offers; missing offers are not treated as proof of stock. No sales, margin or search volume data.', total: items.length, missingDescriptions: items.filter(p => !p.description).length, missingImages: items.filter(p => !p.imageCount).length, items };
await mkdir('.gstack/seo-evidence', { recursive: true });
await writeFile('.gstack/seo-evidence/product-content-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ capturedAt: report.capturedAt, total: report.total, missingDescriptions: report.missingDescriptions, missingImages: report.missingImages, groups: Object.fromEntries(groups.map(group => [group, items.filter(item => item.groups.includes(group)).length])), report: '.gstack/seo-evidence/product-content-audit.json' }, null, 2));
