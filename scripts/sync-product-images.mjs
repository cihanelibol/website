/** Download verified product photographs and produce the storefront manifest.
 * node scripts/sync-product-images.mjs [--refresh-catalog]
 * Discovery evidence stays local; the manifest and WebP files ship with the app.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import nextEnv from '@next/env';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const evidenceDir = path.join(root, '.impeccable/evidence/product-images');
const manifestPath = path.join(root, 'config/product-images.json');
const imageDir = path.join(root, 'public/images/products');
await fs.mkdir(evidenceDir, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });
const read = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return fallback; throw e; }
};

async function catalog() {
  nextEnv.loadEnvConfig(root);
  const slug = process.env.EASYTRADE_CATALOG_SLUG;
  if (!slug || !/^[\w-]+$/.test(slug)) throw new Error('Missing EASYTRADE_CATALOG_SLUG');
  const page = async n => {
    const r = await fetch(`https://pro.easytradetr.com/catalog/${slug}/products?per_page=48&page=${n}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      signal: AbortSignal.timeout(20_000), redirect: 'error',
    });
    if (!r.ok) throw new Error(`EasyTrade HTTP ${r.status}`);
    return r.json();
  };
  const first = await page(1);
  if (!Number.isInteger(first.pagination?.last_page) || first.pagination.last_page > 200) throw new Error('Invalid pagination');
  const all = [...first.data];
  for (let n = 2; n <= first.pagination.last_page; n += 4) {
    const batch = await Promise.all(Array.from({ length: Math.min(4, first.pagination.last_page - n + 1) }, (_, i) => page(n + i)));
    all.push(...batch.flatMap(p => p.data));
  }
  const products = [...new Map(all.map(p => [p.id, p])).values()];
  await fs.writeFile(path.join(evidenceDir, 'catalog.json'), JSON.stringify(products, null, 2));
  return products;
}

const products = process.argv.includes('--refresh-catalog') ? await catalog() :
  await read(path.join(evidenceDir, 'catalog.json'), null) ?? await catalog();
const manifest = await read(manifestPath, {});
const exclusions = await read(path.join(root, 'config/product-image-exclusions.json'), {});
const skips = await read(path.join(root, 'config/product-image-skips.json'), {});
const normalized = s => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').replace(/[^a-z0-9]/g, '');
const evidence = (await Promise.all(['bozkar', 'eheim', 'sera', 'bursapet', 'phankara', 'yildirim', 'atakan', 'retail-details', 'manual'].map(source =>
  read(path.join(evidenceDir, `${source}-evidence.json`), [])))).flat();
evidence.unshift(...await read(path.join(root, 'config/product-image-sources.json'), []));
const downloaded = new Map();
const failures = [];
const blockedPath = path.join(evidenceDir, 'blocked-image-hosts.json');
const blockedHosts = new Set(await read(blockedPath, []));

async function download(url) {
  if (!downloaded.has(url)) downloaded.set(url, (async () => {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('Unsafe image URL');
    const name = createHash('sha256').update(url).digest('hex').slice(0, 24) + '.webp';
    const file = path.join(imageDir, name);
    try { await fs.access(file); return `/images/products/${name}`; } catch { /* first download */ }
    if (blockedHosts.has(parsed.hostname)) throw new Error('Source blocked further downloads');
    const r = await fetch(url, { signal: AbortSignal.timeout(25_000) });
    if (r.status === 403 || r.status === 429) blockedHosts.add(parsed.hostname);
    if (!r.ok || !r.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image HTTP ${r.status}`);
    if (Number(r.headers.get('content-length')) > 15_000_000) throw new Error('Image too large');
    const chunks = []; let bytes = 0;
    for await (const chunk of r.body) {
      bytes += chunk.length;
      if (bytes > 15_000_000) throw new Error('Image too large');
      chunks.push(chunk);
    }
    const input = Buffer.concat(chunks);
    const metadata = await sharp(input, { limitInputPixels: 100_000_000 }).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 80 || metadata.height < 80) throw new Error('Image too small');
    const output = await sharp(input, { limitInputPixels: 100_000_000 }).rotate()
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
    await fs.writeFile(file, output);
    return `/images/products/${name}`;
  })());
  return downloaded.get(url);
}

function matches(p, e) {
  if (e.productIds && !e.productIds.includes(p.id)) return false;
  if (e.barcode && /^\d{12,14}$/.test(e.barcode) && e.barcode === p.barcode) return true;
  if (!e.sku || !e.brand) return false;
  const brand = normalized(e.brand) === 'tropical' && /tropifit/i.test(e.name ?? '') ? 'tropifit' : normalized(e.brand);
  if (!normalized(p.name).includes(brand) || brand.length < 3) return false;
  const code = brand === 'eheim' || brand === 'sera' ? p.sku?.split('-').at(-1) : p.sku;
  const unpad = value => /^\d+$/.test(value ?? '') ? value.replace(/^0+(?=\d)/, '') : value;
  return unpad(e.sku) === unpad(code) || e.sku === p.sku;
}

let cursor = 0, completed = 0;
async function worker() {
  while (cursor < products.length) {
    const p = products[cursor++];
    if (skips[p.id]?.name === p.name && !p.images.length) continue;
    const existing = manifest[p.id];
    if (existing && existing.name === p.name && existing.sku === p.sku && existing.barcode === p.barcode &&
        (!p.images.length || existing.provider === 'easytrade')) continue;
    const primary = p.images.find(i => i.is_primary) ?? p.images[0];
    const candidates = primary ? [{ page: 'https://pro.easytradetr.com', images: [primary.url], provider: 'easytrade', imageId: primary.id }]
      : evidence.filter(e => matches(p, e));
    for (const e of candidates) {
      try {
        if (!e.images?.length || exclusions[e.images[0]]) continue;
        const src = await download(e.images[0]);
        manifest[p.id] = { name: p.name, sku: p.sku, barcode: p.barcode, src,
          provider: e.provider ?? new URL(e.page).hostname, sourcePage: e.page,
          // Never commit an expiring signed URL from EasyTrade.
          sourceImage: e.provider === 'easytrade' ? new URL(e.images[0]).origin + new URL(e.images[0]).pathname : e.images[0],
          ...(e.imageId ? { imageId: e.imageId } : {}),
          matchedBy: e.provider === 'easytrade' ? 'easytrade-image-id' : e.barcode && e.barcode === p.barcode ? 'barcode' : 'brand-and-sku',
          checkedAt: new Date().toISOString().slice(0, 10) };
        completed++;
        if (completed % 50 === 0) console.log(`Downloaded ${completed} product photographs`);
        break;
      } catch (error) { failures.push({ id: p.id, name: p.name, sourcePage: e.page, error: error.message }); }
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => Number(a) - Number(b)));
await fs.writeFile(manifestPath, JSON.stringify(ordered, null, 2) + '\n');
const skipped = products.filter(p => skips[p.id]?.name === p.name && !manifest[p.id] && !p.images.length);
const missing = products.filter(p => !manifest[p.id] && !p.images.length && !skipped.includes(p)).map(p => ({ id: p.id, name: p.name, sku: p.sku, barcode: p.barcode }));
await fs.writeFile(path.join(evidenceDir, 'download-failures.json'), JSON.stringify(failures, null, 2));
await fs.writeFile(blockedPath, JSON.stringify([...blockedHosts], null, 2));
await fs.writeFile(path.join(root, 'docs/product-images-missing.json'), JSON.stringify(missing, null, 2) + '\n');
const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
await fs.writeFile(path.join(root, 'docs/product-images-missing.csv'), '\uFEFF' +
  [['id', 'name', 'sku', 'barcode'], ...missing.map(p => [p.id, p.name, p.sku, p.barcode])]
    .map(row => row.map(csv).join(';')).join('\r\n') + '\r\n');
console.log(JSON.stringify({ total: products.length, covered: products.length - missing.length - skipped.length, skipped: skipped.length, missing: missing.length,
  downloaded: completed, failedAttempts: failures.length, providers: Object.values(manifest).reduce((a, e) => ({ ...a, [e.provider]: (a[e.provider] ?? 0) + 1 }), {}) }, null, 2));
