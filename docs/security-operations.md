# Güvenlik geçişi ve bildirim işletimi

## PostgreSQL geçişi

`migrations/001_relational_security.sql` kullanıcı/kimlik/oturum/token/sipariş kısıtlarını kurar. Uygulama rolü yalnız `read_collection` ve `replace_collection` fonksiyonlarını çağırır; rol atama ve özel import fonksiyonunu çağıramaz. Diğer koleksiyonlar mevcut `json_store` CAS yolunda kalır.

1. Neon üzerinde üretimden ayrı hedef ve yönetici olmayan runtime rolü hazırlayın. Operatör bağlantısını runtime'a vermeyin.
2. Üretim yedeğini ayrı hedefe geri yükleyip kayıt/ilişki karşılaştırmasını kaydedin. Yerel sentetik restore kanıtı bu adımın yerine geçmez.
3. Aynı kodun preview testlerini tamamlayın. Bakım aralığında yazmaları durdurun; güvenlik düzeltmelerini içeren yayın hazır olsun.
4. Operatör ortamına `DATABASE_ADMIN_URL` sağlayıp önce dry run çalıştırın:

```sh
node scripts/migrate-security.mjs --target-host=EXACT_HOST --runtime-role=RESTRICTED_ROLE
```

5. Doğrulanan hedefte `--apply --activate --restore-evidence=VERIFIED_RESTORE_REFERENCE` ekleyin. Betik şema, backfill, veri karşılaştırması ve legacy yazma engelini tek transaction'da commit eder. Kurulu şemayı tekrar uygulamaz.
6. Hazır yayında kısıtlı rolün `DATABASE_URL` değerini ve `STORAGE_BACKEND=relational` ayarını kullanın. Hesap/oturum/sipariş okumalarını ve yasak işlemleri doğrulayın; sonra bakım aralığını bitirin.

Geçiş commit edildikten sonra eski uygulama yazamaz. `STORAGE_BACKEND=legacy` ile geri dönmek yeni kayıtları kaybettirebilir: fence'i kaldırmayın. Geçiş sonrası hata durumunda yazmaları durdurun, güvenli ileri düzeltme yapın veya güncel relational yedeği ayrı hedefe geri yükleyip doğrulayın. Önceki savunmasız auth sürümüne dönmeyin.

`npm run test:database`, yalnız açık `TEST_DATABASE_URL` ile localhost üzerindeki boş `security_test*` DB'de çalışır. Testler sentetik veri, rastgele kısıtlı rol ve ek migration DB'si oluşturur; mevcut şemayı silmez. Tekrar koşarken yeni disposable DB kullanın. CI bu testi geçici PostgreSQL 18 servisinde çalıştırır.

## Bildirim teslimi

Sipariş kabulü ve isteğe bağlı durum bildirimi, order kaydıyla aynı atomik işlemde kuyruğa eklenir. Mesaj gövdesi/alıcı değişmez; ilk denemede gönderici sabitlenir. Gönderim sonrası process kesilirse kiralama süresi dolduktan sonra aynı Resend anahtarıyla tekrar denenir. Sağlayıcı 24 saatlik deduplication uyguladığı için otomatik tekrar 23 saatte kesilir. [Resend sözleşmesi](https://resend.com/docs/dashboard/emails/idempotency-keys).

`vercel.json` içindeki `order-notifications`, `/api/internal/notifications` endpoint'ine 15 dakikada bir POST planlar. [Vercel path schedules](https://vercel.com/docs/schedules/handle-runs) için ayrı rastgele en az 32 karakter `CRON_SECRET` tanımlayın. Anahtar yoksa/yanlışsa endpoint 401 döndürür; development gerçek mail göndermez. Ayarlar deploy sonrası yürürlüğe girer. Bu iş henüz canlıda çalıştırılmadı.

`/admin/guvenlik` bekleyen/başarısız bildirimleri gösterir. Altı deneme veya 23 saat sonrası manuel inceleme gerekir. Resend teslim kaydını kontrol etmeden yeni anahtarla tekrar göndermeyin. İşçi sipariş göndermez, ödeme oluşturmaz. Hesap doğrulama ve parola reset e-postaları token süresi nedeniyle bu order kuyruğuna dahil değildir.

## Loglar, CSP ve saklama

Proxy, dışarıdan gelen istek kimliğini yeni UUID ile değiştirir. Güvenlik olayları günlük DB partition'ına ve platform stdout'una yazılır. CSP raporlarında yalnız izin verilen directive tutulur; kaynak URL, query, token ve script örneği saklanmaz. Bu kayıtlar bağımsız değiştirilemez bir denetim deposu değildir.

`scripts/retention.mjs` dry run varsayılanıyla expired session/token, mesaj/aktivite/limit/state ve 90 günü tamamlayan audit partition'larını inceler. Relational geçişte eski kullanıcı JSON'una yazmaz. Hesap/sipariş silmez. Canlı scheduler ve alarm teslimi ayrıca doğrulanmalıdır.

`CSP_ENFORCE=1` izole Chromium testinde giriş/kayıt/rehberde geçti. Üretimde hâlâ Report-Only varsayılanı vardır; gerçek OAuth, harita, görsel ve deployment script'leri kontrol edilmeden topluca açılmamalı.

Parola maliyeti [OWASP scrypt önerisine](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) göre açıkça seçilir; stored hash içindeki keyfi parametreler çalıştırılmaz. Eski hash başarılı girişte CAS kontrolüyle yükseltilir; eşzamanlı parola reset'i üzerine yazılmaz.
