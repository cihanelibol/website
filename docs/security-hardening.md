# Güvenlik uygulaması — 11 Kasım 2026

Bu çalışma repo içindeki doğrulanmış açıkları giderir ve ek savunmalar getirir. Canlıya dağıtım yapılmadı. Planın bütün maddeleri kapanmış değildir; aşağıdaki açık işler yayın öncesi izlenmelidir. Önceden var olan ve eşzamanlı yürütülen mağaza tasarımı değişiklikleri korundu.

Kalan işler için güncel sıra: [ödeme entegrasyonu en son olacak uygulama planı](security-next-steps.md). SEC-29, ödeme dışındaki güvenlik işleri ve kart ödemesi kapalı yayın doğrulandıktan sonra başlar.

## Uygulanan temel değişiklikler

- Next.js/eslint-config-next 16.4.6, React 19.3.1; kilitli bağımlılıklar ve Node 24 sözleşmesi.
- Yönetici okumalarında sayfa ve `server-only` veri katmanı kontrolü. Normal kayıt yalnız müşteri oluşturur. E-posta listesi rol vermez; `ADMIN_EMAILS` yalnız bildirim alıcılarıdır.
- E-posta doğrulama, tek kullanımlık 30 dakikalık parola yenileme bağlantıları; token'lar hash olarak saklanır. Bağlantı token'ı URL fragment'indedir ve sayfa açıldığında adres çubuğundan silinir.
- Asenkron scrypt `N=131072, r=8, p=1`, 15–128 karakter yeni parola sınırı; sürümlü hash ve başarılı girişte eski hash yükseltmesi. Instance başına dört hash işlemi sınırı; bozuk/eksik hesapta eşdeğer güçlü hash çalışması.
- Sunucuda iptal edilebilir oturumlar. Çıkış, parola/rol değişimi ve pasifleştirme kontrolleri. Eski imzalı session formatı kabul edilmez. Üretimde `__Host-`, Secure, HttpOnly, SameSite=Lax çerezleri.
- Yönetici TOTP MFA, şifreli sırlar, tek kullanımlık kurtarma kodları ve TOTP tekrar kullanım koruması. Yönetim için 30 dakika; uzlaştırma/tahsilat için 5 dakika içinde MFA gerekir.
- Google OIDC imza/issuer/audience/expiry/nonce kontrolü, PKCE, tek kullanımlık state ve sabit origin. E-posta eşleşmesine göre otomatik hesap birleştirme kaldırıldı. Bağlama, doğrulanmış mevcut hesaba yakın zamanda giriş gerektirir.
- Sunucu kataloğundan fiyat/ürün/stok/para birimi kontrolü, tam sayı adet sınırları, kuruş hesabı. Sipariş dış servise gitmeden kalıcı olarak ayrılır. Aynı request ID tekrarında yeni sipariş gönderilmez; belirsiz sonuç operatör incelemesine alınır.
- Sipariş durum geçişleri kısıtlandı. Teslimat tahsilat sayılmaz. Manuel tahsilat tam tutar, harici referans, gerekçe, aktör ve taze MFA gerektirir.
- JSON depoda atomik karşılaştırmalı yazma (CAS), çakışmada yeniden okuma; yerel depoda kilit + atomik dosya değiştirme. Üretimde DB yoksa dosyaya düşülmez.
- Paylaşımlı, süreli, kapasitesi sınırlı rate limit; girişte IP ve hesap sınırı; form/body/alan sınırları; dış servis zaman aşımı. Aktivite endpoint'i Origin kontrol eder ve anonim kullanıcıyı depoya yazmaz.
- E-posta HTML escaping; sağlayıcı hata gövdeleri loglanmaz. Bildirim başarısızlığı siparişi tekrar göndermez. Hesap kurtarma yanıtı gönderim başarısızlığından hesap varlığı sızdırmaz.
- Yeni ve eski statüsüz yorumlar yönetici onayına kadar yayımlanmaz. Moderasyon `/admin/yorumlar`; uzlaştırma ve tahsilat `/admin/islemler`.
- Nonce içeren CSP Report-Only, framing engeli, nosniff, no-referrer, Permissions-Policy, üretim HSTS; kişisel sayfalarda no-store. Profil DTO'su hash/token içermez.
- SHA sabitlenmiş CI, minimum GitHub token yetkisi, CODEOWNERS, Dependabot, Gitleaks ve CodeQL iş akışları. Platformdaki zorunlu merge/deploy kuralları ayrıca etkinleştirilmeli.
- Users, identities, sessions, account_tokens ve orders için PostgreSQL şeması, unique/FK/check kısıtları, özel rol atama sınırı ve atomik backfill/geçiş betiği. `STORAGE_BACKEND=relational` kontrollü geçişte açılır; canlı şema henüz taşınmadı.
- Sipariş onayı/durum bildirimi siparişle aynı CAS işleminde outbox'a kaydedilir. Sabit payload, sabit Resend idempotency anahtarı, iki dakikalık kiralama, altı deneme ve 23 saatlik tekrar sınırı; yönetimde bekleyen/hatalı bildirim görünümü.
- İstek kimliği, günlük kalıcı güvenlik kayıtları, `/admin/guvenlik` ve URL/token içeriği kaydetmeyen sınırlı CSP rapor endpoint'i. Inline başlangıç/JSON-LD script'lerine nonce eklendi.

