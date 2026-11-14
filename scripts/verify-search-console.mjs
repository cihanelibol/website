import assert from 'node:assert/strict';

// Read-only regression checks for the actual URLs reported on 2026-11-14.
const base = new URL(process.argv[2] || 'http://localhost:3000');
const origin = 'https://griakvaryum.com';
const results = [];
async function read(path, redirect = 'follow') {
  const response = await fetch(new URL(path, base), {
    redirect, headers: { 'User-Agent': 'Googlebot' }, signal: AbortSignal.timeout(60000),
  });
  return { response, html: await response.text() };
}
const canonical = html => html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1].replaceAll('&amp;', '&');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
const duplicates = [
  'kategori=45138&marka=sobo',
  ...[45088, 45123, 45174, 45162, 45080, 45168, 45115, 45166, 45079, 45173, 45124].map(id => `kategori=${id}&marka=sobo&stok=1`),
  'kategori=45118&marka=sera',
];
for (const query of duplicates) {
  const path = `/urunler?${query}`;
  const { response, html } = await read(path);
  assert.equal(response.status, 200, path);
  assert.equal(canonical(html), origin + path, path);
  assert.match(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/, path);
  results.push({ path, status: response.status, policy: 'noindex, follow; self canonical' });
}
const legacy = await read('/urunler?kategori=baliklar', 'manual');
assert.equal(legacy.response.status, 308, 'legacy fish category');
assert.equal(new URL(legacy.response.headers.get('location'), base).pathname, '/kategori/baliklar-canlilar');

for (const path of ['/', '/rehber', '/rehber/su-parametreleri', '/rehber/ilk-baliklar', '/rehber/karides-ve-salyangozlar', '/urunler/3751837', '/kategori/baliklar-canlilar', '/sozlesme/kargo-teslimat']) {
  const { response, html } = await read(path, 'manual');
  assert.equal(response.status, 200, path);
  assert.equal(new URL(canonical(html)).href, new URL(path, origin).href, path);
  assert.doesNotMatch(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/, path);
  results.push({ path, status: response.status, policy: 'indexable; self canonical' });
}

// Check a formerly description-less product and the zero-price catalogue entry.
const product = await read('/urunler/3755084');
const schema = schemas(product.html).find(s => s?.['@type'] === 'Product');
assert(schema?.description?.length > 0, 'visible product description');
assert.equal(schema.gtin, '6925394820482');
assert.equal(schema.offers.shippingDetails.shippingDestination.addressCountry, 'TR');
assert.equal(schema.offers.shippingDetails.deliveryTime.cutoffTime, '15:00:00+03:00');
assert.equal(schema.offers.shippingDetails.shippingRate.value, Number(schema.offers.price) > 2500 ? 0 : 200);
assert(product.html.includes('Kargo 200 TL'), 'visible shipping terms');
const merchant = schemas(product.html).find(s => s?.['@type'] === 'PetStore');
assert.equal(merchant?.hasMerchantReturnPolicy?.merchantReturnLink, origin + '/sozlesme/mesafeli-satis');
const unpriced = await read('/urunler/3751940');
assert.equal(unpriced.response.status, 200);
for (const entry of schemas(unpriced.html).filter(s => s?.['@type'] === 'Product')) {
  assert(entry.offers || entry.review || entry.aggregateRating, 'no invalid Product without required commercial/review fields');
}

if (base.origin === origin) {
  for (const url of ['http://griakvaryum.com/', 'https://www.griakvaryum.com/', ...[...duplicates, 'kategori=baliklar'].map(q => `https://www.griakvaryum.com/urunler?${q}`), 'https://www.griakvaryum.com/urunler/3751837']) {
    const { response } = await read(url, 'manual');
    assert.equal(response.status, 308, url);
    const target = new URL(response.headers.get('location'));
    assert.equal(target.origin, origin, url);
    assert.equal(target.search, new URL(url).search, url);
  }
}
console.log(JSON.stringify({ status: 'passed', base: base.href, duplicatesChecked: duplicates.length + 1, checks: results, structuredData: 'description, GTIN, shipping, eligibility', note: 'A font asset does not need page indexing. This checks current responses, not Google indexing decisions.' }, null, 2));
