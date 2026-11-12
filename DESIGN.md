---
name: Gri Akvaryum
description: Eminönü akvaryum mağazasının ürün kataloğu, rehberleri ve sipariş arayüzü.
colors:
  primary: "#0055b8"
  primary-deep: "#004799"
  navy: "#031d3a"
  background: "#f8fafc"
  surface: "#ffffff"
  foreground: "#0f172a"
  muted: "#475569"
  border: "#e2e8f0"
  subtle: "#f1f5f9"
  warning: "#9a3412"
  warning-bg: "#fff7ed"
  success: "#047857"
  success-bg: "#ecfdf5"
  border-strong: "#cbd5e1"
  info: "#0e7490"
  info-deep: "#155e75"
  info-bg: "#ecfeff"
  info-border: "#a5f3fc"
  success-deep: "#065f46"
  success-hover: "#d1fae5"
  success-border: "#a7f3d0"
  error: "#dc2626"
  error-bg: "#fff7f7"
  count-bg: "#fbbf24"
  ocean-first-paint: "#021526"
  ocean-surface-light: "#589fa9"
  ocean-surface-water: "#145268"
  ocean-water-mid: "#0a364b"
  ocean-water-top: "#08364c"
  ocean-water-deep: "#041e33"
  ocean-abyss: "#010e1c"
  ocean-text: "#edfbff"
  ocean-surface-ripple: "#a6e8e548"
  ocean-ray-soft: "#c2ffff09"
  ocean-ray-mid: "#a0e8eb15"
  ocean-ray-bright: "#9df2f21a"
  ocean-ray-faint: "#c3fbff0b"
  ocean-floor-ripple: "#74c5d9"
  ocean-vignette: "#010b18a6"
  ocean-creature-light: "#7ce3ff29"
  ocean-particle: "#b9ecf1"
  ocean-particle-glow: "#9be6ef66"
  ocean-logo-light: "#00c7e62b"
  ocean-wordmark-light: "#6ecbdf30"
  ocean-caret: "#7ee9ee"
  ocean-skip: "#e0f1f5"
  ocean-focus: "#a5edf4"
  on-dark-muted: "#cbd5e1"
  ocean-loader-border: "#98e8f138"
  ocean-loader-bg: "#031c3159"
  ocean-loader-shadow: "#01111f66"
  ocean-loader-light: "#39cad00a"
  ocean-loader-fill-start: "#42b7d315"
  ocean-loader-fill-end: "#65e5ee40"
  ocean-bubble-border: "#a7f3ffb3"
  ocean-bubble-highlight: "#efffffbd"
  ocean-bubble-mid: "#7ce7f13d"
  ocean-bubble-shade: "#30b1ce30"
  ocean-bubble-edge: "#b4f7ff80"
  ocean-bubble-glow: "#6ee7ed40"
  ocean-bubble-inner-light: "#d6fbff66"
  ocean-bubble-reflection: "#e9ffff"
typography:
  body:
    fontSize: "16px"
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
  input:
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
    fontSize: "16px"
  metadata:
    fontSize: "12px"
  small-body:
    fontSize: "14px"
  lead:
    fontSize: "18px"
  card-title:
    fontSize: "20px"
  dialog-title:
    fontSize: "24px"
  compact-headline:
    fontSize: "28px"
  page-title:
    fontSize: "36px"
  display:
    fontSize: "64px"
  large-headline:
    fontSize: "48px"
  section-title:
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
rounded:
  small: "8px"
  surface: "12px"
  dialog: "16px"
  pill: "999px"
spacing:
  tight: "8px"
  group: "16px"
  container: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
---

# Gri Akvaryum tasarım sistemi

## Overview

Kaynak, kullanıcının Gri Akvaryum prototipi ve çalışan mağaza arayüzüdür. Lacivert/mavi, Inter ve açık yüzeyler korunur. Gerçek mağaza fotoğrafları, ürün verisi ve uzman iletişimi kimliği taşır. Bu belge yeni bir marka yönü önermez; uygulanmış sistemi kaydeder.

## Colors

Ana tokenlar `app/storefront.css` içindedir. Ana eylemler `--accent`, ikincil metin `--muted`, yüzeyler `--surface` ve `--background` kullanır. Küçük metin kontrastı en az 4.5:1 olmalıdır; opacity ile metin soldurulmaz. Açık tema aktif üründür; bir karanlık tema kontrolü sunulmaz.

## Typography

Inter Latin ve Latin Extended dosyaları yerelden sunulur; iki dosya tek font ailesidir. Girdi metni 16px; küçük ürün bilgileri en az 12px. Ürün isimleri katalogdan geldiği şekliyle korunur. Fiyatlar Türkçe yerelleştirmeyle, tabular sayılarla gösterilir. Metin büyütmede içerik yeniden akmalıdır.

## Layout

Sayfa, üst menü, iletişim şeridi ve altbilgi ortak `--store-page-width` (1480px) genişliğini kullanır. Ortak `--store-gutter` kenar boşluğu masaüstünde 24px, 640px ve altında 16px'tir. Giriş formları ve uzun metinlerin okuma genişliği içeride korunur. Mobil ürün listesi iki sütundur. Katalog filtreleri mobilde açılır paneldedir. 1100px ve altında ana gezinme, ekran kenarlarına hizalı açılır menüde sunulur; menü yüksekliği görünür ekran alanıyla sınırlanır. Ana/alt kategoriler aynı seviyede karıştırılmaz.