## Doğrulama kanıtı

Node 24.22.2 ile:

| Kontrol | Sonuç |
|---|---|
| Ayrı dizinde temiz `npm ci` | Başarılı; 395 paket, **0 bilinen açık** |
| Birim/entegrasyon güvenlik testleri | **60 geçti** |
| İzole üretim HTTP HTML/RSC/prefetch, header, Origin ve Chromium CSP kontrolleri | **13 geçti** |
| Gerçek PostgreSQL 18 entegrasyon/geçiş kontrolleri | **14 geçti**; yalnız sentetik, yerel disposable DB |
| Sentetik DB yedek/geri yükleme | `pg_dump -Fc` + `pg_restore`; kullanıcı/sipariş ve revision birebir eşleşti |
| Canlı katalog salt okunur şema doğrulaması | **1.908 ürün, 40 sayfa, 162 kategori** geçti; sipariş gönderilmedi |
| Güncel çalışma ağacı `npm install` | 410 paket, **0 bilinen açık** |
| ESLint / TypeScript | Başarılı |
| Ağ erişimi kapalı izole üretim derlemesi | Başarılı; temiz kurulumda da doğrulandı |
| Gitleaks 8.30.1, erişilebilir Git geçmişi | 4 commit, eşleşme yok |
| Gitleaks, takip edilen + ignore edilmeyen mevcut kaynak snapshot'ı | Eşleşme yok |
| Gitleaks negatif kontrol | Bellekte üretilen sentetik özel anahtarı yakaladı |
| Üretim dosya izleri | `.env`, yerel veri ve denetim klasörlerine referans yok |

Testler gerçek e-posta, Google hesabı, banka/ödeme servisi veya EasyTrade siparişi kullanmaz. PostgreSQL suite'i 12 ayrı bağlantıda güncelleme, token yarışı, izinler ve gerçek geçiş betiğini sınar; gerçek Neon ortam ayrımı/yük testinin yerine geçmez. Yedek/restore kanıtı sentetik veriye aittir, üretim yedeği değildir. Gitleaks mevcut takip edilen/ignore edilmeyen kaynak snapshot'ında yeniden çalıştırıldı: 0 bulgu. Bu sonuç bütün sırların bulunabileceği anlamına gelmez.

Yerel scrypt ölçümü: Node 24.22.2, 24 sentetik işlem, eşzamanlılık 4, p50 252 ms / p95 265 ms, işlem sonrası örneklenen en yüksek RSS 439 MiB. Bu değer üretim kapasite garantisi veya hassas tepe bellek ölçümü değildir.

## Planın madde bazında durumu

“Kod hazır” yerel testlerle doğrulanmıştır; canlı ortamda yayınlanmış anlamına gelmez.

