"""Collect image evidence from public supplier catalogues. Never changes the storefront.

Requires Python packages beautifulsoup4 and requests. Responses are cached locally.
Run with --source bozkar|eheim|sera|retail. Then use sync-product-images.mjs.
"""
import argparse
import concurrent.futures
import gzip
import hashlib
import json
import re
import time
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.impeccable/evidence/product-images'
CACHE.mkdir(parents=True, exist_ok=True)
CATALOG = json.loads((CACHE / 'catalog.json').read_text(encoding='utf8'))
BLOCKED_FILE = CACHE / 'blocked-page-hosts.json'
BLOCKED_HOSTS = set(json.loads(BLOCKED_FILE.read_text()) if BLOCKED_FILE.exists() else [])

def fetch(url):
    file = CACHE / ('page-' + hashlib.sha256(url.encode()).hexdigest() + '.gz')
    if file.exists():
        return gzip.decompress(file.read_bytes()).decode('utf8')
    if '--cached-only' in sys.argv:
        return ''
    host = urlparse(url).hostname
    if host in BLOCKED_HOSTS:
        return ''
    for attempt in range(3):
        r = requests.get(url, timeout=25, headers={'User-Agent': 'GriAkvaryum-CatalogImageResearch/1.0'})
        if r.status_code != 429: break
        time.sleep(min(60, max(10, int(r.headers.get('Retry-After', '30')))))
    if r.status_code in (403, 429):
        BLOCKED_HOSTS.add(host)
    r.raise_for_status()
    text = r.content.decode('utf8')
    file.write_bytes(gzip.compress(text.encode()))
    return text

def soup(url):
    return BeautifulSoup(fetch(url), 'html.parser')

def xml_entries(url):
    text = fetch(url)
    return [{'page': re.search(r'<loc>(.*?)</loc>', block).group(1).replace('&amp;', '&'),
             'images': [x.replace('&amp;', '&') for x in re.findall(r'<image:loc>(.*?)</image:loc>', block)],
             'name': (re.findall(r'<image:caption>(.*?)</image:caption>', block) or [''])[0]}
            for block in re.findall(r'<url>([\s\S]*?)</url>', text)]

def parallel(items, fn, workers=4):
    result = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(fn, item): item for item in items}
        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            try:
                value = future.result()
                if value: result.extend(value if isinstance(value, list) else [value])
            except Exception as e:
                print('ERROR', str(futures[future])[:100], str(e)[:100], flush=True)
            if i % 25 == 0: print(f'{i}/{len(items)}, evidence: {len(result)}', flush=True)
    return result

def bozkar():
    entries = xml_entries('https://bozkarpet.com/products_1.xml')
    for e in entries:
        e['sku'] = e['page'].rsplit('-', 1)[-1]
        e['brand'] = e['name'].split(' ')[0]
    return entries

def phankara():
    def page(n):
        data = json.loads(fetch(f'https://phankara.com/wp-json/wc/store/v1/products?per_page=100&page={n}'))
        return [{'page': p['permalink'], 'name': p['name'], 'sku': p['sku'],
                 'brand': p['name'].split(' ')[0], 'images': [i['src'] for i in p['images'] if 'placeholder' not in i['src']]}
                for p in data if p['images']]
    return parallel(list(range(1, 17)), page, workers=2)

def akinsoft_products(origin, selected):
    entries = xml_entries(origin + '/products_1.xml')
    def product(e):
        s = soup(e['page'])
        for script in s.select('script[type="application/ld+json"]'):
            data = json.loads(script.get_text())
            for node in data.get('@graph', [data]):
                if node.get('@type') == 'Product':
                    return {'page': e['page'], 'name': node.get('name'), 'sku': node.get('sku'),
                            'barcode': node.get('gtin13'), 'brand': node.get('brand', {}).get('name'), 'images': node.get('image', [])}
    return parallel([e for e in entries if selected(e['page'])], product, workers=3)

def bursapet():
    return akinsoft_products('https://bayi.bursapet.com.tr', lambda url: '/akvaryum/' in url)