Görselsiz ürün detayı kompakt bilgi düzeni kullanır. Ürün fotoğrafı veya ölçüsü uydurulmaz. Vitrin stoklu katalog ürünleri arasından, mevcut fotoğraf ve açıklama önceliğiyle seçilir. Görsel URL'leri kısa ömürlü imzalı bağlantılardır; `unoptimized` kullanımı bu URL sözleşmesiyle değerlendirilmelidir.

## Elevation & Depth

Yüzeyler beyaz veya açık gri, ince çizgilerle ayrılır. `glass` sınıfı geriye uyumlu bir isimdir; mağaza yüzeyinde blur uygulamaz. Ürün hover gölgesi düşük yoğunlukludur. Yeni dekoratif glow veya gradyan metin eklenmez.

## Shapes

Yüzey köşeleri `--store-radius` (12px), küçük kontroller `--store-radius-small` (8px). Dairesel biçimler küçük durum ve puan kontrolleri içindir. Fotoğraf seçicilerinin tıklanabilir alanı 44×44px'tir.

## Components

- Formlarda görünür label ve input ID eşleşir; hata ID'leri `aria-describedby` ile bağlanır. Sonuçlar status/alert veya bilinçli odak aktarımıyla duyurulur.
- Yıldız puanı gerçek radyo kontrolleridir; seçili değer, klavye ve odak durumu erişilebilirdir.
- Arama modalında ok tuşları gerçek sonuç düğmelerine odak taşır. Ağ hatası boş sonuç değildir; sorgu korunarak tekrar denenir.
- Dialoglar Tab/Shift+Tab ve Escape destekler. Gövde kaydırması kapatıldığında önceki değer geri yüklenir.
- Sepet localStorage değişikliklerini sekmeler arasında izler; bozuk kayıtlar güvenli boş duruma döner. Sipariş tekrarlarında aynı requestId kullanılır.
- Mevcut sipariş yolu mağaza onaylı ve ödemesizdir. Entegrasyon hazır olmadan kart tahsilatı vaat edilmez.
- Azaltılmış hareket tercihi bileşen bazında uygulanır; tüm animasyonları 0.01ms'e indiren genel kural kullanılmaz. OceanSplash ayrı bileşenin kendi atlama/azaltılmış hareket davranışını kullanır.

## Do's and Don'ts

- Do: Gerçek mağaza ve ürün verisini kullan; eksik bilgiyi açıkça belirt.
- Do: Mevcut prototipin Inter ve lacivert/mavi kimliğini koru.
- Do: Normal, hata, boş, yükleniyor, seçili ve devre dışı durumları birlikte doğrula.
- Don't: Fotoğrafı olmayan ürüne temsili fotoğrafı gerçek ürün gibi bağlama.
- Don't: Toplamı bilinmeyen teslimat maliyetini kesin fiyat olarak sunma.
- Don't: Taşan içeriği `overflow-x:hidden` ile saklayarak testten geçirme.

## Palet ve ölçek bakımı

Mağaza metin ölçeği 12, 14, 16, 18, 20, 24, 28, 30, 36, 48 ve 64px rollerinden oluşur. 10–11px yardımcı metinler 12px'e yükseltildi; birbirine yakın ara boyutlar ortak rollere toplandı. Yüzey ve kontrol köşeleri 8, 12 ve 16px; rozetler 999px, gerçek daireler yüzde yarıçap kullanır.

Bilgi alanları `--store-info*`, başarı alanları `--store-success*`, hata alanları `--store-error*` ailesini kullanır. `count-bg` sepet sayacı içindir; normal gövde metninin arka planı değildir. Nötr ton ve mavi ton dizileri sidecar içinde mevcut kaynak değerleriyle kaydedilir.

### Okyanus açılışı

Kullanıcının istediği sualtı sahnesi ayrı bir görsel yüzeydir. `app/ocean-entry.css` içindeki `--ocean-*` paleti ilk kare ile `OceanSplash.module.css` arasında paylaşılır. `water-*` ve `abyss` su derinliğini; `surface-*`, `ray-*` ve `floor-ripple` ışığı; `loader-*` ve `bubble-*` logo altındaki baloncuk yükleme çubuğunu; `text`, `skip` ve `focus` gerçek arayüz metnini ve odağı tanımlar. Saydam renkler ışık katmanlarının alpha değerleridir, mağaza metin renkleri değildir. Bu değerler dosya veya kural dışlama listesiyle gizlenmez. Açılışın atlama, oturumda bir kez gösterme ve azaltılmış hareket davranışları korunur.

Koyu altbilgide `--store-on-dark-muted` kullanılır; açık yüzeyin ikon rengi koyu zemindeki metne taşınmaz. Açılıştaki dönüşüm efekti kaldırıldığı için kullanılmayan morph/caret palet değerleri de temizlenmiştir.