| Madde | Durum / kalan iş |
|---|---|
| SEC-01 | Kod hazır: admin sayfa/DAL yetkisi, HTML/RSC/prefetch testleri. |
| SEC-02 | Kod hazır; kullanıcının seçtiği iki hesabın doğrulanması ve açık rol ataması bekliyor. |
| SEC-03 | Kod hazır; eski çakışan hesapların gerçek sahipleriyle kurtarılması gerekiyor. |
| SEC-04 | Kod güçlü secret istiyor; canlı key gücü/ortam ayrımı/rotasyon geçmişi doğrulanmadı. |
| SEC-05 | Kod ve temiz kurulum kontrolü tamam; audit 0. |
| SEC-06 | Kod hazır: sunucu oturumu, iptal, kısa admin süresi. |
| SEC-07 | Kod/test hazır; Resend anahtarı ve doğrulanmış gönderici ortamda eksik. |
| SEC-08 | Kod/test hazır; üretim yükünde scrypt kapasite ölçümü açık. |
| SEC-09 | Kod/test hazır; gerçek yöneticilerin MFA kaydı ve kurtarma kodlarını saklaması açık. |
| SEC-10 | Kod hazır; gerçek Google callback/scope ve hesap bağlama smoke testi açık. |
| SEC-11 | Kod/test hazır; katalog anlık kontrolü stok rezervasyonu değildir. |
| SEC-12 | Kalıcı idempotency, timeout, manuel uzlaştırma ve sipariş bildirim outbox'ı hazır/testli. Sağlayıcının frontend sözleşmesindeki referans/tutar/para birimi doğrulanıyor; gerçek sipariş sonucu, uzlaştırma API'si ve canlı e-posta teslimi açık. |
| SEC-13 | Kod/test hazır. |
| SEC-14 | Paylaşımlı limit ve kayıt/alan sınırları hazır. Edge bot/WAF politikası ve çok instance yük testi açık. |
| SEC-15 | Şema, DB kısıtları, kısıtlı runtime fonksiyonları, backfill/karşılaştırma ve eski yazma yolunu kapatan geçiş kodu hazır; 14 PostgreSQL kontrolü geçti. Canlı geçiş açık. Okuma katmanı uyumluluk için koleksiyon snapshot'ı döndürür; sorgu başına kullanıcı/oturum API'si ayrıca ölçeklenebilirlik işidir. |
| SEC-16 | Dosya fallback ve betik korumaları hazır. Canlı DB runtime rolünün DDL yetkisini kaldırma açık. |
| SEC-17 | Kod/test hazır; gerçek HTTPS Google giriş/çıkış cookie smoke testi açık. |
| SEC-18 | Repo/CI/izole test Node 24; Vercel proje API'sinde Node 24.x doğrulandı. Makine genelindeki Node 20 yerine geliştirme/testte Node 24 kullanılmalı. |
| SEC-19 | Header, nonce ve sınırlı CSP raporlama hazır. Enforce modunda giriş/kayıt/rehber Chromium smoke testi geçti; canlı domain, harita ve OAuth testi sonrası üretimde enforce açılacak. |
| SEC-20 | Kod/test hazır: güvenli DTO, server-only sınırları. |
| SEC-21 | Origin/content type/boyut/timeout/no-store, katalog alan/tip/HTTPS görsel şeması ve harici sipariş kanıtı doğrulaması hazır. Canlı katalog okuması geçti; gerçek sipariş kabul testi açık. |
| SEC-22 | DB'de günlük güvenlik logu, request correlation, yönetici ekranı ve 90 günlük retention kodu hazır. Bağımsız değiştirilemez log hedefi, platform saklama ve alarm teslim testi açık. |
| SEC-23 | CI/CODEOWNERS dosyaları hazır; branch protection, zorunlu review/check ve deploy kapısı platformda açık. |
| SEC-24 | Gitleaks yerelde doğrulandı; periyodik audit/Dependabot/CodeQL tanımlı. GitHub'da işlerin çalışması ve CodeQL erişimi doğrulanmalı. |
| SEC-25 | Yerel dev ve test üretim kimliklerinden ayrıldı. Canlı preview/prod DB, OAuth, mail, secret ve platform MFA ayrımı açık. |
| SEC-26 | Veri envanteri, legacy/relational destekli dry-run retention ve sentetik PostgreSQL restore provası hazır. Sipariş/hesap saklama kararı, canlı zamanlanmış işletim, yedek süresi ve üretim yedeği restore testi açık. |
| SEC-27 | Kod/test hazır: teslimat/tahsilat ayrımı, izinli geçiş, manuel kanıt/aktör/gerekçe. |
| SEC-28 | Kod hazır: yorum moderasyonu, contact/aktivite sınırları, ayrı güvenlik logu. |
| SEC-29 | **Açık:** kart tahsilatı etkin değil. Gerçek sağlayıcı sandbox, imza/tutar/currency eşleştirme, webhook replay ve atomik paid işlemi yapılmadan açılmamalı. |
| SEC-30 | Yerel regresyon ve aşağıdaki yönerge hazır. Canlı migration/restore/deploy/rollback tatbikatları açık. |

