# Kalan güvenlik işleri: ödeme entegrasyonu son aşama

Kullanıcı önceliği: gerçek ödeme entegrasyonunun geliştirilmesi ve etkinleştirilmesi en son yapılacak. Aşağıdaki sıra, kalan işler için geçerli uygulama sırasıdır. Mevcut durum ve test kanıtı [uygulama raporunda](security-hardening.md) korunur. Canlı dağıtım yapılmadı.

11 Kasım uygulama ilerlemesi: relational şema/geçiş betiği ve 14 PostgreSQL testi; sentetik yedek/restore; sipariş outbox'ı ve zamanlama tanımı; kalıcı audit/request correlation; CSP raporlama ve zorunlu politikada Chromium smoke; sürümlü güçlü scrypt tamamlandı. 60 uygulama testi + 13 HTTP/tarayıcı testi geçti. Canlı Resend ayarları, GitHub yönetici yetkisi, ayrı Neon runtime/preview, gerçek yönetici doğrulaması/MFA ve üretim kabul testleri henüz açık. Plan aşamaları bu nedenle bütünüyle kapanmış sayılmaz.

## Aşama 1 — Ortam ayrımı ve güvenli çalışma zemini

- Production, preview ve development için ayrı DB, sırlar, OAuth ve e-posta ayarlarını doğrula. Preview erişimini koru.
- Vercel, CI ve yerel çalışma ortamını Node 24 ile eşleştir.
- Veritabanı runtime rolünü migration/operatör rolünden ayır; gereksiz DDL/sahiplik yetkilerini kaldır.
- Güçlü ve ortama özel session anahtarlarını doğrula; MFA şifrelemesini de etkileyen rotasyon için kurtarma prosedürünü hazırla.
- Şema geçişinden önce yedeği izole hedefe geri yükle ve kayıt sayımlarını doğrula. Platform hesaplarının MFA ve erişim listesini kontrol et.

**Bitiş koşulu:** preview üretim verisine erişemiyor; geri yükleme kanıtı var; runtime yalnız gereken yetkilerle çalışıyor. İlgili işler: SEC-04, 16, 18, 25, 26, 30.

## Aşama 2 — Kalıcı veritabanı geçişi

- Users, identities, sessions ve orders için satır bazlı şema; unique, foreign key ve check kısıtları oluştur.
- Hesap e-postası, sağlayıcı subject'i, session ve sipariş idempotency anahtarlarının tekilliğini DB'de garanti et.
- Veriyi önce ayrı test ortamında taşı; sayım, kimlik ve ilişki karşılaştırması yap.
- Eşzamanlı kayıt, parola değişimi, session iptali ve sipariş testlerini gerçek izole DB üzerinde çalıştır.
- Doğrulanan geçişle yeni veri katmanına geç; eski yazma yolunu kapat. Güvenlik düzeltmelerini koruyan geri alma prosedürünü prova et.

**Bitiş koşulu:** kayıp/çift kayıt yok; veri karşılaştırmaları tutarlı; geçiş ve geri alma provası başarılı. İlgili işler: SEC-06, 12, 15, 16, 30. Mevcut CAS koruması, geçiş tamamlanana kadar korunur.

## Aşama 3 — E-posta, hesaplar ve yöneticilerin etkinleştirilmesi

- Mevcut Resend entegrasyonunun doğrulanmış gönderici domain'i, `RESEND_API_KEY` ve `MAIL_FROM` ayarlarını tamamla.
- Gerçek test posta kutularıyla kayıt doğrulama, parola yenileme, süre aşımı ve tek kullanımlık token akışını dene.
- Kullanıcının onayladığı iki hesabın sahipliğini doğrula; açık yönetici rolünü ata, eski oturumları iptal et ve her hesapta MFA kur.
- Google callback, doğrulanmış kimlik, hesap bağlama ve çakışan eski hesap kurtarma akışlarını dene.
- Gerçek HTTPS üzerinde cookie nitelikleri, çıkış sonrası replay ve yetki matrisi kontrollerini tamamla; scrypt kapasitesini ölç.

**Bitiş koşulu:** iki yönetici MFA ile erişebiliyor; müşteri/anonim erişimi reddediliyor; hesap kurtarma ve Google giriş senaryoları geçiyor. İlgili işler: SEC-02, 03, 07, 08, 09, 10, 17.

## Aşama 4 — Sipariş ve bildirim güvenilirliği

