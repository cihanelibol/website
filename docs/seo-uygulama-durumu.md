# SEO uygulama kaydı — 12 Kasım 2026

İlk teknik paket uygulandı. Bu kayıt, 90 günlük planın tamamının bitirildiği anlamına gelmez.

## Uygulananlar

- Ürün site haritası: doğrulama anında 1.908 ürün, toplam 1.959 adres. Yalnızca ürün bulunan kategori/markalar dahil; katalog hatasında eksik başarılı sitemap yerine hata yanıtı.
- 10 kategori şablonu için özgün seçim açıklaması ve mevcut rehber bağlantıları; ürün kapsamı olan marka sayfaları.
- Kategori `/kategori/[slug]`, marka `/marka/[slug]`; eski filtre adreslerinden parametreleri koruyan HTTP 308.
- Canonical, benzersiz metadata, sosyal paylaşım görseli; sayfa 2 için kendine canonical.
- Site içi arama, sıralama, stok ve düşük değerli birleşik filtrelerde noindex; giriş/kayıt/sepet de noindex.
- Geçersiz sayfalama ve ürün adreslerinde gerçek 404. Katalogdaki erken streaming yükleme kabuğu bu nedenle kaldırıldı.
- Ürün Product/Offer ve breadcrumb verisi, işletme PetStore verisi; JSON-LD için güvenli metin kodlama.
- Varyant fiyatı, GTIN veya puan uydurulmaz. Yalnızca gerçek onaylı ürün yorumlarından puan üretilir.
- Ürün metadata ve sayfa verisinde istek içi katalog paylaşımı; taze checkout okuması ayrı tutulur.
- Görünür, sabit ana sayfa H1'i; slogan tasarımı korunarak paragraf haline getirildi.
- `/magaza/eminonu`: gerçek adres, saat, fotoğraf, harita ve iletişim yolları.
- Rehberdeki örnek WhatsApp numarası ortak işletme numarasıyla değiştirildi.
- Kullanıcının GTM-MX2PWXC3 konteyneri ve yayımlanmış G-VFL3YXK217 hedefi doğrulandı. Analitik izni öncesi Google betiği yüklenmez; tercih değiştirilebilir ve geri alınabilir. Reklam izinleri kapalıdır.
- `view_item`, `add_to_cart`, `contact_click`, `directions_click` olayları. Tahsil edilmemiş siparişler için `purchase` üretilmez.
- Hesap ve sepet gibi özel sayfalarda Google betiği başlatılmaz. Özel sayfalara normal bağlantı geçişleri yeni belge açarak yüklenmiş etiketi taşımamayı sağlar. Tam checkout hunisi sonraki pakettedir.

## Doğrulama

Node.js 24.22.1 kullanıldı. Sistem varsayılanı Node.js 20 olduğundan vitest bu sürümde başlatılamıyor; projenin engines gereksinimi Node.js 24.

- ESLint ve TypeScript kontrolü başarılı.
- İzole production build başarılı; üretim veritabanına yazılmadı.
- 87 birim testi başarılı; 15 SEO testi bu toplamda.
- 14 HTTP/tarayıcı güvenlik testi başarılı; analitik izni ve uygulanan CSP altında nonce testi dahil.
- `scripts/verify-seo.mjs`: metadata, canonical, H1, schema, noindex, 308, 404 ve gerçek katalog sitemap'i.
- `scripts/verify-seo-browser.mjs`: 390 px mobil düzen, sıralama adresi, analitik izin/ret/geri alma ve tekrar yüklememe. QA olayları gerçek Analytics hesabına gönderilmez.

Tekrar çalıştırma:

```text
node scripts/verify-seo.mjs https://griakvaryum.com
node scripts/verify-seo-browser.mjs https://griakvaryum.com
```

## Devam eden / hesap veya işletme verisi gereken işler

- Search Console mülküne `https://griakvaryum.com/sitemap.xml` gönderimi ve URL denetimi. Hesap panelinden gönderim henüz yapılmadı.
- Analytics raporlarının hesap içinde doğrulanması, Search Console bağlantısı ve önemli olayların seçimi. Yayımlanmış hedefin varlığı, raporlardaki verinin doğrulanmasıyla aynı şey değildir.
- Google İşletme Profili güncellemeleri ve eski işletme kayıtlarının doğrulanması.
- Ürünlerin gerçek marj/stok önceliğine göre ilk 50 ürünün özgün teknik açıklama ve fotoğrafları.
- Gerçek uzman/yazar bilgileri, rehber güncellemeleri, özgün video ve mağaza vaka içerikleri.
- Tahsilat/ödeme iş akışı, tam checkout dönüşüm hunisi ve uygun ürünlerle Merchant Center hazırlığı.
- Saha Core Web Vitals başlangıcı, katalog API darboğazının daha kapsamlı optimizasyonu ve açılış animasyonu deneyi.
- İndeksleme veya Google'da sıra kazanımı henüz ölçülmedi; yayımlamak, indekslenme garantisi değildir.
