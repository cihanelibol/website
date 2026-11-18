# Sipariş ve ödeme akışı

Online siparişler yalnızca doğrulanmış iyzico kart ödemesiyle onaylanır. Anahtarlar eksik, ortam uyumsuz veya müşteriye sandbox kapalıysa sunucu sipariş oluşturmaz. Kart bilgileri mağazaya gönderilmez; iyzico ortak ödeme sayfasında girilir.

## Durumların anlamı

| Ödeme | Aktarım | Müşteri görünümü |
|---|---|---|
| beklemede | yok | Ödeme bekleniyor |
| basarisiz | yok | Ödeme tamamlanamadı; aynı siparişten tekrar deneme |
| kontrol | yok | Ödemeniz kontrol ediliyor; yeni tahsilat kapalı |
| odendi | pending / unknown | Ödemeniz alındı, siparişiniz işleniyor |
| odendi | sent | Sipariş onaylandı; hazırlık/kargo takibi |

Ödeme denemesi atomik olarak ayrılır. Geçerli ödeme oturumu yeniden kullanılır; eski tokenlar geç gelen bildirimler için saklanır. Kesin başlatma reddi tekrar denenebilir, zaman aşımı gibi belirsiz sonuçlar kontrol bekler. Başarılı yanıtın imzası, tokenı, tutarı, para birimi, sepeti ve fraud sonucu doğrulanır. İlk sürüm tek çekimle çalışır; vade farkıyla toplamın değişmesini önlemek için taksitler kapalıdır.

Aktarım, doğrulanmış ödeme kaydından tek seferlik hak alınarak yapılır. EasyTrade zaman aşımında tekrar gönderilmez: mağaza panelindeki kayıt kontrol edilerek referansla uzlaştırılır. Ödemesi alınmış bir siparişin iptali otomatik para iadesi değildir. Geç gelen ödeme iptal edilmiş siparişi hazırlığa açmaz; operatör iyzico kaydını ve iade gereksinimini kontrol eder.

Sandbox kayıtları gerçek sipariş aktarımı ve müşteri onayı üretmez. Üretim Vercel ortamında sandbox yöneticiye de kapalıdır. Eski `iyzico-bekliyor` kayıtlar ayrı gruptadır; tahsilat kanıtı kaydedilmeden hazırlık/kargo yapılamaz. Online kart ödemesi manuel tahsilat düğmesiyle onaylanamaz.

## Sonuç ve erişim

`/sepet/sonuc` durumunu veritabanından okur; `durum=tamam` bir ödeme kanıtı değildir. Sipariş sahibinin hesabı, checkout sırasında verilen HttpOnly çerez veya siparişe özel 30 günlük imzalı bağlantı gerekir. Yanıtlar önbelleğe alınmaz ve referrer göndermez. E-posta bağlantısı özel erişim sağlar; paylaşılmamalıdır.

Başarı sayfası yalnızca o tarayıcı oturumunda başlatılmış siparişin alınan miktarlarını sepetten düşürür. İşlem tekrar ziyarette uygulanmaz; sonradan eklenen ürünler ve başka oturumdaki sepet korunur. Teslimat formu ve istek kimliği sekmenin sessionStorage alanında yeniden deneme için tutulur.

## Yayına geçiş

1. Node.js 24 kullanın (`package.json` gereksinimi). Yerel varsayılan Node 20, Vitest ESM başlangıcında hata veriyor.
2. `STORAGE_BACKEND=relational` kullanan mevcut veritabanında **uygulama dağıtımından önce** `migrations/002_payment_states.sql` dosyasını migration yetkili bağlantıyla çalıştırın. İşlem yalnızca ödeme durumu CHECK kısıtını genişletir; siparişleri veya tahsilat kanıtlarını değiştirmez. Yeni kurulum için 001 dosyası da yeni durumları içerir. JSON backend için bu SQL gerekli değildir. SQL bu çalışma sırasında canlı veritabanına uygulanmadı.
3. Gerçek ortamda `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` (veriliyorsa canlı uç nokta), `APP_ORIGIN`, `SESSION_SECRET` ve mevcut depolama/posta ayarlarını doğrulayın. Anahtar değerlerini raporlara veya loglara koymayın.
4. `CRON_SECRET` en az 32 karakter olmalıdır. `vercel.json` içindeki `payment-reconciliation`, `/api/internal/payments` adresine beş dakikalık zamanlamayla POST gönderir. Her çalışmada en eski kontrol zamanına sahip beş uygun kayıt sorgulanır; açık ve süresi dolmamış ödeme formları otomatik sorgulanmaz. Zamanlamanın gerçekten çalıştığını dağıtımdan sonra kontrol edin. Müşteri ve yönetici ayrıca elle kontrol başlatabilir.
5. Önizlemede sandbox akışını, üretimde yetkili gerçek işlemle ödeme/aktarım/posta zincirini doğrulayın. Canlı tahsilat bu çalışma sırasında yapılmadı.

19 Kasım 2026 dağıtım hazırlığında eski yerel proje kimliği tespit edildi. `griakvaryum.com` alan adını kullanan mevcut `cihanelibol99-7528/griakvaryum` projesi doğrulanarak yerel bağlantı düzeltildi. Üretim ortamında `STORAGE_BACKEND` tanımlı değil; mevcut kod bu durumda JSON backend kullanır, dolayısıyla 002 SQL geçişi bu dağıtım için gerekli değildir. Üretim ödeme anahtarları ve diğer sırlar Vercel'de Secret olarak tanımlıdır; değerleri dışarı alınmadı ve yeniden yazılmadı.

## Doğrulama

- Ödeme kapısı, başlatma/sonuç imzaları, eşzamanlı gönderim, eski callback, zaman aşımı, aktarım belirsizliği, sandbox, iptal sonrası ödeme, misafir erişimi ve bildirim testleri.
- `scripts/verify-checkout-browser.mjs`: izole yerel verilerle gerçek Next sayfaları; dış servis bağlantıları kapalı. 1440 ve 390px ekranlar, sahte başarı URL'si, miktar bazlı sepet temizleme, tekrar ziyaret ve ödeme kapalı görünümü. Chrome veya `PLAYWRIGHT_CHANNEL` ile seçilen tarayıcı kullanılır.
- `tests/http/checkout.spec.ts`: üretim derlemesinde HTML/RSC erişimi, no-store ve ödeme worker yetkilendirmesi.
- Üretim derlemesi ve değişen kodda lint/typecheck.
- Genel testlerdeki üç eski hata, değişiklik öncesi HEAD arşivinde de yeniden üretildi: iki MFA beklentisi (`getAdminUser`, `requireFreshAdmin`) ve katalog yapılandırma hatasının dışarı iletilmesi. Bu değişiklik kimlik doğrulama politikasını değiştirmez.
- Son genel tarama: 154 başarılı / 3 önceden mevcut hata. Ödeme kapsamındaki 41 test başarılı. İki üretim HTTP erişim testi başarılı.
- Tasarım denetimindeki e-posta font uyumsuzluğu mevcut Inter/Segoe UI sistemiyle düzeltildi; uyarı bastırılmadı. DESIGN.md ödeme davranışı ve tasarım sidecar kaydı güncellendi.

## Kaynaklar

- [iyzico Checkout Form sonuç sorgusu](https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-retrieve)
- [iyzico yanıt imzası doğrulaması](https://docs.iyzico.com/en/advanced/response-signature-validation)
- [Vercel Schedules yapılandırması](https://vercel.com/docs/schedules/configuration)
- [Path hedefleri ve CRON_SECRET](https://vercel.com/docs/schedules/handle-runs)