- Katalog yanıtlarının alan/tip/boyut şemasını tamamla; fiyat ve stok kontrollerini gerçek servis sözleşmesiyle karşılaştır.
- EasyTrade iş sonucu, harici sipariş kimliği ve tekrar gönderim sözleşmesini doğrula.
- Zaman aşımında belirsiz kalan siparişler için uzlaştırmayı tamamla; kör tekrar gönderimi engelle.
- E-posta için kalıcı gönderim kuyruğu/outbox, sınırlı yeniden deneme ve hata görünürlüğü ekle.
- Çok instance altında rate limit ve eşzamanlı sipariş testlerini çalıştır; moderasyon ve manuel tahsilat denetim izini doğrula.

**Bitiş koşulu:** aynı istek tek sipariş oluşturuyor; belirsiz dış sonuç izlenebiliyor; bildirim hatası sipariş tekrarı doğurmuyor. İlgili işler: SEC-11, 12, 14, 21, 27, 28.

Bu aşama kart tahsilatı içermez. Mevcut manuel tahsilat kaydı, doğrulanmış dış ödemenin kayıt altına alınmasıdır; ödeme sağlayıcısı entegrasyonu değildir.

## Aşama 5 — Operasyon kontrolleri ve kart ödemesi kapalı yayın

- GitHub güvenlik kontrollerini çalıştır; zorunlu review/check, CODEOWNERS ve deploy korumasını etkinleştir. CodeQL ve periyodik bağımlılık/sır taramasını doğrula.
- Merkezî güvenlik logu, istek ilişkilendirmesi, saklama ve alarm teslimini test et; WAF/bot kurallarını normal akışı bozmayacak şekilde doğrula.
- Hesap/sipariş saklama ve anonimleştirme kararlarını netleştir; retention işini kontrollü çalıştır ve zamanla. Yedek erişimi/saklama ve restore tatbikatını tamamla.
- CSP Report-Only sonuçlarını incele; mevcut sayfa, görsel, harita ve OAuth akışları doğrulandıktan sonra enforce et.
- Tam regresyon, migration ve geri alma kontrollerini tamamla; kart ödemesi kapalı sürümü kontrollü yayınla ve canlı smoke testlerini çalıştır.

**Bitiş koşulu:** ödeme dışındaki önceki aşamalar kabul edilmiş, güvenlik CI kapıları zorunlu, restore/alarmlar çalışıyor ve yayın sonrası kontroller başarılı. İlgili işler: SEC-19, 22, 23, 24, 25, 26, 30.

## Aşama 6 — Gerçek ödeme entegrasyonu (en son)

**Başlama koşulu:** Aşama 1–5 tamamlanmış ve kabul testleri geçmiş olmalı. O zamana kadar gerçek tahsilat, ödeme SDK'sı, canlı ödeme anahtarları ve ödeme webhook geliştirmesi bu plana göre ertelenir. Kritik yeni bir güvenlik açığı bulunursa önce o giderilir.

- Sağlayıcı hesabını, iş gereksinimlerini ve sandbox erişimini doğrula; mevcut ödeme taslağının sağlayıcı tercihini kesinleştir.
- Kalıcı ödeme denemesi ve bekleyen sipariş modeli; sunucudan tutar/para birimi/sipariş eşleştirmesi kur.
- Sağlayıcı tarafında barındırılan ödeme akışını entegre et; uygulamada kart/CVV saklama.
- Webhook imza doğrulaması, zaman/tekrar kullanım kontrolleri ve atomik `paid` geçişini uygula. Tarayıcı dönüş URL'si tek başına ödeme kanıtı sayılmasın.
- Başarısız, iptal, tekrar, sırası bozulmuş ve zaman aşımına uğramış olayları; iade ve uzlaştırma akışını test et.
- Ödeme için gerekli CSP yönlendirme/frame izinlerini dar kapsamda ekle ve yeniden doğrula.
- Sandbox testleri, güvenlik incelemesi ve kontrollü canlı doğrulama sonrası tahsilatı etkinleştir; alarm ve kapatma prosedürünü doğrula.

**Bitiş koşulu:** sahte/tekrarlı callback ödeme oluşturamıyor; yanlış tutar/para birimi reddediliyor; doğrulanmamış ödeme sevkiyat başlatmıyor; iade/uzlaştırma çalışıyor. İlgili işler: SEC-29 ve ödeme yüzeyine özgü SEC-19, 21, 22, 30 tekrar kontrolleri.

## İlk uygulanacak iş

Aşama 1: mevcut Vercel Node 24 ve deployment koruması doğrulandı; Neon runtime rolünün gereğinden geniş olduğu görüldü. Sıradaki canlı adım, ayrı Neon runtime/preview ve üretim yedeği restore doğrulamasıdır. Kullanıcının tamamlayacağı GitHub yönetici bağlantısı ve Resend ayarları doğrulanınca ilgili platform/hesap kabul testleri sürdürülür. Ödeme entegrasyonu bu hazırlıklara dahil değildir.