## Çalıştırma ve geliştirme izolasyonu

Node 24 kullanın. `npm run dev`, `scripts/dev.mjs` üzerinden başlar; üretim DB, session key, Google ve Resend kimliklerini geliştirmeye taşımaz. Ayrı `DEVELOPMENT_DATABASE_URL` yoksa `.gstack/dev-data` kullanır. Katalog yalnız okunur; development modunda gerçek dış sipariş gönderimi kapalıdır. Development mail/Google için ayrı değişkenler `config/environment.example` içinde listelenmiştir.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build:isolated
node scripts/check-build-artifacts.mjs
npm run test:e2e
```

`build:isolated` ağ erişimini kapatır, sahte bağlantı ayarları kullanır ve `.security-build` üretir. Bu çıktı üretime yüklenmemelidir. Gerçek ortam için normal `npm run build` kullanılır. `test:e2e` 127.0.0.1:3107 üzerinde bu izole çıktıyı açar; açık bir sunucuyu yeniden kullanmaz.

## Yönetici geçişi

1. E-posta servisini doğrulanmış domain ile yapılandırın; `RESEND_API_KEY`, `MAIL_FROM`, HTTPS `APP_ORIGIN`, güçlü ve ortama özel `SESSION_SECRET` ekleyin. Sırları sohbete, Git'e veya shell geçmişine yazmayın. `SESSION_SECRET` yalnız session değil MFA şifreleme ve kurtarma kodlarında da kullanılır; kör rotasyon mevcut MFA'yı açamaz hale getirir. Rotasyon, doğrulanmış yönetici kurtarma/yeniden kayıt prosedürüyle yapılmalıdır.
2. Seçilen iki hesap için posta kutusu sahipliğini doğrulayın; eski hesapta parola yenileme bütün eski oturumları iptal eder. Eski allowlist'ten otomatik yetki taşınmaz.
3. Ayrı operatör ortamına `DATABASE_ADMIN_URL` sağlayın. Gerçek kullanıcı ID/e-posta/hedef DB host'unu doğrulayın. Önce dry run:

```sh
npm run security:admin -- --user-id=USER_ID --expected-email=VERIFIED_EMAIL --role=admin --target-host=EXACT_DB_HOST
```

4. Kontrol edilmiş aynı komuta `--apply` eklemek rolü atar, session/token'ları siler ve auth sürümünü artırır. Betik doğrulanmamış/pasif hesaba yetki vermez. Runtime'a `DATABASE_ADMIN_URL` vermeyin.
5. Her yönetici yeniden giriş yapıp `/hesap/guvenlik` üzerinde MFA kurar; kurtarma kodlarını çevrimdışı saklar. MFA olmadan yönetim verisi açılmaz.

## Veri saklama ve işletim

| Veri | Saklama / erişim |
|---|---|
| Parola, session/token hash, şifreli MFA | Sunucu tarafı; kullanıcı ve yönetici DTO'larına konulmaz. Süresi dolan token/session temizlenebilir. |
| Hesap, adres, sipariş | Sahibi veya MFA doğrulanmış yönetici; otomatik toplu silme yok. Saklama/anonimleştirme süresi işletme tarafından ayrıca kararlaştırılmalı. |
| İletişim mesajı | En fazla 10.000 kayıt, 90 gün; yeni yazmada veya retention işinde temizlenir. |
| Üye davranış aktivitesi | En fazla 2.000 olay, 30 gün; güvenlik loglarından ayrı. |
| Yorum | En fazla 20.000 toplam / 1.000 bekleyen; onay olmadan kamuya çıkmaz. |
| Rate limit / OAuth state | Süreli ve kapasitesi sınırlı; kullanıldığında veya retention işinde temizlenir. |
| Güvenlik olayları | Yapılandırılmış sunucu logu; platform log saklama ve erişim/alarmları henüz doğrulanmadı. |

`node scripts/retention.mjs --target-host=EXACT_DB_HOST` yalnız dry run yapar; isim/iletişim/sır çıktısı üretmez. Ayrı operatör kimliği ve `--apply` ile çalıştırılır; her kayıt CAS korumalıdır. İşlem ortada kesilirse daha önce işlenen anahtarlar tamamlanmış olabilir; tekrar dry run yapılır. Bu betik canlı ortamda çalıştırılmadı veya zamanlanmadı.

`check-db.mjs` artık yalnız salt okunur şema kontrolüdür. `clean-test-data.mjs`, yalnız açıkça ayrı `TEST_DATABASE_URL`, test ortamı, hedef host onayı, `--apply` ve önceden operatörce hazırlanmış disposable marker ile çalışır; yerel `data/` dizinine dokunmaz. Bu güvenlik, operatörün üretim DB'sini yanlışlıkla disposable olarak işaretlemesine karşı bir kimlik doğrulama mekanizması değildir.

## Yayın, geri alma ve olay müdahalesi

- Preview ayrı DB ve sırlar kullanmalı. Gerçek parola/e-posta/Google/MFA/sipariş sınırları bu ortamda sentetik hesaplarla denenmeli. Vercel runtime Node 24 ve canonical OAuth callback açıkça doğrulanmalı.
- Neon'da runtime rolü yalnız gerekli tablo DML yetkilerine sahip olmalı; schema/owner rolü yalnız migration/operatörde bulunmalı. Geri yükleme önce izole bir hedefte denenmeli; kullanıcı/sipariş sayımları ve ilişkiler kıyaslanmalı. Canlı hedefi bu denemede değiştirmeyin.
- GitHub Security işinin tüm kontrolleri zorunlu PR kuralına bağlanmalı; CODEOWNERS değerlendirmesi ve üretim deploy koruması etkin olmalı. Kaynaklar push edilmedi; workflow henüz GitHub'da çalıştırılmadı.
- Yayından sonra anonim admin/RSC erişimi, gerçek cookie nitelikleri, e-posta, Google bağlama, MFA ve düşük hacimli sipariş smoke testi yapılmalı. CSP Report-Only ihlalleri değerlendirilmeden `CSP_ENFORCE=1` açılmamalı.
- Sorunda savunmasız eski auth sürümüne dönmeyin. Gerekirse ilgili kayıt/OAuth/sipariş yolunu kapatıp güvenli ileri düzeltme yapın. Şüpheli hesaptaki session'ları iptal edin, hesabı pasifleştirin; log ve dış sağlayıcı siparişlerini olay kimliğiyle inceleyin. Belirsiz siparişi kör tekrar göndermeyin.
- Yedek dosyalarındaki kullanıcı verisi de erişim ve saklama politikasına dahildir. Gerçek restore kanıtı, alarm teslimi ve platform hesap MFA kontrolleri bu çalışma sırasında üretilmedi.

## Sonraki çalıştırma için somut durum

- GitHub 13 Kasım güncellemesi: aktif depo `cihanelibol/website`; `cihanelibol` için yönetici erişimi doğrulandı ve CODEOWNERS güncellendi. Eski `griakvaryu/website` deposundaki erişim engeli yeni depoya Git geçmişi aktarımıyla aşıldı. Zorunlu kontroller platformda etkinleştirildiği iddia edilmez. [Taşıma kaydı](github-tasima.md).
- Vercel CLI 65.14.0 kurulu ve oturum açık; Node 24.x, fork koruması ve özel domain dışı deployment erişim koruması API'de görüldü. Preview verisinin üretimden ayrıldığı kanıtlanmadı.
- Resend hesabı/doğrulanmış gönderici kullanıcıda var; son kontrol sırasında `RESEND_API_KEY`, `MAIL_FROM`, `APP_ORIGIN`, `CRON_SECRET` proje değişkenlerinde yoktu. Anahtarları sohbete göndermeyin.
- Neon mevcut runtime bağlantısı `neondb_owner` kullanıyor; DB/schema oluşturma yetkisi var. Ayrı kısıtlı runtime rolüyle canlı cutover yapılmadı.
- Kullanıcının seçtiği iki yönetici hesabı doğrulanmamış/MFA kurulmamış olduğundan rol verilmedi. Hesap sahipliği ve MFA, gerçek kullanıcı etkileşimiyle tamamlanmalı.
- Bildirim işi `vercel.json` içinde 15 dakikada bir POST olarak tanımlı; deploy ve `CRON_SECRET` olmadan canlıda çalışmaz. Kimlik doğrulama/parola yenileme e-postaları doğrudan gönderilir; token'lar bildirim kuyruğunda tutulmaz.
- Gerçek ödeme geliştirmesi ve tahsilatı, plan gereği önceki aşamalar tamamlanana kadar kapalı.

Geçiş ve bildirim işletim yönergesi: [security-operations.md](security-operations.md).
