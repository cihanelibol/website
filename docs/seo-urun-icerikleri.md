# Stok öncelikli ürün içerikleri — 13 Kasım 2026

Kullanıcı önceliği: stoktaki filtre, yem ve ısıtıcılar. Satış, arama hacmi veya kâr marjı verisi kullanılmadı.

## İlk tarama

Canlı sitede stok filtresiyle taranan üç kategori: 133 filtre, 142 yem, 0 ısıtma/aydınlatma ürünü. Bu 275 ürünün Product verisinde açıklama yoktu; 28 üründe görsel yoktu. Bu sonuç yalnızca tarama anındaki kategori kapsamını gösterir; mağazanın fiziksel stok sayımı değildir.

`node scripts/audit-product-content.mjs https://griakvaryum.com` sayfalamayı takip eder, her ürünün gerçek Offer stok durumunu ayrıca kaydeder. Tam rapor `.gstack/seo-evidence/product-content-audit.json` altında tutulur; katalog tekrar tarandığında rakamlar değişebilir.

## Uygulanan ilk 50 ürün

- 10 EHEIM filtre: Pick Up 45/60/160/200, Ecco Pro 130/200/300, Liberty 75/130/200.
- 40 Sera yem: Vipagran Baby, Guppy Gran, Micron, Vipan Baby, Goldfish Granules, Goldfish Color Granules, Spirulina, Bloodworms, Mixpur, Tubifex, Daphnien, Artemia, Krill, Vipan, San, Flora, Goldfish Flakes ve GVG Mix ailelerinden stoklu ambalajlar.
- Her ürünün model/paket açıklaması, seçim bilgisi ve görünür üretici kaynağı var. Aynı açıklama Product JSON-LD içinde kullanılır; kısa özet metadata ve sosyal paylaşım açıklamasına gider.
- Veri `config/product-editorial.json` içinde ürün kimliği ve kontrol tarihiyle saklanır. Ürün ID, ad, SKU ve barkod birebir uyuşmazsa içerik uygulanmaz. Mağazanın dolu açıklaması önceliklidir.
- Sepete gönderilen katalog kaydı, fiyat, stok, fotoğraf ve sipariş verileri değiştirilmez. Yeni GTIN, değerlendirme, fiyat veya ambalaj görseli üretilmez.

## Kaynak değerlendirmesi

EHEIM'in resmi model tabloları; Sera'nın resmi ürün sayfaları kullanıldı. Kaynak adresleri her kayıtta ve ürün sayfasında görülebilir. Ecco Pro 130 için aile tanıtımındaki 600 l/saat ifadesi yerine model tablosundaki 500 l/saat değeri alındı. Elektrikli filtre değerleri 50 Hz olarak etiketlendi; pompa debisiyle kurulu filtre akışı eşitlenmedi.

Sera'nın güncel isimleri ile katalogdaki Nature isimleri ürün ailesi ve ürün koduyla eşleştirildi. Yeni ambalajların besin yüzdeleri, gramajları veya sağlık iddiaları eski ambalaja taşınmadı. Vipan Baby 2200 ml ürünündeki katalog/üretici gramaj uyuşmazlığı (1,3 kg / 1,1 kg) nedeniyle bu ürün ilk pakete alınmadı. Güncel kaynakta ambalajı eşleştirilemeyen bazı 1000 ml Goldy ürünleri de bekliyor. Kaynaklar tam çeviri yerine kısa, özgün seçim metinleriyle özetlendi.

## İkinci ürün paketi: 108 ek kayıt

13 Kasım 2026 tekrar taramasında ilk 50 açıklama canlıda görüldü; 225 boş açıklama ve 28 eksik görsel kaldı. İkinci paket 41 yem ile filtre kategorisindeki 67 cihaz, malzeme ve hortumu kapsar. Toplam açıklama sayısı 158'dir.

Yeni içerikler EHEIM Aqua, Biopower, Experience, Classic, Professionel 4+, Mini ve Aqua Corner filtreleri; karbon, mekanik ve biyolojik filtre malzemeleri; Sera UVC Xtreme, PreFix, filtre hortumları ve çeşitli yem ailelerini içerir. Classic paket kodları ayrı tutulur; aynı model adıyla satılan farklı kutuların içeriği eşit kabul edilmez. PreFix'in motorsuz olduğu, uygun hortum ölçüsü, ana/ek yem ayrımı ve kimyasal malzemelerin ölçüm gereksinimi açıklanır.

45 ayrı üretici kaynağının bağlantısı denetlendi. Arama önbelleğinde görünen eski Raffy I adresi canlıda 404 verdiği için güncel Turtle Gammarus Snack sayfasıyla değiştirildi. Raffy I 3800 ml kaydının katalogdaki 470 g değeri güncel üreticide 500 g olduğundan o ambalaj bekletildi; yerine üreticinin Türkçe sayfasıyla doğrulanan Artemia Mix 18 g eklendi. İlk 50 kaydın içeriği korunmuştur.

Kalan 117 ürün [devam listesinde](seo-urun-kuyrugu.csv) ürün kodu ve araştırma durumuyla kayıtlıdır. Listede kaynağı henüz araştırılacak ürünler ile tespit edilmiş ad/gramaj uyuşmazlıkları ayrı belirtilir. Bu liste fiziksel stok teyidi veya tüm kalan ürünlerde sorun bulunduğu anlamına gelmez.

## Kontroller

- 91 birim testi; kimlik uyuşmazlığı, mağaza açıklamasının önceliği, katalog verisinin değişmemesi ve schema/metin eşleşmesi dahil.
- TypeScript, değişen dosyalarda ESLint, izole production build ve 17 HTTP/tarayıcı testi.
- İkinci pakette ürün içerikleri ve SEO için 19 hedefli test, ESLint ve TypeScript içeren izole production build çalıştırılır; GitHub CI genel kontrolleri ayrıca yürütür.
- `node scripts/verify-product-editorial.mjs https://griakvaryum.com`: manifestteki tüm sayfalarda (şu an 158) HTTP, kimlik, görünür açıklama, Product verisi, metadata, kaynak, canonical, H1 ve indekslenebilirlik kontrolü; dört üründe mobil kontrol. QA sırasında Google ölçüm istekleri engellenir.

## Sıradaki işler

Kalan 117 ürünün açıklama kuyruğu sürüyor. Eksik 28 görsel için doğru model/ambalaj fotoğrafı temin edilmeli. Isıtıcılar stoklu kategoriye geldiğinde aynı doğrulama akışına alınmalı. Search Console indeksleme ve Analytics hesap içi rapor kontrolleri halen ayrı işlerdir; bu paketin yayımlanması sıralama veya indeksleme sonucunun ölçüldüğü anlamına gelmez.
