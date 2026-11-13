# SEO ikinci paket — 13 Kasım 2026

## Uygulanan çalışma

- 26 rehbere, konuyla ilişkili mevcut kategori sayfalarına doğrudan HTML bağlantıları eklendi. Hastalık ve belirti rehberlerine otomatik alışveriş önerisi eklenmedi.
- Kategori sayfalarındaki genel rehber bağlantı metni ilgili makalenin açıklayıcı başlığıyla değiştirildi.
- Ürün detayında marka adı marka sayfasına bağlandı; eşleşen ana kategoriler görünür bağlantılarla sunuldu.
- 29 rehberin yayıncı bilgisi görünür hale getirildi; Article verisine yayıncı adresi/logo, kaynaklı makalelere görünür kaynaklarla aynı citation kayıtları eklendi. Yeni bir uzman kişi veya uzman incelemesi iddia edilmedi.
- Rehber sosyal paylaşım metadata'sı ortak site görseliyle tamamlandı. Yalnızca içerikleri değiştirilen filtre ve ısıtıcı rehberlerinin güncelleme tarihleri değiştirildi; sitemap bu tarihleri mevcut modelden alır.
- Filtre ve ısıtıcı rehberleri üretici belgeleriyle yeniden yazıldı. Evrensel debi kaybı yüzdesi, her zaman daha büyük filtre seçme, bütün ısıtıcıların aynı yönde montajı ve çift ısıtıcının aşırı ısınmayı engelleyeceği gibi kesin iddialar çıkarıldı.
- Üretici kaynakları ilgili makalede görünür. Model bazında belirtilen süreler başka modellere genellenmedi.

Bağlantı çalışmasının dayanağı: [Google bağlantı rehberi](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) ve [e-ticaret site yapısı](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure). Üretici kaynakları `lib/rehber/ekipman-secimi.ts` içinde makale bazında kayıtlıdır.

## Doğrulama

- Node.js 24.22.1 ile izole production build ve TypeScript kontrolü başarılı.
- 87 birim testi ve 17 HTTP/tarayıcı testi başarılı. Yeni tarayıcı kontrolleri kaynakların görünürlük/schema uyumunu, mobil taşmayı ve kategori bağlantılarını doğrular.
- Değişen kaynak dosyalarında ESLint başarılı.
- `scripts/verify-seo-content.mjs`: sitemap'teki tüm rehberleri, kaynak/schema uyumunu, kategori hedeflerini ve mobil rehber → kategori → ürün geçişini kontrol eder. Gerçek katalogla yayın sonrası çalıştırılmalıdır.
- Test sırasında üretim veritabanına veya sipariş API'sine yazılmadı. Yerel arayüz/video çalışmaları ayrı bırakıldı.

## İlk performans örneği

13 Kasım 2026, 07:35 UTC; paket öncesi canlı site. Her sayfa için yeni Chromium oturumu, 390 × 844 CSS piksel, normal animasyon, analitik izni yok. Ağ/CPU kısıtlaması uygulanmadı; ölçüm load olayından beş saniye sonra alındı.

| Sayfa | TTFB | FCP | Gözlenen LCP | Gözlenen CLS |
|---|---:|---:|---:|---:|
| Ana sayfa | 134 ms | 2496 ms | 2772 ms | 0,0144 |
| Filtre kategorisi | 129 ms | 1120 ms | 1120 ms | 0 |
| Filtre rehberi | 130 ms | 516 ms | 516 ms | 0 |
| Eminönü mağazası | 130 ms | 440 ms | 440 ms | 0 |

Bu tekil laboratuvar örnekleri Lighthouse puanı, gerçek kullanıcı Core Web Vitals sonucu veya hız iyileşmesi kanıtı değildir. INP ve kullanıcı yüzdelikleri ölçülmedi. Ana sayfada daha geç görünen büyük görsel sonraki performans incelemesinin adayıdır; devam eden ana sayfa tasarımı bu pakette değiştirilmedi.

Tekrar ölçüm: `node scripts/audit-public-performance.mjs https://griakvaryum.com`. Ayrıntılı JSON raporu `.gstack/seo-evidence/performance-lab.json` konumuna yazılır.

## Hesap/veri bekleyenler

Search Console indeksleme sonuçları, GA4 raporları, İşletme Profili ve Merchant Center hesap içinden henüz doğrulanmadı. İlk 50 ürünün ticari önceliği için güncel satış/marj ve stok sürekliliği; uzman imzası ve özgün mağaza içerikleri için gerçek kişi/işletme bilgileri gerekiyor. Bu paket bu adımların tamamlandığı anlamına gelmez.
