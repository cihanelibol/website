# Search Console düzeltme kaydı — 14 Kasım 2026

## Tespit

Hesaptaki Sayfayı dizine ekleme raporu okundu: son güncelleme 9 Kasım, 135 indekslenen / 22 indekslenmeyen adres. Kullanıcının ekran görüntüsüyle aynı sonuç.

- **14 standart sayfa seçilmemiş kopya:** 13 adet eski `www` kategori/marka birleşimi; son tarama 2 Kasım. Bugün `www → griakvaryum.com` HTTP 308; hedeflerde kendine canonical ve `noindex, follow` var. Düşük değerli filtre kombinasyonlarının indekslenmemesi bilinçli. Son adres `/urunler?kategori=baliklar` yanlışlıkla 404 veriyordu; `/kategori/baliklar-canlilar` adresine filtreleri koruyan 308 eklendi.
- **6 yönlendirmeli adres:** HTTP ana sayfa; HTTPS ana sayfa; `/rehber`, `/rehber/su-parametreleri`, `/rehber/ilk-baliklar`, `/rehber/karides-ve-salyangozlar`. HTTPS sayfaları bugün 200 ve doğru canonical veriyor; HTTP adresinin HTTPS'e yönlenmesi beklenen davranış. Rapordaki taramalar 1–11 Kasım arasında.
- **2 tarandı/indekslenmedi:** `https://www.griakvaryum.com/urunler/3751837` ve eski bir `/_next/static/media/*.woff2` dosyası. Ürünün güncel HTTPS ana alan adı 200 ve kendine canonical; yazı tipi dosyasının arama sonuçlarında sayfa olarak indekslenmesi gerekmiyor.

14 Kasım tarihli iki Search Console e-postası ayrıca incelendi. Altı bildirimin tamamı **kritik olmayan** iyileştirmeler: `description`, `shippingDetails`, `hasMerchantReturnPolicy`, genel tanımlayıcı, `review`, `aggregateRating`.

## Uygulama

- Katalogdan gelen açıklamalar ve 158 ürüne ait mevcut editoryal metinler korunur. Diğer ürünlerde gerçek ürün adı, kodu, kategori ve birimden oluşan açıklama hem sayfada hem Product şemasında kullanılır; teknik özellik tahmin edilmez.
- 8/12/13/14 haneli barkodlar GS1 kontrol basamağını geçerse `gtin` alanına eklenir. SKU, GTIN yerine kullanılmaz.
- Sıfır/geçersiz fiyatlı, desteklenmeyen para birimli veya varyant teklifi doğrulanmamış ve değerlendirmesi olmayan ürünlerde eksik zorunlu alanlarla Product işaretlemesi yayımlanmaz. Ürün sayfası erişilebilir kalır. Katalogdaki sıfır fiyatlı örnek: `/urunler/3751940`.
- Yalnızca sayfada gösterilen, onaylı ve ürüne ait gerçek yorumlar Review şemasına eklenir. Yorumsuz ürünlere puan/yorum üretilmez.
- Kullanıcının onayladığı kargo: **200 TL; KDV dahil ürünler toplamı 2.500 TL üzerindeyse ücretsiz.** Tam 2.500 TL için ücret 200 TL. **Saat 15.00'e kadar aynı gün kargoya teslim.** Ücret ve eşik tek modülden ürün şeması, görünür metin, sepet ve sunucu sipariş hesabına uygulanır.
- Türkiye içi kargo politikası `/sozlesme/kargo-teslimat` adresinde yayımlanır; footer, ürün sayfası ve sitemap'ten bağlıdır. Taşıma süresi teyit edilmediği için `transitTime` veya alıcıya varış günü vaat edilmez.
- EasyTrade'ın mevcut ürün toplamı sözleşmesi korunur; kargo ve genel toplam sağlayıcı sipariş notunda gönderilir. Yerel sipariş toplamı kargo dahildir, kargo ayrı saklanır. Sağlayıcı makbuzu ürünler toplamına karşı doğrulanır; ödeme alındı olarak işaretlenmez. Yeni siparişlerin e-posta, hesap ve yönetici görünümünde kargo ayrımı bulunur. Gerçek sipariş gönderilmedi.
- Mağaza düzeyindeki `hasMerchantReturnPolicy.merchantReturnLink` mevcut mesafeli satış sayfasına bağlanır (Google'ın Organization Option B yöntemi). Belirsiz iade ücretleri veya canlı ürünlere koşulsuz iade sözü eklenmez.
- Sözleşme sayfalarının canonical'ları ve hesap alanının `noindex` kuralı tamamlandı.

## Doğrulama

- Tam birim testi çalıştırması: 127 test geçti; son eklenen politika bağlantısı testi dahil odaklı tekrar: 52 test geçti.
- TypeScript ve değişen dosyaların ESLint kontrolü başarılı.
- İzole üretim derlemesi başarılı; yayın derlemesi ayrıca platformda izlenir.
- `scripts/verify-search-console.mjs`: rapordaki 14 kopya adres, ana alan adı/yönlendirmeler, canonical/noindex, eski kategori, ürün açıklaması/GTIN/kargo/iade bağlantısı ve sıfır fiyatlı şema kontrolü.
- `scripts/verify-shipping-browser.mjs`: 390 px mobil Chrome'da 2.499,99 / 2.500 / 2.500,01 TL sepetleri, kargo ve genel toplam; taşma ve JavaScript hatası yok. Sipariş göndermez.
- İlk testte açık Node 20 geliştirme sürecinde rehber sayfası worker hatası verdi. Ayrı, Node 24 ve geliştirme verisi kullanan 3014 portundaki sunucuda tüm adresler geçti; canlı mevcut rehber sayfası da 200 verdi.

Google raporundaki sayılar yeniden tarama ve işleme tamamlanmadan değişmez. Yönlendirmeler, bilinçli `noindex` sayfaları ve yazı tipi dosyaları sıfırlanması gereken hata sayıları değildir. Gerçek yorumu olmayan ürünlerin isteğe bağlı Review/AggregateRating uyarıları kalabilir. Hesapta doğrulamanın tamamlandığı veya bütün ürünlerin indekslendiği iddia edilmez.

## Kaynaklar

- [Hesabın indeksleme raporu](https://search.google.com/search-console/index?resource_id=sc-domain%3Agriakvaryum.com)
- [Google ürün snippet gereklilikleri](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google satıcı girişi / kargo gereklilikleri](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Google iade politikası: Organization Option B](https://developers.google.com/search/docs/appearance/structured-data/return-policy)
