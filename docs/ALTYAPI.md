# Gri Akvaryum — Site Altyapı Rehberi

griakvaryum.com sitesinin kodu, veritabanı ve yayını üç ayrı serviste durur.
Üçü de tek hesapla yönetilir: **griakvaryum@gmail.com**

## Bir bakışta

| Ne | Nerede | Adres |
|---|---|---|
| Kod (sitenin kaynağı) | GitHub | github.com/griakvaryu/website |
| Veritabanı (üyeler, yorumlar) | Neon | console.neon.tech |
| Yayın / Hosting (sitenin kendisi) | Vercel | vercel.com |

Üç serviste de giriş hesabı: **griakvaryum@gmail.com**

## 1. GitHub — Kod

Sitenin bütün kaynak kodu GitHub'daki `griakvaryu/website` deposunda saklanır.
Yapılan her değişikliğin tarihi ve içeriği burada kayıtlıdır; istenirse herhangi
bir eski sürüme geri dönülebilir. Kodun güvenli yedeği burasıdır.

- Depo: https://github.com/griakvaryu/website
- Ana dal: `main` — bu dala gönderilen her değişiklik siteyi otomatik günceller (aşağıya bakın).

## 2. Neon — Veritabanı

Sitede oluşan **canlı veriler** Neon'daki Postgres veritabanında tutulur:

- Üye kayıtları (ad, e-posta, şifrelenmiş parola, izin onayları)
- Ürün yorumları ve puanlar

Veritabanı Avrupa'da (AWS Frankfurt, `eu-central-1`) barınır. Parolalar düz metin
olarak değil, geri döndürülemez şifreleme (scrypt) ile saklanır.

- Panel: https://console.neon.tech
- Proje veritabanı: `neondb` — tablo: `json_store`

Not: Ürün listesi ve fiyatlar veritabanında değildir; EasyTrade Dijital Katalog'dan
canlı olarak çekilir. Ürün/fiyat güncellemeleri EasyTrade panelinden yapılır.

## 3. Vercel — Yayın (Hosting)

Ziyaretçilerin gördüğü site Vercel üzerinde çalışır. Vercel, GitHub'daki koda
bağlıdır: `main` dalına yeni kod gönderildiğinde Vercel bunu otomatik olarak
derler ve dakikalar içinde yayına alır. Elle "yükleme" yapılmaz.

- Panel: https://vercel.com (griakvaryum@gmail.com ile giriş)
- Alan adı: griakvaryum.com
- Veritabanı bağlantısı Vercel'in ortam değişkenlerinde (`DATABASE_URL`) tanımlıdır.

## Otomatik yayın: GitHub'a push → yeni sürüm

Sitede yapılan her kod değişikliği GitHub'a gönderildiğinde (**push**) süreç
kendiliğinden işler — elle hiçbir şey yapılmaz:

1. Değişiklik GitHub'daki `main` dalına push'lanır.
2. Vercel bunu anında algılar ve **yeni bir sürüm (deployment) otomatik tetiklenir**.
3. Vercel kodu derler; hata yoksa dakikalar içinde griakvaryum.com'da yayına alır.
4. Her push, Vercel panelinde tarihli ayrı bir sürüm olarak listelenir —
   hangi değişikliğin ne zaman yayına girdiği her zaman görülebilir.
5. Derleme hata verirse yayın **güncellenmez**; site son çalışan sürümde kalır,
   ziyaretçi hiçbir kesinti görmez.

Yani "siteyi güncelleme" işlemi = GitHub'a push. Ayrı bir yükleme, FTP veya
panel işlemi yoktur.

## Parçalar nasıl birlikte çalışır?

```
Kod değişikliği → GitHub (main dalı) → Vercel otomatik derler ve yayınlar
                                            │
              Ziyaretçi → griakvaryum.com → Vercel'deki site
                                            ├── Üye / yorum verisi ⇄ Neon
                                            └── Ürün / fiyat ⇄ EasyTrade Katalog
```

## Sık sorulanlar

**Site nasıl güncellenir?**
Kod değişikliği GitHub'a gönderilir; Vercel otomatik yayınlar. Başka işlem gerekmez.

**Ürünler ve fiyatlar nereden değişir?**
EasyTrade Dijital Katalog panelinden. Site katalogdan canlı okur.

**Veriler yedekli mi?**
Kodun tam geçmişi GitHub'dadır. Neon, veritabanının anlık görüntülerini
(point-in-time restore) tutar; gerekirse eski bir ana dönülebilir.

**Bir şey ters giderse?**
Vercel panelinden tek tıkla bir önceki yayına geri dönülebilir (instant rollback).

**Kimin erişimi var?**
Üç servis de griakvaryum@gmail.com hesabına bağlıdır. Bu hesabın güvenliği
(güçlü parola + iki adımlı doğrulama) bütün sistemin güvenliği demektir.

---

*Son güncelleme: 27 Temmuz 2026*