def yildirim():
    return akinsoft_products('https://yildirimpetshop.com.tr', lambda url: 'sobo' in url)

def atakan():
    entries = xml_entries('https://atakanpetshop.com/products.xml')
    missing = json.loads((ROOT / 'docs/product-images-missing.json').read_text(encoding='utf8'))
    def tokens(s):
        s = ''.join(c for c in unicodedata.normalize('NFD', s.lower().replace('ı', 'i')) if not unicodedata.combining(c))
        return set(re.findall(r'[a-z]+|\d+', s))
    selected = {}
    for p in missing:
        brand = next((b for b in ['sera', 'eheim', 'sobo', 'tropical', 'seachem', 'tropifit'] if b in p['name'].lower()), None)
        if not brand: continue
        pt = tokens(p['name'])
        ranked = []
        for e in entries:
            slug = e['page'].rsplit('/', 1)[-1]
            if not slug.startswith(brand + '-'): continue
            et = tokens(slug)
            overlap = len(pt & et) / max(1, len(pt | et))
            if overlap >= .3: ranked.append((overlap, e))
        for score, e in sorted(ranked, key=lambda row: -row[0])[:4]: selected[e['page']] = e
    def detail(e):
        s = soup(e['page'])
        result = []
        for script in s.select('script[type="application/ld+json"]'):
            try:
                data = json.loads(script.get_text())
                for node in data.get('@graph', [data]):
                    if node.get('@type') != 'Product': continue
                    mpn = node.get('mpn', '')
                    result.append({'page': e['page'], 'name': node.get('name'), 'sku': node.get('sku'),
                        'barcode': node.get('gtin13') or (mpn if re.fullmatch(r'\d{12,14}', mpn) else None),
                        'brand': node.get('brand', {}).get('name'), 'images': node.get('image', [])})
            except (ValueError, AttributeError): pass
        return result
    return parallel(list(selected.values()), detail, workers=2)

def eheim():
    previous_file = CACHE / 'eheim-evidence.json'
    previous = json.loads(previous_file.read_text(encoding='utf8')) if previous_file.exists() else []
    excluded_images = json.loads((ROOT / 'config/product-image-exclusions.json').read_text(encoding='utf8'))
    found = {pid for e in previous if e['images'][0] not in excluded_images for pid in e.get('productIds', [])}
    def product(p):
        code = p['sku'].split('-')[-1]
        query = p['barcode'] if previous else code
        search = soup('https://eheim.com/de_DE/suggest?search=' + query)
        links = list(dict.fromkeys(urljoin('https://eheim.com', a['href']) for a in search.select('a[href]')
                                   if '/search' not in a['href'] and a.find('img')))
        for url in links[:4]:
            s = soup(url)
            info = s.select_one('.product-detail-buy')
            if not info: continue
            codes = [x.get('content') or x.get_text(strip=True) for x in info.select('[itemprop="sku"]')]
            gtin = info.select_one('[itemprop="gtin13"]')
            if code not in codes and (not gtin or gtin.get('content') != p['barcode']): continue
            images = list(dict.fromkeys(x.get('src') for x in s.select('img.gallery-slider-image[src]')))
            if images and images[0] not in excluded_images:
                return {'page': url, 'name': info.select_one('h1').get_text(' ', strip=True),
                        'sku': code, 'barcode': gtin.get('content') if gtin else None,
                        'brand': 'EHEIM', 'images': images, 'productIds': [p['id']]}
    return previous + parallel([p for p in CATALOG if 'EHEIM' in p['name'].upper() and p['id'] not in found], product)

