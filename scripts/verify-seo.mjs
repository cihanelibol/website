import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:3011';
const origin = 'https://griakvaryum.com';
async function read(path, redirect = 'follow') {
  const response = await fetch(new URL(path, base), { redirect, headers: { 'User-Agent': 'bingbot' }, signal: AbortSignal.timeout(60000) });
  return { response, html: await response.text() };
}
function canonical(html) { return html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1].replaceAll('&amp;', '&'); }
function schemas(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
}
const checks = [
  ['/', '/'], ['/kategori/filtreler', '/kategori/filtreler'],
  ['/kategori/filtreler?sayfa=2', '/kategori/filtreler?sayfa=2'],
  ['/marka/eheim', '/marka/eheim'], ['/magaza/eminonu', '/magaza/eminonu'],
  ['/iletisim', '/iletisim'], ['/rehber/filtre-rehberi', '/rehber/filtre-rehberi'],
];
for (const [path, preferred] of checks) {
  const { response, html } = await read(path);
  assert.equal(response.status, 200, path);
  assert.equal(new URL(canonical(html)).href, new URL(origin + preferred).href, path);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `one h1: ${path}`);
  assert(!html.includes('wa.me/900000000000'), `placeholder WhatsApp: ${path}`);
  if (path === '/') assert(schemas(html).some(s => s['@type'] === 'PetStore'));
}
for (const path of ['/giris', '/kayit', '/sepet', '/urunler?q=filter', '/kategori/filtreler?sirala=price_asc']) {
  const { html } = await read(path);
  assert(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), `noindex: ${path}`);
}
for (const [path, target] of [['/urunler?grup=filtreler&sayfa=2', '/kategori/filtreler?sayfa=2'], ['/urunler?marka=eheim', '/marka/eheim']]) {
  const { response } = await read(path, 'manual');
  assert.equal(response.status, 308, `permanent redirect: ${path}`);
  assert.equal(new URL(response.headers.get('location'), base).pathname + new URL(response.headers.get('location'), base).search, target);
}
for (const path of ['/kategori/missing', '/marka/missing', '/urunler?sayfa=NaN', '/kategori/filtreler?sayfa=999999', '/urunler/0']) {
  const { response } = await read(path);
  assert.equal(response.status, 404, `invalid URL: ${path}`);
}
const { response, html: xml } = await read('/sitemap.xml');
assert.equal(response.status, 200);
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const productUrls = urls.filter(u => /\/urunler\/\d+$/.test(u));
assert(productUrls.length > 0, 'sitemap must contain products');
assert.equal(urls.length, new Set(urls).size, 'duplicate sitemap URLs');
assert(urls.includes(origin + '/magaza/eminonu'));
const productPath = new URL(productUrls[0]).pathname;
const product = await read(productPath);
assert.equal(product.response.status, 200);
assert.equal(canonical(product.html), origin + productPath);
assert(schemas(product.html).some(s => s['@type'] === 'Product'));
console.log(JSON.stringify({ status: 'passed', base, sitemapUrls: urls.length, products: productUrls.length, sampleProduct: productPath, checked: 'metadata, schema, headings, noindex, redirects, invalid URLs, sitemap' }, null, 2));
