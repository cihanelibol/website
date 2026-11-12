# Gri Akvaryum — SEO ve organik büyüme planı

Uygulama başlatıldı: [ilk teknik paket ve kalan işler](seo-uygulama-durumu.md). Aşağıdaki bulgular uygulama öncesi incelemeyi kaydeder.

İnceleme tarihi: 12 Kasım 2026. Kapsam: mevcut kaynak kodu, canlı sitenin örnek HTTP/HTML yanıtları, sektör arama örnekleri ve Google'ın güncel birincil kaynakları. Bu belge uygulama planıdır; üretim kodu ve dış hesaplar değiştirilmemiştir.

## 1. Stratejik karar ve başarı tanımı

Gri Akvaryum'un büyüme sırası: **Eminönü/Fatih'te yerel tercih olmak → stok ve uzmanlık avantajı bulunan ürün kategorilerinde görünürlük kazanmak → Türkiye çapında güvenilir akvaryum bilgi ve alışveriş kaynağı olmak.**

Tek bir genel kelimede birincilik yerine üç ölçülebilir liderlik alanı kurulmalı:

1. Yerel: mağazaya yakın, önceden belirlenmiş ölçüm noktalarında ilgili sorgularda Haritalar ilk üç görünürlüğü ve nitelikli mağaza talebi.
2. Ticari: seçilmiş kategori/marka/model sorgularında ilk 10 ve ilk 3 payı; bu sayfalardan gelen tahsil edilmiş satış ve katkı kârı.
3. Bilgi: uzmanlığı kanıtlayan rehberlerden ürünlere geçiş, yeni müşteri ve markalı arama talebi.

Hiçbir sorgu için birincilik garanti edilemez. Özellikle Haritalar sonuçları kullanıcı konumuna göre değişir. İlk 30 gün mevcut seviyeyi belirler; 3, 6 ve 12 aylık sonuç hedefleri bundan sonra kesinleştirilir. Bu dokümandaki üretim adetleri çalışma hedefidir, trafik veya ciro tahmini değildir.

Başlangıç varsayımı: fiziksel mağaza ve Türkiye'ye gönderilebilen ekipman/yem satışları birlikte büyütülecek. Canlı hayvanların teslimatı, hizmet alanları, kargo koşulları ve gerçekten verilen hizmetler işletmeyle doğrulanacak. Stok, marj ve satış verileri görülmeden kategori öncelikleri kesinleştirilmeyecek.

## 2. Doğrulanmış mevcut durum

| Bulgu | Kanıt | Etkisi ve aksiyon |
|---|---|---|
| Canlı sitemap 33 URL içeriyor; ürün URL'si içermiyor | `/sitemap.xml`; `app/sitemap.ts` | 4 genel sayfa ve 29 rehber var. İndekslenebilir ürünler ve yeni kategori/marka sayfaları eklenmeli. Sitemap eksikliği, ürünlerin hiç indekslenmediği anlamına gelmez. |
| Kategori filtresi ve ikinci sayfa aynı başlığı kullanıyor | `/urunler?grup=filtreler`, `/urunler?sayfa=2`: `Ürünler \| Gri Akvaryum`; `app/urunler/page.tsx:25` | Kategori, marka ve sayfalama için ayrı metadata ve açık indeksleme politikası gerekli. |
| Ana sayfa, katalog, iletişim ve örnek üründe canonical yok | Canlı HTML örnekleri; ürün `/urunler/3755084` | Her indekslenebilir sayfanın tercih edilen URL'si tanımlanmalı. |
| Örnek üründe Product/Offer JSON-LD yok | Canlı ürün HTML'i; `app/urunler/[id]/page.tsx` | Ürün verisini arama sistemlerine açık biçimde sunma fırsatı kaçıyor. |
| Ana sayfa ve iletişimde işletme JSON-LD'si yok | Canlı HTML ve kaynak taraması | Organization/PetStore kimliği, adres, telefon ve gerçek çalışma saatleri ilişkilendirilmeli. |
| Rehber SEO temeli mevcut | `/rehber/filtre-rehberi`: canonical; kaynakta Article, BreadcrumbList, FAQPage ve sosyal metadata | Mevcut 29 rehberi geliştirmek ilk içerik önceliği. Sıfırdan içerik yığını gerekmiyor. |
| Rehberin WhatsApp bağlantısı örnek numaraya gidiyor | `app/rehber/[slug]/page.tsx:340`; canlı örnekte `wa.me/900000000000` | Bilgi trafiğinin satışa dönüşmesini engelleyen doğrudan hata; ortak CONTACT kaynağı kullanılmalı. |
| Ana sayfanın H1'i dönen sloganlardan oluşuyor | Canlı HTML; `components/StorefrontHero.tsx` | Sabit, görünür, marka + mağaza türü + konumu anlatan H1; sloganlar ayrı metin olarak korunabilir. |
| Giriş/kayıt/sepet metadata'sında noindex yok | İlgili `app/*/page.tsx` dosyaları | Arama sonucu için değer taşımayan işlem sayfaları dışarıda tutulmalı. Admin ve bazı hesap sayfalarında zaten noindex var. |
| Ürün detayı ve metadata tüm kataloğu okuyor | `lib/easytrade.ts:99`; ürün sayfası | Soğuk istekte tedarikçi API'si ve tüm katalog bağımlılığı var. Gerçek TTFB ölçülerek veri erişimi iyileştirilmeli. |
| Kök layout güvenlik nonce'u nedeniyle dinamik | `app/layout.tsx:13`; yerel Next.js CSP rehberi | Performans için force-dynamic satırını gelişigüzel silmek doğru değil. Veri önbelleği ile kişiye/isteğe özel HTML ayrılmalı. |
| İlk girişte tam ekran animasyon var | `components/OceanSplash.tsx`, `lib/ocean-intro.ts`, `app/ocean-entry.css` | İlk ürün erişimine etkisi mobil ölçülmeli; içerik erişimini geciktirmeyen hale getirilmeli. Mevcut CWV başarısızlığı henüz ölçülmedi. |
| Görsel altyapısı kısmen güçlü | Yerel WebP manifestinde 1.664 eşleme; eksik raporunda 213 kayıt | Bunlar katalog toplamı veya canlı görsel kapsama oranı değildir. Önce ticari öncelikli eksikler tamamlanmalı; raporun dışladığı ürünler ayrıca değerlendirilmeli. |
| Çevrimiçi ödeme kodu tamamlanmamış | `lib/payments.ts:11–14`: `paymentConfigured()` false | Sipariş isteği ve tahsilat ayrı ölçülmeli. Alışveriş kanalları büyütülmeden satın alma süreci doğrulanmalı. |
| GA4/GTM kurulumu kod taramasında bulunmadı | `app`, `components`, `lib` taraması | Hesap veya platform üzerinden kurulum olup olmadığı ayrıca denetlenecek; ölçüm varlığı henüz doğrulanmış değil. |
| www örneği ana alan adına ulaşıyor | `https://www.griakvaryum.com` isteğinin son adresi `https://griakvaryum.com/` | Olumlu. HTTP/HTTPS, kalıcı yönlendirme kodları ve tüm URL varyantları ayrıca kontrol edilmeli. |

