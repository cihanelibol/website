Gri Akvaryum & Balık Galerisi

griakvaryum.com — Site Altyapı Rehberi
Sitenin üç ayağı vardır: kod, veritabanı ve yayın. Her biri ayrı bir serviste durur. GitHub deposu cihanelibol hesabında, yayın mevcut Vercel projesindedir.

GitHub hesabı: cihanelibol
GitHub
Kod
Sitenin bütün kaynak kodu burada saklanır. Her değişikliğin tarihi ve içeriği kayıtlıdır; gerekirse herhangi bir eski sürüme geri dönülebilir. Kodun güvenli yedeği burasıdır.

Depo: github.com/cihanelibol/website

Neon
Veritabanı
Sitede oluşan canlı veriler — üye kayıtları ve ürün yorumları — Neon'daki Postgres veritabanında tutulur. Veriler Avrupa'da (Frankfurt) barınır; üye parolaları düz metin olarak değil, geri döndürülemez şifreleme ile saklanır.

Panel: console.neon.tech

Vercel
Yayın · Hosting
Ziyaretçilerin gördüğü site Vercel üzerinde çalışır. Vercel, GitHub'daki koda bağlıdır: yeni kod gönderildiğinde otomatik olarak derler ve dakikalar içinde yayına alır — elle yükleme yapılmaz. Bir sorun olursa tek tıkla bir önceki yayına dönülebilir.

Panel: vercel.com  ·  Alan adı: griakvaryum.com

Otomatik yayın: GitHub'a push → yeni sürüm
Sitede yapılan her kod değişikliği GitHub'a gönderildiğinde (push) süreç kendiliğinden işler — elle hiçbir şey yapılmaz:

Değişiklik GitHub'daki main dalına push'lanır.
Vercel bunu anında algılar ve yeni bir sürüm (deployment) otomatik tetiklenir.
Vercel kodu derler; hata yoksa dakikalar içinde griakvaryum.com'da yayına alır.
Her push, Vercel panelinde tarihli ayrı bir sürüm olarak listelenir — hangi değişikliğin ne zaman yayına girdiği her zaman görülebilir.
Derleme hata verirse yayın güncellenmez; site son çalışan sürümde kalır, ziyaretçi kesinti görmez.
Yani "siteyi güncelleme" işlemi = GitHub'a push. Ayrı bir yükleme, FTP veya panel işlemi yoktur.

Parçalar nasıl birlikte çalışır?
Kod değişikliği ──▶ GitHub ──▶ Vercel otomatik derler ve yayınlar
                                   │
Ziyaretçi ──▶ griakvaryum.com ──▶ Vercel'deki site
                                   ├── Üyeler ve yorumlar  ⇄  Neon veritabanı
                                   └── Ürünler ve fiyatlar ⇄  EasyTrade Katalog
Sık sorulanlar
Site nasıl güncellenir?
Kod değişikliği GitHub'a gönderilir; Vercel bunu otomatik yayınlar. Başka işlem gerekmez.
Ürünler ve fiyatlar nereden değişir?
EasyTrade Dijital Katalog panelinden. Site, katalogdan canlı okur — ürün bilgisi veritabanında ayrıca tutulmaz.
Veriler yedekli mi?
Kodun tam geçmişi GitHub'dadır. Neon, veritabanının geçmiş anlık görüntülerini tutar; gerekirse eski bir ana dönülebilir.
Bir şey ters giderse?
Vercel panelinden tek tıkla bir önceki sürüme geri dönülür; site kesintisi yaşanmaz.
Kimin erişimi var?
Üç servis de griakvaryum@gmail.com hesabına bağlıdır. Bu hesabın güvenliği (güçlü parola + iki adımlı doğrulama) bütün sistemin güvenliği demektir.
