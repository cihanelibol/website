# Gri Akvaryum mağaza tasarımı

Kaynak: Kullanıcının sağladığı “Gri Akvaryum - Prototip.html”.

## Tasarım

- 1280 px içerik alanı, masaüstünde 24 px ve küçük mobilde 16 px kenar boşluğu.
- Inter değişken fontu yerelden sunulur; Türkçe karakterler için latin-ext dosyası dahildir.
- Lacivert `#031d3a`, ana mavi `#0055b8`, metin `#0f172a`, zemin `#f8fafc`, çizgiler `#e2e8f0`.
- Prototipteki kategori menüsü, mağaza vitrini, kısa yollar, güven alanı, ürün kartları, rehberler, yorum, mağaza ve marka bölümleri uygulandı.
- Ortak başlık, alt bilgi, katalog, ürün detayı, hızlı bakış, sepet ve sipariş formu aynı tasarım sistemini kullanır.
- Mobilde vitrin önce gelir; ürünler iki sütunda, katalog filtreleri açılır panelde sunulur.

## Gerçek veriye uyarlamalar

Kategoriler, sayılar, fiyatlar ve stoklar mevcut EasyTrade bağlantısından gelir. Prototipin örnek sipariş geçmişi, kargo eşiği ve ücretleri kullanılmaz; mevcut sipariş koşulları korunur. Tekrar sipariş alanı gerçek hesap geçmişine bağlanır. Katalogda fotoğrafı olmayan ürünler nötr bir görsel alanıyla belirtilir. Mağaza fotoğrafları, iletişim bilgileri, marka görselleri ve mevcut müşteri yorumu kullanılır.

Prototipin örnek balık uyumluluğu verileri gerçek ürünlere varsayımla uygulanmaz. Canlı balık seçimi için gerçek uzman iletişimine yönlendirilir. Yeni ödeme veya stok bildirimi servisi eklenmedi.

## Erişilebilirlik ve etkileşim

İçeriğe atlama bağlantısı, görünür klavye odağı, yerel modal dialoglar, Tab/Shift+Tab çevrimi, Escape ile kapatma, azaltılmış hareket desteği, stok sınırında devre dışı kalan kontroller ve teslimat formunda etiket/hata ilişkileri bulunur. Arama ve hızlı bakış ürün detayına bağlanır. Sepet mevcut localStorage durumunu korur.

## Kontrol

`npm run build` ve değiştirilen mağaza dosyalarının ESLint kontrolü kullanılır.

```powershell
npm run dev
python scripts/verify-storefront.py --base-url http://localhost:3000
```

Test Python Playwright gerektirir; ayrı tarayıcı profili kullanır. Sipariş veya ödeme göndermez. Ana sayfayı 320, 390, 768, 1024, 1280, 1440 px genişliklerde; katalog, ürün detayı ve sepeti masaüstü/mobilde kontrol eder. Arama, kategori/stok/fiyat filtreleri, hızlı bakış, klavye odağı, stok sınırı, sepet kalıcılığı, teslimat alan doğrulaması, ödeme adımına geçiş ve boş durumlar dahil 13 kontrol içerir. Sonuç ve ekran görüntüleri `.gstack/storefront-qa/` altında tutulur.

Depo genelindeki `npm run lint`, eski `app/admin/page.tsx`, `components/Sections.tsx`, `components/cart/CartProvider.tsx` ve `lib/storage.ts` hataları nedeniyle henüz temiz değildir. Yeni mağaza bileşenlerinin hedefli lint kontrolü temizdir. Gerçek ödeme tahsilatı ve sipariş gönderimi bu tasarım kontrolünün kapsamına alınmadı.