def sera():
    lists = ['https://www.sera.de/tr/tatli-su-akvaryumu/'] + [f'https://www.sera.de/tr/tatli-su-akvaryumu/Products/Sayfa-{n}/' for n in range(2, 43)]
    lists += ['https://www.sera.de/tr/tuzlu-su-akvaryum/', 'https://www.sera.de/tr/bahce-havuzu/', 'https://www.sera.de/tr/teraryumlar/']
    def links(url):
        return [urljoin(url, a['href']) for a in soup(url).select('a[href]') if '/ueruen/' in a['href']]
    pages = list(dict.fromkeys(parallel(lists, links)))
    (CACHE / 'sera-pages.json').write_text(json.dumps(pages), encoding='utf8')
    def product(url):
        s = soup(url)
        # Manufacturer filenames contain the variant's EAN (often zero padded).
        result = []
        for im in s.select('img[src], img[data-lazy]'):
            src = urljoin(url, im.get('data-lazy') or im['src'])
            if '/fileadmin/' not in src: continue
            for p in CATALOG:
                barcode = p.get('barcode') or ''
                if re.fullmatch(r'\d{13}', barcode) and barcode in src:
                    result.append({'page': url, 'name': im.get('alt') or p['name'], 'barcode': barcode,
                                   'brand': 'sera', 'images': [src], 'productIds': [p['id']]})
                elif p['name'].lower().startswith('sera') and re.fullmatch(r'\d{3}-\d{4,5}', p.get('sku') or ''):
                    code = p['sku'].split('-')[-1].lstrip('0')
                    if re.search(r'(?:csm_)?\d+-0*' + re.escape(code) + r'[_-]', src):
                        result.append({'page': url, 'name': p['name'], 'sku': p['sku'],
                                       'brand': 'sera', 'images': [src], 'productIds': [p['id']]})
        return result
    return parallel(pages, product)

def retail():
    maps = []
    for root in ['https://www.evcilal.com/sitemap.xml', 'https://www.akvaryumexpress.com/sitemap.xml']:
        maps.extend(u.replace('&amp;', '&') for u in re.findall(r'<loc>(.*?)</loc>', fetch(root))
                    if 'sitemap_image_' in u or '/products-' in u)
    entries = parallel(maps, xml_entries, workers=1)
    return entries

def retail_details():
    entries = json.loads((CACHE / 'retail-evidence.json').read_text(encoding='utf8'))
    selected = [e for e in entries if re.search(r'/(?:urun/)?(?:sera|sobo|boyu|aquawing|haqos|sezen|blubios|tropical|seachem|eheim)[-0-9]', e['page'])]
    def detail(e):
        s = soup(e['page'])
        results = []
        for script in s.select('script[type="application/ld+json"]'):
            try:
                data = json.loads(script.string or script.get_text())
                nodes = data.get('@graph', [data]) if isinstance(data, dict) else data
                for node in nodes:
                    if node.get('@type') != 'Product': continue
                    brand = node.get('brand', {})
                    images = node.get('image', [])
                    results.append({'page': e['page'], 'name': node.get('name'), 'sku': node.get('sku'),
                        'barcode': node.get('gtin13') or node.get('gtin'),
                        'brand': brand.get('name') if isinstance(brand, dict) else brand,
                        'images': images if isinstance(images, list) else [images]})
            except (ValueError, AttributeError): pass
        product = s.select_one('[itemtype="http://schema.org/Product"], [itemtype="https://schema.org/Product"]')
        if product:
            def value(prop):
                el = product.select_one(f'[itemprop="{prop}"]')
                return (el.get('content') or el.get_text(strip=True)) if el else None
            sku = value('sku')
            brand = product.select_one('[itemprop="brand"] [itemprop="name"]')
            results.append({'page': e['page'], 'name': value('name'),
                'sku': re.sub(r'^op_', '', sku or ''), 'barcode': value('gtin13'),
                'brand': brand.get('content') or brand.get_text(strip=True) if brand else None,
                'images': e['images']})
        return results
    return parallel(selected, detail, workers=2)

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', required=True, choices=['bozkar', 'eheim', 'sera', 'retail', 'retail-details', 'phankara', 'bursapet', 'yildirim', 'atakan'])
    ap.add_argument('--cached-only', action='store_true')
    args = ap.parse_args()
    result = globals()[args.source.replace('-', '_')]()
    (CACHE / f'{args.source}-evidence.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    BLOCKED_FILE.write_text(json.dumps(sorted(BLOCKED_HOSTS)), encoding='utf8')
    print(args.source, 'DONE', len(result), flush=True)