Ölçüm sınırı: Search Console, Analytics, Merchant Center ve İşletme Profili yönetim verilerine erişilmedi. Tam site taraması, Lighthouse/CrUX testi, backlink envanteri ve kontrollü Google sıra ölçümü yapılmadı. Bu nedenle indeks sayısı, arama hacmi, mevcut sıralama, dönüşüm oranı ve performans puanı iddia edilmiyor. Web okuma aracı ilk erişimde siteyi açamadı; doğrudan HTTP kontrolleri site ve örnek sayfalarda 200 yanıtını doğruladı. Bu araç hatası site kesintisi olarak değerlendirilmedi.

## 3. Rekabet ve anahtar kelime stratejisi

Arama örneklerinde ulusal ürün/kategori rekabetinde Atakan Petshop ve İstanbul Pet Shop; yerel mağaza anlatımında Enes Akvaryum ve Seval Akvaryum; bilgi ihtiyacında Akvaryum.com gibi kaynaklar görüldü. Bunlar denetim için rakip adaylarıdır; sıraları veya pazar payları ölçülmedi.

- [Atakan'ın filtre kategorisi](https://atakanpetshop.com/akvaryum-filtreleri): ürünleri ticari kategori ve seçim içeriğiyle birleştiriyor. Gri Akvaryum'un karşılığı stoklu modeller, özgün seçim tablosu ve gerçek mağaza desteği olmalı.
- [İstanbul Pet Shop'un akvaryum bölümü](https://istanbulpet.shop/akvaryum): alt kategori ve marka kapsamı geniş. Karşılık tüm kataloğu tek filtre sayfasında bırakmamak.
- [Enes Akvaryum](https://enesakvaryum.com.tr/) ve [Seval Akvaryum](https://www.sevalakvaryum.com/): yer/mağaza kimliğini açık biçimde anlatıyor. Karşılık Eminönü'ndeki gerçek mağazayı, ulaşımı ve ekibi görünür kılmak.
- [Akvaryum.com](https://www.akvaryum.com/): topluluk ve deneyim içerikleri. Karşılık mağazada çekilmiş uygulamalar, ölçümler ve uzman kontrolünden geçmiş cevaplar.

İlk iki haftada 100–150 sorguluk takip listesi oluşturulsun. Her sorgu için niyet, hedef URL, Google sonuç tipi, stok/marj uygunluğu, veri kaynağı, hacim varsa ölçüm tarihi ve mevcut performans kaydedilsin. Aşağıdakiler hacim ölçülmüş kelimeler değil, başlangıç hipotezleridir:

| Sorgu kümesi | Örnek sorgular | Hedef sayfa | Öncelik |
|---|---|---|---|
| Yerel mağaza | Eminönü akvaryumcu, Fatih akvaryum mağazası, Eminönü akvaryum balığı | `/magaza/eminonu` ve İşletme Profili | İlk dalga |
| Filtre satın alma | akvaryum dış filtre, akvaryum iç filtre, pipo filtre | Ayrı ticari kategori sayfaları | İlk dalga; stok/marj doğrulamasıyla |
| Tekrarlı tüketim | balık yemi, japon balığı yemi, su düzenleyici | İlgili kategori ve türle uyumlu ürünler | İlk dalga |
| Marka/model | Eheim dış filtre, Sera balık yemi, tam marka + model + hacim | Marka, seçilmiş marka/kategori ve ürün sayfası | İlk dalga |
| Hacme göre seçim | 100 litre akvaryum filtre seçimi, 200 litre akvaryum dış filtre | Seçim rehberi + ilgili kategori bağlantısı | İkinci dalga |
| Kurulum ihtiyacı | ilk akvaryum kurulumu, bitkili akvaryum kurulumu | Mevcut rehberlerin geliştirilmesi | İlk dalga |
| Bakım problemi | akvaryum suyu neden bulanır, akvaryum yosun sorunu | Sorun giderme rehberi | İkinci dalga |
| Tür ihtiyacı | lepistes bakımı, beta balığı akvaryumu, karides akvaryumu | Tür rehberi; gerçek envanter varsa canlı kategorisi | İkinci dalga |
| Uzmanlık nişi | filtre yedek parçaları, model uyumlu pervane, filtre malzemesi | Gerçek stok ve uyumluluk verisi olan sayfa | Veriye göre güçlü fırsat |

Öncelik puanı: satın alma niyeti + stok sürekliliği + katkı marjı + mevcut görünürlük fırsatı + özgün uzmanlık avantajı; üretim maliyeti ve rekabet zorluğu ile dengelensin. Genel “akvaryum” ve “İstanbul akvaryum” sorgularında gezi/bilet niyeti bulunabilir; yanlış niyetli gösterim liderlik metriği yapılmasın.

## 4. Teknik SEO ve sayfa mimarisi

### 4.1 Önerilen yapı

```text
/
├── kategori/akvaryum-filtreleri
│   ├── kategori/dis-filtre
│   ├── kategori/ic-filtre
│   └── kategori/pipo-filtre
├── kategori/balik-yemi
├── kategori/su-duzenleyiciler
├── kategori/akvaryum-isiticilari
├── marka/eheim
├── marka/sera
├── urunler/[id]                 mevcut ürün adreslerini koru
├── rehber/[slug]               mevcut güçlü içerik adreslerini koru
├── magaza/eminonu
└── hakkimizda
```

URL'ler tasarım önerisidir; yeni sayfalar henüz oluşturulmadı. Sayısal ürün URL'si tek başına SEO kusuru değildir. Sırf slug eklemek için bütün ürünleri taşımaya öncelik verilmesin. Taşıma gerekirse bire bir kalıcı yönlendirme, iç bağlantı, canonical, sitemap ve feed birlikte güncellensin.

Ana menü → kategori → alt kategori → ürün bağlantıları gerçek HTML bağlantıları olsun. Kritik ürünler mümkünse ana sayfadan üç bağlantı adımı içinde erişilebilsin. Her önemli rehber ilgili ticari kategoriye, ilgili ürün de kullanım rehberine bağlansın. Bu ilişki Google'ın siteyi anlamasına yardımcı olur. [Google e-ticaret site yapısı rehberi](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)

### 4.2 İndeksleme karar tablosu

| URL türü | Karar |
|---|---|
| Özgün kategori/marka/ürün/rehber/mağaza sayfası | İndekslenebilir, kendini gösteren canonical, uygun sitemap kaydı |
| Mevcut tek kategori/marka filtresi | Yeni karşılığı varsa bire bir kalıcı yönlendirme; diğer filtreleri kaybettiren toplu yönlendirme yapılmaz |
| Gerçek sayfalama `?sayfa=2` | Kendine canonical; crawl edilebilir ileri/geri bağlantılar; başlıkta sayfa bilgisi |
| Sadece sıralama değiştiren URL | Aynı ürün kümesinin doğru tercih edilen karşılığına canonical; sayfalama etkisi kontrol edilir |
| Site içi arama `?q=` | noindex; sitemap dışında |
| Düşük değerli çoklu filtre kombinasyonu | İndeks dışı strateji; gerekli temiz sayfalara alternatif keşif yolları korunur |
| Talebi olan marka + kategori | Yeterli stok ve özgün seçim içeriği varsa ayrı indekslenebilir sayfa |
| Sepet, giriş, kayıt ve özel hesap işlemleri | noindex; sitemap dışında; erişim güvenliği ayrıca korunur |
| Geçici stoksuz ürün | Faydalı içerik korunur; stok bilgisi doğru gösterilir; uygun alternatif veya haber ver seçeneği |
| Kalıcı kalkmış ürün | Gerçek eşdeğer varsa 301/308; yoksa 404/410; sırf link korumak için alakasız kategoriye gönderilmez |
| Geçersiz filtre/sayfa veya anlamsız boş kombinasyon | Kontrollü 404; tüm boş sonuçlar 200 dönmez. Meşru kategori geçici boşsa ayrı değerlendirilir |

İkinci sayfa birinci sayfaya canonical edilmesin. robots.txt ile engellenen sayfada Google noindex etiketini okuyamaz: mevcut indekslenmiş filtreleri temizleme ile ileride taramayı sınırlama ayrı aşamalar olarak tasarlansın. Uzun vadede yalnızca noindex'e dayanarak sınırsız filtre URL'si üretmeyin. [Google sayfalama](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [filtre tarama rehberi](https://developers.google.com/crawling/docs/faceted-navigation)

### 4.3 Metadata, sitemap ve şemalar

- Kategori, ürün, marka ve yerel sayfalar için benzersiz title, açıklama ve görünür H1. Title/description uzunluğu sabit Google karakter sınırı gibi ele alınmasın; okunabilirlik ve arama sonucu önizlemesi kontrol edilsin.
- Ana sayfa title önerisi: “Gri Akvaryum | Eminönü Akvaryum Mağazası ve Balık Galerisi”. H1: “Eminönü'nde akvaryum, balık ve ekipman mağazası”.
- Kategori title önerisi: “Akvaryum Dış Filtre Modelleri ve Fiyatları | Gri Akvaryum”.
- Ürün title: doğrulanmış marka + model + önemli varyant + mağaza adı. Desteklenmeyen “en ucuz”, “garantili”, “aynı gün” vaatleri kullanılmaz.
- Ürün için Product + Offer + BreadcrumbList: doğru ad, URL, görsel, fiyat/para birimi, stok, marka, SKU; GTIN/MPN yalnızca gerçek ve doğrulanmışsa. Sayfada gösterilmeyen puan, sahte barkod veya sıfır yorumdan türetilmiş yıldız eklenmez.
- Varyantları olan ürünlerde gerçek veri modeline göre ProductGroup/hasVariant değerlendirilir; ayrı ölçü/renklerin stok ve görselleri karıştırılmaz.
- İşletme için Organization/PetStore, tutarlı `@id`, adres, telefon, doğrulanmış koordinat/saatler, resmi profil bağlantıları; gerçek kargo/iade politikalarıyla tutarlılık.
- Rehberlerde mevcut Article/Breadcrumb korunur; gerçek uzman profili, yayın/güncelleme tarihi ve temsil görseli geliştirilir. Güncelleme tarihi yalnızca anlamlı değişiklikte değişir.
- Sitemap: ürün, kategori, marka, rehber ve yerel sayfalar; yalnızca 200 dönen tercih edilen indekslenebilir adresler. Büyük hacimde ayrı sitemap dosyaları. Ürün API arızasıyla sitemap'in boşalması önlenir; doğrulanmış son veri ve alarm tasarlanır.
- Open Graph/Twitter görselleri ve paylaşım önizlemeleri tamamlanır; bunlar doğrudan sıralama vaadi olarak sunulmaz.
- Render edilen HTML ve Rich Results Test ile temsilî her şablon doğrulanır. Yapılandırılmış veri uygunluk sağlar; özel görünüm veya sıralama garanti etmez. [Google ürün/teklif rehberi](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)

### 4.4 Performans ve dayanıklılık

Önce ana sayfa, kategori, görselli ürün, görselsiz ürün, rehber ve sepet için mobil laboratuvar ölçümü; yeterli trafik varsa CrUX/Search Console saha verisi alınsın. Hedefler, mobil ve masaüstü ayrı 75. yüzdelikte LCP ≤2,5 sn, INP ≤200 ms, CLS ≤0,1. Lighthouse puanı bu saha hedeflerinin yerine geçmez. [Web Vitals eşikleri](https://web.dev/articles/vitals)

Uygulama işleri: soğuk/sıcak katalog TTFB'sini ayrı ölçmek; ürün erişimini mümkünse tek ürün sorgusu veya güvenilir katalog indeksiyle yapmak; metadata ve sayfa veri erişimini ortaklaştırmak; tedarikçi arızasında doğru hata/fallback davranışı; görsellerde doğru boyut, responsive kaynak ve kritik görsel önceliği; ekran altını geciktirmek; animasyon/sohbet yükünün etkileşim süresini azaltmak; tam ekran girişin ürün erişimini geciktirmemesini sağlamak.

Yerel `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`, nonce için dinamik render gerekliliğini doğruluyor. Kişisel sepet/oturum bilgileri ve nonce içeren HTML ortak CDN önbelleğine konmamalı. Mevcut sürümün yerel rehberleri okunarak veri önbelleği ile HTML stratejisi birlikte tasarlanmalı.

## 5. Satış üreten sayfa standardı

**Kategori:** kısa seçim özeti, gerçek stoklu ürünler, ihtiyaca göre filtreler, teknik karşılaştırma, hangi kullanıcıya uygun olduğu, ilgili rehberler, gerçek teslimat/iade bilgileri. Ürünleri aşağı iten uzun jenerik SEO metni kullanılmasın.

**Ürün:** özgün açıklama, doğrulanmış ölçü/debi/güç/hacim, uyumluluk, kutu içeriği, kullanım/bakım, gerçek fotoğraf, stok/fiyat, teslimat koşulları, ürün sorusu ve alternatif. Üretici beyanı ile mağazada yapılan ölçüm ayrı işaretlensin. Evrensel filtre kapasitesi veya tür uyumu tahmin edilmesin.

**Canlı ürün:** türün bilimsel/yaygın adı, yetişkin boyut, doğrulanmış bakım ihtiyaçları, uyumluluk sınırları, güncel stok tarihi, mağazadan teslim veya gerçekten sunulan teslimat yöntemi. Tür içeriğini seri, birbirinin aynısı metinlerle üretmeyin.

**Görseller:** ilk 50 ticari üründe özgün mağaza fotoğrafı/üreticiden kullanım hakkı bulunan görsel, doğru varyant, açıklayıcı alt metin, kalıcı taranabilir URL. 5 dakikalık imzalı EasyTrade linklerinin kalan kullanımını kontrol edin; yerel WebP sistemi bu açıdan mevcut avantaj. Görsel dosyalarının hash adını sadece anahtar kelime eklemek için topluca değiştirmek düşük öncelik.

**Dönüşüm:** gerçek ödeme veya açıkça tanımlanmış tamamlanabilir satın alma modeli; görünür kargo bedeli/teslimat süresi; mobil sepet; doğru WhatsApp/telefon; sipariş sonrası teyit. Mağazada tahsil edilecek isteği ödenmiş satış gibi raporlamayın.

## 6. Yerel SEO ve marka güveni

Tek gerçek mağaza için kapsamlı `/magaza/eminonu` sayfası: dış cephe ve içeriden özgün fotoğraflar, tam adres, harita, çalışma/tatil saatleri, tramvay/vapurdan gerçek ulaşım tarifi, mağazada sunulan hizmetler, ekip ve stok kapsamı. Fatih/İstanbul bağlantısı bu sayfada doğal biçimde anlatılsın. Aynı mağaza için onlarca ilçe kopyası veya gerçekte olmayan şube sayfası üretilmesin.

İşletme Profili: sahiplik doğrulaması, mevcut kategorilerden gerçek faaliyete en uygun ana kategori, doğru ad/adres/telefon, site bağlantısı ve ölçüm etiketi, güncel fotoğraf/video, gerçek hizmetler, özel gün saatleri. İşletme adına sıralama için kelime eklenmesin. Yerel sıralama uygunluk, mesafe ve bilinirlikle ilişkilidir; bütün İstanbul'a aynı sıralama sözü verilemez. [Google yerel sıralama açıklaması](https://support.google.com/business/answer/7091?hl=en)

Marka aramasında “Yeni Gri Papağan...” gibi benzer/eski adlarla [sektörel kayıtlar](https://www.akvaryum.com/Akvaryumcular/yenI_grI_papagan_akvaryum_ve_kus_galerIsI_akv3040.asp) bulundu. Bunların aynı işletme olup olmadığı doğrulanmadan birleştirme veya sahiplenme yapılmaz. Aynı işletmeyse doğru ad/adres/telefon ve alan adına atıflar tutarlı hale getirilir.

Müşteri deneyimi sonrası tarafsız yorum bağlantısı/QR sunulsun; tüm geri bildirimlere yanıt verilsin. Yorum karşılığı indirim, yalnızca memnun müşteriden yorum isteme, çalışanlara yıldız/yorum kotası veya metin dayatma kullanılmasın. [Google yorum politikası](https://support.google.com/business/answer/7400114?hl=en)

Mevcut seçilmiş Google yorumları toplam puan değildir. Bunları sitede sahte AggregateRating üretmek için kullanmayın; işletmenin kendi hakkındaki yorum yıldızları ile gerçek ürün yorumlarının kuralları farklıdır. [Google review snippet rehberi](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

Hakkımızda sayfası: doğrulanabilir işletme geçmişi, gerçek ekip, mağaza görüntüleri ve uzmanlık alanları. “50+ yıl” ve “canlı balık garantisi” gibi iddialar kanıt ve kapsamla desteklensin. Ücretsiz su testi gibi rehberlerde geçen hizmetler işletmenin fiilen sunduğu hizmetlerle eşleştirilsin.

## 7. İçerik, uzmanlık ve dağıtım

Önce mevcut 29 rehberin sorgu–URL haritası çıkarılsın. Özellikle `akvaryum-dongusu` ile `azot-dongusu`, temizlik ile haftalık bakım gibi yakın içeriklerin niyetleri ayrıştırılsın; gerçek örtüşme varsa birleştirme/yönlendirme kararı verilsin. Sayfa sayısını artırmak başlı başına hedef olmasın.

Her içerik brief'i: kullanıcı sorusu, tek ana niyet, mevcut rakiplerden eksik kalan bilgi, uzman, özgün fotoğraf/ölçüm, ana ve destek sorgular, bağlanacak kategori/ürünler, kaynaklar, dönüşüm çağrısı, güncelleme gerekçesi. Balık sağlığı içerikleri uygun uzman incelemesinden geçirilsin; “kesin tedavi” gibi mutlak başlıklar ve türe göre değişen koşullar editoryal denetim önceliği olsun.

İlk 90 gün hedefi: **8 mevcut rehberi geliştirmek, 8 özgün yeni içerik üretmek, 8–12 kısa uygulama videosu hazırlamak**. İçerik kalitesi kapasiteyi aşıyorsa adet azaltılır. Önerilen yayın sırası:

| Hafta | İçerik/iş | Ticari bağlantı |
|---|---|---|
| 1 | 29 rehberin envanteri; bozuk CTA; niyet çakışmaları | Mevcut dönüşüm yolları |
| 2 | Mağaza ve ekip hikâyesi; ulaşım görselleri | Yerel mağaza sayfası |
| 3 | Filtre rehberi + ilk kurulum rehberi güncellemesi | Filtreler ve başlangıç ekipmanı |
| 4 | Hacme göre filtre seçimi; gerçek karşılaştırma çekimi | Stoklu filtre modelleri |
| 5 | Yemleme ve haftalık bakım güncellemesi | Yem ve bakım ürünleri |
| 6 | Başlangıç sepeti: gerçek stok/fiyatla maliyet; bulanık su teşhis akışı | Uyumlu ekipman ve test kitleri |
| 7 | Bitkili akvaryum + su testleri güncellemesi | Aydınlatma, substrat, test |
| 8 | Doğrulanmış marka/model karşılaştırması; filtre malzemesi seçimi | İlgili ürün ve kategori |
| 9 | Isıtıcı ve yosun rehberi güncellemesi | Isıtıcılar ve bakım |
| 10 | Yeni başlayanlar için canlı bitki seçimi; mağazada gerçek kurulum vakası | Gerçek canlı bitki envanteri |
| 11 | Sık sorulan gerçek ürün uyumluluk sorularından içerik | Yedek parça veya ürün seçimi |
| 12 | Veriye göre başlık, iç bağlantı ve CTA iyileştirmesi | Gösterimi var, tıklaması/satışı zayıf sayfalar |

Kısa videolar mağazada çekilsin: kutu içeriği, kurulum, bakım, ürün farkı, ulaşım. YouTube başlığı/açıklaması ilgili rehbere bağlansın; sitedeki videoya metin özeti/transkript eklensin. Video ana içerik olduğunda uygun video sayfası ve VideoObject değerlendirilsin. Kullanıcıların izinli gerçek tank kurulumları ileride vaka içeriği olabilir.

## 8. Ürün listelemeleri, yapay zekâ aramaları ve otorite

### Ücretsiz ürün görünürlüğü

Merchant Center hazırlığına ekipman, yem ve uygun bakım ürünlerinden başlanmalı. Alan adı sahipliği, iletişim, fiyat/para birimi, kargo/iade ve satın alma süreci doğrulanmalı. Kart ödemesi tek seçenek değildir; uygun güvenli satın alma akışında geçerli diğer yöntemler de olabilir. Ancak belirsiz sipariş formu yeterli kabul edilmemeli. [Google mağaza gereklilikleri](https://support.google.com/merchants/answer/12160471?hl=en), [checkout kontrolü](https://support.google.com/merchants/answer/9158778?hl=en)

Ürün veri kaynağı: kalıcı ürün ID'si, başlık, açıklama, URL, kalıcı görsel URL'si, fiyat, stok, marka, mevcutsa geçerli GTIN/MPN, gerçek varyant grubu. EasyTrade, sayfa, şema ve feed aynı doğrulanmış veriden beslensin. Fiyat/stoğun güncelliği iş gereksinimine göre senkronize edilsin; uyuşmazlıklar ve reddedilen ürünler izlensin. Ücretli Shopping reklamları ayrı bütçe/ölçüm kararıdır; organik SEO kapsamıyla karıştırılmasın.

Canlı balık, omurgasız ve diğer özel ürünler topluca feed'e gönderilmesin; ürün, ülke, teslimat ve platform uygunluğu ayrı doğrulansın. Canlı hayvan taşımasına ilişkin kısıtlamalar bulunabildiği için evrensel uygunluk veya yasak varsayılmamalı. [Google ürün güvenliği gereklilikleri](https://support.google.com/merchants/answer/6150100?hl=en-GB)

### Yapay zekâ cevaplarında görünürlük

Google AI Overviews/AI Mode için ayrı bir zorunlu özel şema veya teknik yöntem yok; normal SEO temeli geçerli. Özgün ölçüm tabloları, kısa anlaşılır cevaplar, uzman imzası, doğru işletme/ürün bilgileri ve kaynaklar üretilecek. `llms.txt` veya “GEO paketi” ilk öncelik olmayacak. [Google AI özellikleri rehberi](https://developers.google.com/search/docs/appearance/ai-features)

Google dışındaki sistemlerde görünürlük, önceden belirlenmiş Türkçe sorularla ayda bir örneklenebilir; kaynak gösterimi ve ölçülebilen yönlendirme trafiği kaydedilir. Cevapların değişken olduğu belirtilir; az sayıda denemeden pazar payı çıkarılmaz. Bot erişimi gerçek robots/CDN kurallarıyla incelenir; bot adına göre farklı içerik sunulmaz.

FAQ içeriği kullanıcılara yardımcı olduğu için tutulabilir. Akvaryum mağazasına FAQ zengin sonuçları vaat edilmez; Google bu görünümü ağırlıkla yetkin kamu/sağlık siteleriyle sınırlıyor. [Google FAQ açıklaması](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

### Bağlantı ve marka otoritesi

Üretici/distribütör bayi listeleri, doğru sektörel dizinler, gerçek hobici iş birlikleri, mağazada eğitim/kurulum etkinlikleri, yerel yayınlar ve izinli müşteri vakaları değerlendirilsin. Paylaşılabilir varlıklar: hacim hesaplayıcı, doğrulanmış filtre karşılaştırması, kurulum kontrol listesi, gerçek bakım kayıtları. Hesaplayıcı varsayımları ve sınırları açıklansın.

İlk aşamada 20 ilgili kuruluş/yayın/üreticiden oluşan araştırma listesi hazırlansın; kalite, konu ilgisi ve gerçek kullanıcı erişimi esas alınsın. Satın alınmış sıralama linkleri, PBN, toplu dizin spam'i ve anahtar kelime doldurulmuş bağlantılar kullanılmasın. Sponsorluklar açıkça etiketlensin. Bu plan kapsamında kimseye mesaj gönderilmedi.

## 9. Ölçüm modeli ve karar kuralları

İlk hafta: Search Console alan adı mülkü ve sitemap durumu; mevcut analytics/etiket kurulumu; İşletme Profili performansı; sipariş/tahsilat verileri; sunucu hata kayıtları. İlk 28 gün başlangıç dönemi, geçmiş varsa önceki eş dönem ve geçen yıl karşılaştırması. Marka sorguları ile markasız sorgular ayrı raporlansın.

| Ölçüm | Tanım / karar |
|---|---|
| Ana ticari KPI | Organik kaynaktan ilişkilendirilebilen tahsil edilmiş satış ve katkı kârı; iade/iptal etkisiyle |
| Nitelikli talep | Sipariş isteği, telefon/WhatsApp/yol tarifi tıklaması ayrı olaylar; tıklama tek başına satış veya ziyaret sayılmaz |
| E-ticaret olayları | view_item, add_to_cart, begin_checkout; tamamlanan gerçek siparişe purchase; benzersiz transaction_id ile tekrar önleme |
| Henüz tamamlanmamış sipariş | Ayrı order_request/generate_lead olayı; ödeme/tahsilat sonradan uzlaştırılır |
| Arama performansı | Sorgu ve açılış sayfasına göre gösterim, tıklama, CTR ve konum; ülke/cihaz ayrımı |
| Ticari görünürlük | Sabit sorgu kümesinde ilk 3/10 payı; sorgu listesi değişirse trend ayrı işaretlenir |
| Yerel görünürlük | Aynı konum noktaları ve sorgularla ölçülen ilk 3 payı; tüm şehir için genellenmez |
| İndeks sağlığı | İndekslenmesi istenen URL envanterine göre durum; beklenen noindex/redirect'ler hata sayılmaz |
| İçerik katkısı | Rehber → kategori/ürün geçişi, destekli dönüşüm; yalnızca sayfa görüntüleme değil |
| Ürün veri sağlığı | Feed reddi, fiyat/stok uyuşmazlığı, eksik görsel, bozuk ürün URL'si |
| Site sağlığı | 5xx ve tedarikçi hataları, TTFB, mobil CWV; şablon bazında |

Etiketler mevcut CSP ve kullanıcı tercihleriyle uyumlu çalıştırılsın; e-posta/telefon gibi kişisel bilgiler analytics olaylarına taşınmasın. Search Console doğrulaması için analytics kurulması zorunlu değildir. Satın alma olayları backend sipariş kaydıyla uzlaştırılsın.

Karar kuralları:

- Gösterim yükseliyor, tıklama zayıfsa aynı sorgu/konum bağlamında başlık, teklif ve niyet uyumu incelensin.
- Tıklama var, talep yoksa stok/fiyat, teslimat, görsel, güven ve CTA incelensin.
- Talep var, tahsilat yoksa satış operasyonu ve ödeme süreci incelensin.
- Önemli sayfa keşfedilmiyorsa iç bağlantı/sitemap; taranıp indekslenmiyorsa özgün değer, tekrar ve teknik durum incelensin.
- Güncellenen sayfalar için 28/56 günlük karşılaştırmalar; düşük örneklemde kesin nedensellik iddiası kurulmasın.
- Reklam harcaması, kampanya, stok kesintisi ve sezon etkileri rapora not düşülsün.

## 10. Önceliklendirilmiş uygulama listesi

Eforlar planlama tahminidir; kişi-gün cinsindendir. Ortak şablon işleri örtüştüğü için satırlar doğrudan toplanmaz. P0 ilk sprint, P1 ilk 30–60 gün, P2 60–180 gün anlamına gelir.

| ID | İş / öncelik | Sorumlu | Efor | Bağımlılık ve tamamlanma ölçütü |
|---|---|---|---|---|
| SEO-01 | Ölçüm ve başlangıç envanteri / P0 | SEO + geliştirici | 2–3 | Hesap erişimleri; sorgu/URL/satış başlangıç raporu |
| SEO-02 | Yanlış WhatsApp ve kırık CTA / P0 | Geliştirici | 0,5 | Tüm şablonlarda doğru işletme numarası |
| SEO-03 | Ürün sitemap'i / P0 | Geliştirici | 1–2 | İndekslenebilir ürün envanteriyle eşleşir; API hata davranışı doğrulanır |
| SEO-04 | Canonical ve benzersiz metadata / P0 | Geliştirici + SEO | 2–3 | Temsilî tüm şablonlarda doğru tercih URL'si/title |
| SEO-05 | Filtre/sayfalama/noindex politikası / P0 | SEO + geliştirici | 2–4 | Temiz URL'ler keşfedilir; sayfa 2 kendini canonical gösterir |
| SEO-06 | Ürün ve işletme şemaları / P0 | Geliştirici + SEO | 2–3 | Görünür veriyle eşleşir; desteklenen türlerde kritik test hatası yok |
| SEO-07 | Satın alma süreci ve olay doğruluğu / P0 | İşletme + geliştirici | 1–2 denetim | Tahsilat modeli net; entegrasyon eforu ayrıca planlanır |
| SEO-08 | Mobil performans baz ölçümü / P0 | Geliştirici | 1–2 | 6 şablon; soğuk/sıcak sunucu ölçümü; bulgu listesi |
| SEO-09 | Yerel işletme kimliği / P0 | İşletme + SEO | 1–2 | Adres/ad/saatler ve mevcut kayıt ilişkileri doğrulanır |
| SEO-10 | İlk 8–12 ticari kategori / P1 | SEO + geliştirici + uzman | 5–8 | Talep/stok seçimi; özgün içerik; menüden bağlantı |
| SEO-11 | 4–6 marka sayfası / P1 | SEO + içerik | 3–5 | Gerçek ürün kapsamı; kopya niyet yok |
| SEO-12 | İlk 50 ürünün veri kalitesi / P1 | İşletme + içerik | 8–12 | Doğrulanmış özellik, fotoğraf, stok, teslimat, bağlantı |
| SEO-13 | Mağaza ve Hakkımızda sayfaları / P1 | İşletme + içerik | 2–4 | Gerçek fotoğraf, ekip, ulaşım, kanıtlanmış iddialar |
| SEO-14 | Ana H1 ve açılış deneyimi / P1 | Tasarım + geliştirici | 1–3 | Açık mağaza kimliği; mobil içerik erişimi ölçülür |
| SEO-15 | Katalog veri erişimi/performans / P1 | Geliştirici | 3–6 | Ölçülen darboğaza göre iyileşme; nonce/oturum güvenliği korunur |
| SEO-16 | İlk görsel eksiklerinin kapatılması / P1 | İşletme + içerik | 3–6 | Öncelikli ürünlerde doğru ve kalıcı görsel |
| SEO-17 | 8 mevcut rehberin geliştirilmesi / P1 | Uzman + editör | 6–10 | Yeni kanıt, niyet ayrımı, kaynak ve ticari bağlantılar |
| SEO-18 | Merchant Center uygunluk ve veri hazırlığı / P1 | SEO + geliştirici | 3–5 | SEO-07; site/feed tutarlılığı ve uygun ürün kapsamı |
| SEO-19 | 8 yeni içerik / P1 | Uzman + editör | 8–12 | Brief, özgün içerik, uzman kontrolü ve CTA |
| SEO-20 | 8–12 kısa video / P1 | İşletme + içerik | 4–6 | Gerçek çekim; ilgili sayfaya bağlantı; altyazı |
| SEO-21 | Gerçek yorum ve ürün soru süreci / P1 | İşletme | 1–2 kurulum | Teşviksiz/tarafsız istek; yayınlanan gerçek geri bildirim |
| SEO-22 | Marka atıfları ve iş birliği araştırması / P2 | SEO + işletme | 3–5 | 20 ilgili aday; doğrulanmış kayıt düzeltmeleri |
| SEO-23 | Hesaplayıcı/karşılaştırma aracı / P2 | Uzman + geliştirici | 3–6 | Arama talebi ve kullanım ihtiyacı; doğrulanmış hesap/varsayımlar |
| SEO-24 | Model/yedek parça ve tür kapsamı / P2 | SEO + işletme | Kapsama göre | Satış/arama verisi ve gerçek uzmanlıkla genişleme |
| SEO-25 | Aylık içerik ve teknik denetim / Sürekli | SEO + geliştirici | 2–3/ay | Kazananlar, kayıplar, hata ve deney listesi |

Geliştirme kabul kontrolü: temsilî ürün/kategori/rehber URL'lerinde HTML metadata ve şema; doğru 200/3xx/404 davranışı; robots/sitemap/canonical uyumu; mobil satın alma/iletişim; analitik olayları; mevcut lint/typecheck ve değişikliğe uygun testler. Güvenlik/önbellek değişikliklerinde mevcut ilgili testler çalıştırılır. İçerik değişiklikleri için gereksiz test paketi üretilmez.

## 11. Takvim, kapasite ve hedefler

| Dönem | Teslimat |
|---|---|
| Gün 1–7 | Ölçüm tabanı, sorgu/URL envanteri, WhatsApp düzeltmesi, canlı teknik tarama, satın alma modelinin doğrulanması |
| Gün 8–14 | Sitemap, canonical/noindex/sayfalama, ilk şema, işletme kimliği, metadata şablonları |
| Gün 15–30 | İlk kategori/marka sayfaları, mağaza sayfası, ilk 20 ürün iyileştirmesi, ölçülen performans darboğazları |
| Gün 31–60 | Toplam 50 öncelikli ürün, kategori/marka kapsamının tamamlanması, mevcut rehber güncellemeleri, uygun ürün feed'i |
| Gün 61–90 | 8 yeni + 8 güncellenmiş içerik hedefinin tamamlanması, videolar, ilk CTR/dönüşüm deneyleri, atıf araştırması |
| Ay 4–6 | Kazanan kategorilerde derinleşme, gerçek karşılaştırmalar ve araçlar, model/yedek parça kapsamı |
| Ay 7–12 | Kanıtlanan kümeleri ölçekleme, tekrar alışveriş, güncel bakım içerikleri, yeni nişler |

Önerilen kapasite: ilk ay geliştirici haftada 2–3 gün; SEO sorumlusu haftada 1–2 gün; editör haftada 2 gün; mağaza uzmanı haftada 2–4 saat ve düzenli çekim zamanı. İkinci/üçüncü ay geliştirme ihtiyaç bazlı azalabilir. Bu kapasite altında sayfa ve içerik adetleri düşürülür; öncelik sırası korunur. TL bütçesi tedarik teklifi olmadan uydurulmaz. İlk ay teknik/ölçüm, sonrasında ürün bilgisi/uzman içerik için ağırlık ayrılır.

30 gün teslimat hedefi: öncelikli şablonlarda canonical/metadata/şema kapsamı, ürün sitemap'i, ölçüm doğruluğu, yerel kimlik ve kritik CTA'ların tamamlanması.

90 gün teslimat hedefi: 8–12 kategori, 4–6 marka, 50 ürün, 8 güncellenmiş + 8 yeni içerik ve 8–12 video; bunlar yalnızca stok ve içerik kalitesi yeterliyse yayımlanır. Öncelikli şablonlarda kritik indeksleme/şema hatası kalmaması ve mobil performans hedeflerine yaklaşım saha verisiyle değerlendirilir.

6–12 ay sonuç hedefleri: ilk 28 gün verisiyle onaylanan markasız organik satış/talep artışı, seçilmiş ticari sorgularda ilk 3/10 payı, yerel ölçüm noktalarında ilk 3 payı. Başlangıç sayıları bilinmeden “6 ayda 10 kat trafik” veya sabit ciro sözü verilmez.

Ekonomik model: ek organik tıklama × gerçekleşen satın alma oranı × sipariş başına katkı kârı − içerik/teknik operasyon gideri. Mağaza talepleri için nitelikli talep × gerçekleşen satış oranı ayrı hesaplanır; aynı müşteri iki kez sayılmaz.

## 12. Hemen sonraki uygulama paketi

İlk sprintin somut kapsamı SEO-01–09: ölçüm ve ticari gerçekliği netleştirmek; yanlış WhatsApp'ı düzeltmek; ürünleri sitemap'e almak; canonical/metadata/filtre politikasını kurmak; ürün/işletme şemalarını eklemek; yerel kimlik ve mobil performansı doğrulamak. Ardından kategori ve ürün içeriklerine geçmek.

Uygulama başlangıcında gerekli işletme verileri: Search Console/İşletme Profili mevcut durumu, son 90 günlük ürün satışları, marj ve stok sürekliliği, gerçek teslimat/ödeme/iade koşulları, uzman/ekip bilgileri ve kullanılabilir mağaza fotoğrafları. Planın hazırlanması bu erişimler beklenmeden tamamlandı; sonuç hedeflerinin kesinleştirilmesi bunlara bağlı.

Teknik operasyon notu: İlk planın başlangıç bağlamında CLI kurulu görünmüyordu; uygulama sırasında Vercel CLI 65.15.0 ve mevcut oturum doğrulandı. Üretim yayını ve log kontrolü bu oturumla yapıldı. CLI bulunmayan geliştirme ortamları için `npm i -g vercel` kurulumu önerilir; bu bir SEO sıralama faktörü değildir. Güncel yayın ve erişim durumu uygulama kaydındadır.
