# Akvaryum asistanı

Ana sayfadaki “Uzmana sor” düğmesi Gemini destekli sohbeti açar. Mağaza bilgileri
ve soruyla eşleşen en fazla üç yerel rehber sunucu tarafında yanıt bağlamına eklenir.
Güncel fiyat, stok ve kişisel sipariş verileri modele verilmez. WhatsApp bağlantısı
ziyaretçinin mağaza ekibine geçmesini sağlar; mesajlar otomatik gönderilmez.

Panel, görünür sekmede 30 saniye geçirildikten sonra oturum başına bir kez otomatik
açılır. Kullanıcı yazı yazıyorsa veya başka bir iletişim kutusu açıksa bekler.
Elle açılması da oturumda gösterilmiş sayılır. Otomatik açılış mobil klavyeyi açmaz.

## Yapılandırma

Yerel `.env.local` dosyasında `GOOGLE_GENERATIVE_AI_API_KEY` tanımlayın.
`GEMINI_API_KEY` de desteklenir. Anahtar yalnızca sunucuda okunur.
Vercel'e yayınlamadan önce aynı anahtarı projenin uygun ortamına ekleyin.
Varsayılan model `gemini-3.5-flash-lite`; `GEMINI_MODEL` ile değiştirilebilir.
Model kaynağı: https://aistudio.google.com/docs/models/gemini-3.5-flash-lite

Anahtar veya sağlayıcı bağlantısı eksikse API 503 döndürür; arayüz yeniden deneme
ve WhatsApp seçeneklerini gösterir. Otomatik ya da sahte bir AI yanıtı üretilmez.

## Sınırlar

- Yalnızca aynı origin'den gelen JSON POST istekleri kabul edilir.
- İstek başına en fazla 40 KB, son 11 mesaj ve toplam 16.000 karakter.
- Kullanıcı mesajları en fazla 1.000 karakter; çıktı en fazla 2.000 token.
- Mevcut kalıcı rate limiter ile IP başına dakikada 10; toplam saatte 300 istek.
- Sağlayıcı isteği 25 saniyede zaman aşımına uğrar; otomatik tekrar yoktur.
- Sohbet yalnızca bileşenin belleğinde tutulur; sayfa yenilenince veya “Yeni sohbet”
  seçilince silinir. Yanıt üretimi için mesajlar Google'a iletilir; uygulama
  konuşma metinlerini loglamaz ve veritabanında saklamaz.

## Doğrulama

`npm run typecheck` ve `npm test -- tests/assistant.test.ts`.
API testleri sağlayıcıyı taklit eder, ücretli istek yapmaz. Canlı bağlantı ayrıca
geçerli anahtarla tarayıcı üzerinden doğrulanmalıdır.
