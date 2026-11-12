# Ürün fotoğrafları

Fotoğraflar `public/images/products/` altında WebP olarak saklanır. `config/product-images.json` ürün kimliğini, yerel dosya yolunu, kaynak sayfayı, orijinal görsel adresini, eşleştirme yöntemini ve kontrol tarihini içerir. İmzalı EasyTrade erişim parametreleri bu dosyaya yazılmaz.

`lib/product-images.ts`, EasyTrade verisi doğrulandıktan sonra fotoğrafı ürüne ekler. Bu ortak veri katalog, ürün detayı, hızlı bakış, arama ve sepete ekleme işlemlerinde kullanılır. Fotoğraf eşleştirmelerinin tamamı tarayıcıya gönderilmez.

Öncelik EasyTrade'dedir. EasyTrade'de fotoğraf varsa dış kaynak fotoğrafı kullanılmaz. Kaydedilmiş EasyTrade fotoğrafı yalnızca görsel kimliği ve kaynak dosya yolu hâlâ aynıysa kullanılır. Ürün kimliğine ek olarak ad, SKU ve barkod da eşleşmelidir; değişen ürün bilgisi eski fotoğrafın kullanılmasını engeller.

## Kaynakları güncelleme

Node.js 24, projenin npm bağımlılıkları, Python 3, `requests` ve `beautifulsoup4` gerekir. `.env.local` içinde mevcut `EASYTRADE_CATALOG_SLUG` kullanılır.

```sh
npm run images:sync
python scripts/discover-product-images.py --source bozkar
python scripts/discover-product-images.py --source eheim
python scripts/discover-product-images.py --source sera
python scripts/discover-product-images.py --source bursapet
python scripts/discover-product-images.py --source phankara
python scripts/discover-product-images.py --source yildirim
python scripts/discover-product-images.py --source atakan
npm run images:sync
npm run images:verify
```

İlk eşitleme güncel EasyTrade kataloğunu yerel araştırma önbelleğine alır. Keşif komutları kaynak kanıtlarını toplar; son eşitleme doğrulanmış eşleşmeleri indirir. `--cached-only` keşif komutlarını ağ isteği yapmadan çalıştırır. Araştırma yanıtları ve hata kayıtları git tarafından dışlanan `.impeccable/evidence/product-images/` dizinindedir.

Eşleştirme tam barkod veya marka + ürün koduyla yapılır. Başındaki sıfırlar dışında ürün kodu değiştirilmez. Atakan kaynağında ad benzerliği yalnızca incelenecek sayfaları seçer; fotoğraf atamak için yine barkod/ürün kodu doğrulaması gerekir. Farklı hacim, model veya renkteki bir ürüne benzer görsel otomatik atanmaz.

Elle doğrulanan ek kaynaklar `config/product-image-sources.json` içine ürün kimliği, marka, ürün kodu/barkod, kaynak sayfa ve gerçek fotoğraf adresiyle eklenebilir. Aynı doğrulama ve indirme kontrollerinden geçerler.

Bazı üretici sayfaları parça fotoğrafı yerine montaj çizimi sunar. İncelemede ayıklanan bu dosyalar `config/product-image-exclusions.json` içinde kayıtlıdır ve tekrar içeri alınmaz. Erişim engeli veya hız sınırı döndüren görsel sunucularına yeni indirme istekleri durdurulur; bu durum araştırma önbelleğindeki `blocked-image-hosts.json` dosyasında tutulur.

## Eksikler ve kontrol

`docs/product-images-missing.json` ve Excel'de açılabilen `docs/product-images-missing.csv`, doğrulanmış fotoğrafı henüz bulunmayan ürünleri listeler. Bu liste her eşitlemede güncellenir. Kullanıcının 11 Kasım 2026 tarihli talebiyle Sezen ürünleri ve Sünger Bob temalı dekorlar araştırmadan çıkarılmıştır; bunlar `config/product-image-skips.json` içinde ayrıca tutulur ve eksik listesine dahil edilmez. EasyTrade bu ürünlere daha sonra fotoğraf sağlarsa normal şekilde gösterilir.

`npm run images:verify` manifest referanslarını, dışlanan dosyaları ve tüm WebP dosyalarını tam çözerek denetler. `tests/product-images.test.ts` EasyTrade önceliğini ve değişen ürün/görsel kimliğinde eski fotoğrafın uygulanmamasını kontrol eder.

Fotoğraflar ve manifest uygulamayla birlikte dağıtılır. EasyTrade üzerinde ürün bilgileri veya fotoğraflar değiştirilmez. Yeni ürünlerin dış kaynak fotoğraflarını almak için keşif ve eşitleme tekrar çalıştırılır.
