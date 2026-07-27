import type { Article } from "./types";

export const baslangicArticles: Article[] = [
  {
    slug: "ilk-akvaryum-kurulumu",
    title: "İlk Akvaryum Kurulumu: Adım Adım Tam Rehber",
    description:
      "İlk akvaryumunuzu doğru kurmanın tam yol haritası: tank seçimi, yerleşim, ekipman montajı, döngü süreci ve ilk balıkların eklenmesi.",
    category: "baslangic",
    keywords: [
      "akvaryum kurulumu",
      "ilk akvaryum",
      "akvaryum nasıl kurulur",
      "yeni başlayan akvaryum",
      "akvaryum başlangıç rehberi",
    ],
    updated: "2026-07-27",
    minutes: 12,
    blocks: [
      {
        type: "p",
        text: "İlk akvaryumunuzu kurmak, sualtı dünyasına atılan en heyecanlı adımdır. Doğru planlanmış bir kurulum, hem balıklarınızın uzun ve sağlıklı yaşamasını sağlar hem de sizi ileride çıkabilecek pek çok sorundan kurtarır. Bu rehberde tank seçiminden ilk balığın eklenmesine kadar tüm süreci adım adım anlatıyoruz.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Ne kadar sürer?",
        text: "Fiziksel kurulum bir öğleden sonranızı alır; ancak akvaryumun balık kabul edebilir hâle gelmesi (döngü süreci) 2-4 hafta sürer. Sabır, bu hobinin ilk ve en önemli kuralıdır.",
      },
      { type: "h2", id: "planlama", title: "1. Planlama: Ne İstediğinize Karar Verin" },
      {
        type: "p",
        text: "Kuruluma başlamadan önce nasıl bir akvaryum istediğinizi netleştirin. Tatlı su topluluk akvaryumu mu, bitkili bir doğa akvaryumu mu, yoksa ileride tuzlu su resif akvaryumu mu hedefliyorsunuz? Yeni başlayanlar için en bağışlayıcı seçenek tatlı su topluluk akvaryumudur: ekipman maliyeti düşüktür, balık seçenekleri boldur ve bakım rutini basittir.",
      },
      {
        type: "ul",
        items: [
          "Tatlı su topluluk akvaryumu - başlangıç için ideal, düşük maliyet, dayanıklı türler.",
          "Bitkili (planted) akvaryum - daha fazla ışık ve gübre bilgisi ister, görsel olarak çok tatmin edicidir.",
          "Tür akvaryumu (ör. beta, ciklet) - tek türe odaklı, o türün özel ihtiyaçlarını öğrenmek gerekir.",
          "Tuzlu su / resif - en ileri seviye; önce tatlı suda deneyim kazanmanızı öneririz.",
        ],
      },
      { type: "h2", id: "tank-secimi", title: "2. Tank ve Yer Seçimi" },
      {
        type: "p",
        text: "Yaygın inanışın aksine, büyük akvaryum yeni başlayan için küçük akvaryumdan daha kolaydır. Su hacmi büyüdükçe sıcaklık ve su değerleri daha yavaş değişir; yapacağınız küçük hatalar büyük hacimde tolere edilir. Başlangıç için 60-100 litre aralığı idealdir.",
      },
      {
        type: "ul",
        items: [
          "Akvaryumu direkt güneş ışığı almayan bir yere koyun - güneş, yosun patlamasının bir numaralı sebebidir.",
          "Dolu bir akvaryum litre başına yaklaşık 1,3 kg ağırlığındadır; 100 litrelik tank kurulumla birlikte 130 kg'ı aşar. Mobilyanızın bu yükü taşıyabildiğinden emin olun veya özel akvaryum sehpası kullanın.",
          "Priz ve musluğa yakınlık, haftalık bakımı çok kolaylaştırır.",
          "Kapı yanı, kalorifer üstü gibi titreşimli ve sıcaklığı dalgalanan noktalardan kaçının.",
        ],
      },
      { type: "h2", id: "ekipman", title: "3. Ekipmanları Hazırlayın" },
      {
        type: "p",
        text: "Standart bir tatlı su kurulumu için ihtiyacınız olan temel ekipmanlar: filtre, ısıtıcı, termometre, aydınlatma, taban malzemesi (kum/çakıl), su şartlandırıcı ve test kiti. Ayrıntılı liste ve seçim kriterleri için Yeni Başlayanlar İçin Ekipman Listesi rehberimize göz atın.",
      },
      { type: "h2", id: "kurulum", title: "4. Adım Adım Fiziksel Kurulum" },
      {
        type: "steps",
        items: [
          {
            title: "Akvaryumu yıkayın",
            text: "Yeni tankı sadece temiz suyla durulayın. Asla deterjan veya sabun kullanmayın - kimyasal kalıntılar balıklar için öldürücüdür.",
          },
          {
            title: "Taban malzemesini serin",
            text: "Kum veya çakılı bulanıklık gidene kadar bir kovada yıkayın, sonra 4-6 cm kalınlığında serin. Bitkili akvaryum hedefliyorsanız alta bitki toprağı (soil) koyup üstünü kumla kapatabilirsiniz.",
          },
          {
            title: "Dekor ve ekipmanı yerleştirin",
            text: "Kaya, kütük ve dekorları yerleştirin; filtre ve ısıtıcıyı monte edin ama henüz fişe takmayın. Isıtıcıyı su akışının olduğu bir noktaya, filtre çıkışına yakın konumlandırın.",
          },
          {
            title: "Suyu doldurun",
            text: "Tabana bir tabak koyup suyu tabağın üzerine dökerek doldurun - böylece taban malzemesi dağılmaz. Musluk suyu kullanıyorsanız su şartlandırıcıyı ekleyin.",
          },
          {
            title: "Sistemi çalıştırın",
            text: "Filtre ve ısıtıcıyı çalıştırın, sıcaklığı 24-26°C'ye ayarlayın. Işığı günde 6-8 saat açık kalacak şekilde zamanlayın.",
          },
          {
            title: "Döngüyü başlatın",
            text: "Akvaryum artık çalışıyor ama henüz balığa hazır değil. 2-4 haftalık azot döngüsü sürecini başlatın - ayrıntılar için Akvaryum Döngüsü rehberimizi okuyun.",
          },
        ],
      },
      { type: "h2", id: "dongu", title: "5. Döngü Sürecini Bekleyin" },
      {
        type: "p",
        text: "Yeni kurulan akvaryumda, balık atıklarını zehirli amonyaktan zararsız nitrata çeviren faydalı bakteriler henüz yoktur. Bu bakterilerin filtrede kolonileşmesi 2-4 hafta sürer ve bu sürece 'döngü' (cycling) denir. Döngü tamamlanmadan balık eklemek, yeni başlayanların balık kaybetmesinin en yaygın sebebidir.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "En kritik kural",
        text: "Amonyak ve nitrit değerleri test kitinde 0 çıkmadan asla balık eklemeyin. Bakteri kültürü ürünleri bu süreci ciddi biçimde hızlandırabilir - mağazamızdan temin edebilirsiniz.",
      },
      { type: "h2", id: "ilk-baliklar", title: "6. İlk Balıkları Ekleyin" },
      {
        type: "p",
        text: "Döngü tamamlandıktan sonra balıkları azar azar ekleyin: ilk hafta tank kapasitesinin en fazla üçte biri kadar balık alın, sonraki haftalarda kademeli artırın. Her seferinde az balık eklemek, bakteri kolonisinin artan yüke uyum sağlamasına zaman tanır.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Poşeti yüzdürün",
            text: "Balık poşetini ağzı kapalı hâlde 15-20 dakika akvaryumda yüzdürerek sıcaklık dengelemesi yapın.",
          },
          {
            title: "Su alıştırması yapın",
            text: "Poşeti açıp içine 10 dakikada bir yarım çay bardağı akvaryum suyu ekleyin. 30-40 dakika sonra balık yeni su değerlerine alışmış olur.",
          },
          {
            title: "Balığı aktarın",
            text: "Balığı kepçeyle alıp akvaryuma bırakın. Poşet suyunu akvaryuma boşaltmayın - taşıma suyu amonyak ve olası patojen içerir.",
          },
          {
            title: "İlk günü sakin geçirin",
            text: "İlk gün yem vermeyin, ışığı kısık tutun. Balıkların saklanması ve renklerinin soluk olması normaldir; birkaç güne ortama alışırlar.",
          },
        ],
      },
      { type: "h2", id: "sonraki-adimlar", title: "Sonraki Adımlar" },
      {
        type: "p",
        text: "Tebrikler, akvaryumunuz artık yaşıyor! Bundan sonrası düzenli bakım rutini: haftalık %20-25 su değişimi, ayda iki kez su testi ve doğru yemleme. Haftalık Bakım Rutini rehberimiz, akvaryumunuzu formda tutacak tüm rutini tek sayfada özetliyor.",
      },
    ],
    faq: [
      {
        q: "Akvaryum kurduktan ne kadar sonra balık atabilirim?",
        a: "Azot döngüsü tamamlanmadan - yani amonyak ve nitrit testleri 0 gösterene kadar - balık eklenmemelidir. Bu süreç doğal hâliyle 2-4 hafta sürer; bakteri kültürü ürünleriyle 1 haftaya kadar kısalabilir.",
      },
      {
        q: "Yeni başlayan için kaç litre akvaryum idealdir?",
        a: "60-100 litre aralığı idealdir. Küçük tanklarda su değerleri çok hızlı bozulduğu için küçük akvaryum aslında daha zordur.",
      },
      {
        q: "Akvaryum suyu olarak musluk suyu kullanılır mı?",
        a: "Evet, ancak musluk suyundaki klor mutlaka su şartlandırıcıyla arındırılmalıdır. Şartlandırıcı kullanmadan eklenen klorlu su hem balıklara hem filtredeki faydalı bakterilere zarar verir.",
      },
    ],
    related: ["akvaryum-dongusu", "baslangic-ekipman-listesi", "ilk-baliklar", "akvaryum-secimi"],
  },
  {
    slug: "akvaryum-dongusu",
    title: "Akvaryum Döngüsü (Cycling) Nedir? Balıksız Döngü Rehberi",
    description:
      "Azot döngüsünün mantığı, balıksız döngü nasıl yapılır, döngü ne kadar sürer ve bakteri kültürü ürünleri nasıl kullanılır - tam rehber.",
    category: "baslangic",
    keywords: [
      "akvaryum döngüsü",
      "cycling",
      "balıksız döngü",
      "azot döngüsü",
      "akvaryum bakterisi",
      "yeni tank sendromu",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "Yeni kurulan bir akvaryumun 'döngüye girmesi', bu hobinin en az bilinen ama en hayati kavramıdır. Yeni başlayanların ilk haftalarda balık kaybetmesinin sebebi neredeyse her zaman döngüsü tamamlanmamış bir tanka balık eklemektir - buna 'yeni tank sendromu' denir. Bu rehber, döngünün ne olduğunu ve nasıl doğru yapılacağını anlatır.",
      },
      { type: "h2", id: "azot-dongusu-nedir", title: "Azot Döngüsü Nedir?" },
      {
        type: "p",
        text: "Balık dışkısı, artık yem ve çürüyen bitki parçaları suda amonyağa dönüşür. Amonyak balıklar için son derece zehirlidir - düşük dozda bile solungaçları yakar. Sağlıklı bir akvaryumda iki grup faydalı bakteri bu zehri zararsız hâle getirir:",
      },
      {
        type: "ul",
        items: [
          "1. grup bakteriler (Nitrosomonas) amonyağı nitrite çevirir. Nitrit de en az amonyak kadar zehirlidir.",
          "2. grup bakteriler (Nitrobacter/Nitrospira) nitriti, ancak yüksek birikimde zararlı olan nitrata çevirir.",
          "Nitrat ise haftalık su değişimleriyle ve bitkiler tarafından tüketilerek sistemden uzaklaştırılır.",
        ],
      },
      {
        type: "p",
        text: "Bu zincire azot döngüsü denir. 'Akvaryumu döngüye sokmak' demek, bu bakterilerin filtre süngerinde ve taban malzemesinde yeterli koloni oluşturmasını sağlamak demektir. Bakteriler görünmezdir ama akvaryumunuzun gerçek filtresi onlardır - filtre cihazı yalnızca bakterilerin evidir.",
      },
      { type: "h2", id: "baliksiz-dongu", title: "Balıksız Döngü Nasıl Yapılır?" },
      {
        type: "p",
        text: "En etik ve en güvenli yöntem balıksız döngüdür: bakterileri beslemek için balık yerine kontrollü bir amonyak kaynağı kullanılır.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Sistemi çalıştırın",
            text: "Filtre ve ısıtıcı 7/24 çalışsın. Bakteriler 24-28°C aralığında en hızlı çoğalır.",
          },
          {
            title: "Amonyak kaynağı ekleyin",
            text: "En pratik yöntem: her gün küçük bir tutam balık yemi atmak. Yem çürüdükçe amonyak üretir. Alternatif olarak saf amonyak çözeltisi (2-4 ppm hedefiyle) kullanılabilir.",
          },
          {
            title: "Bakteri kültürü ekleyin",
            text: "Şişe bakteri ürünleri (bakteri kültürü/starter) döngüyü haftalarca kısaltır. Kullanım dozunu ürün etiketine göre uygulayın.",
          },
          {
            title: "Değerleri takip edin",
            text: "2-3 günde bir amonyak ve nitrit testi yapın. Önce amonyak yükselir, sonra düşerken nitrit yükselir, en sonunda ikisi de sıfırlanır ve nitrat görünmeye başlar.",
          },
          {
            title: "Döngü tamam",
            text: "Amonyak ve nitrit üst üste birkaç gün 0 ppm, nitrat ölçülebilir seviyedeyse döngü tamamlanmıştır. Balık eklemeden önce %30-50 su değişimi yaparak nitratı düşürün.",
          },
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Döngüyü hızlandıran hile",
        text: "Çalışan sağlıklı bir akvaryumdan alınmış bir parça filtre süngeri veya bir avuç taban çakılı, hazır bakteri kolonisi taşıdığı için döngüyü günler mertebesine indirebilir. Mağazamızdan olgun sünger konusunda destek isteyebilirsiniz.",
      },
      { type: "h2", id: "sure", title: "Döngü Ne Kadar Sürer?" },
      {
        type: "table",
        headers: ["Yöntem", "Tahmini Süre"],
        rows: [
          ["Hiçbir destek olmadan doğal döngü", "3-6 hafta"],
          ["Şişe bakteri kültürüyle", "1-2 hafta"],
          ["Olgun filtre süngeri + bakteri kültürüyle", "3-7 gün"],
        ],
      },
      { type: "h2", id: "dongu-sonrasi", title: "Döngü Sonrası Nelere Dikkat Edilmeli?" },
      {
        type: "ul",
        items: [
          "Balıkları kademeli ekleyin - her yeni balık, bakteri kolonisinin büyümesi gereken ek yük demektir.",
          "Filtre süngerini asla musluk suyuyla yıkamayın; kloru bakterileri öldürür. Temizliği her zaman akvaryumdan aldığınız suda yapın.",
          "Antibiyotik/ilaç tedavilerinin bazıları bakteri kolonisini de vurur - ilaç kullanımında değerleri yakından izleyin.",
          "Uzun elektrik kesintilerinde filtre içindeki bakteriler oksijensizlikten ölebilir; kesinti sonrası birkaç gün su değerlerini kontrol edin.",
        ],
      },
    ],
    faq: [
      {
        q: "Döngü sırasında su bulanıklaştı, normal mi?",
        a: "Evet. Süt beyazı bulanıklık, bakteri patlamasının (bacterial bloom) işaretidir ve döngünün doğal bir parçasıdır. Birkaç gün içinde kendiliğinden berraklaşır; su değişimi yapmanıza gerek yoktur.",
      },
      {
        q: "Balıkla döngü yapılabilir mi?",
        a: "Yapılabilir ama önerilmez - balıklar haftalarca amonyak ve nitrit stresine maruz kalır. Mecbursanız çok dayanıklı 1-2 balıkla, sık su değişimi yaparak ilerleyin.",
      },
      {
        q: "Döngü bittikten sonra tekrar bozulur mu?",
        a: "Aşırı yemleme, filtrenin klorlu suyla yıkanması, ilaç kullanımı veya birden çok fazla balık eklenmesi 'mini döngü' denen geçici bozulmalara yol açabilir. Amonyak/nitrit yükselirse su değişimiyle müdahale edin.",
      },
    ],
    related: ["ilk-akvaryum-kurulumu", "azot-dongusu", "su-testleri", "su-sartlandiricilar"],
  },
  {
    slug: "akvaryum-secimi",
    title: "Hangi Akvaryumu Almalıyım? Boyut, Cam ve Yer Seçimi",
    description:
      "Akvaryum boyutu nasıl seçilir? Litre hesabı, cam kalınlığı, kavisli-düz cam farkı, sehpa gereksinimleri ve yerleşim önerileri.",
    category: "baslangic",
    keywords: [
      "akvaryum seçimi",
      "akvaryum boyutları",
      "kaç litre akvaryum",
      "akvaryum camı",
      "akvaryum sehpası",
    ],
    updated: "2026-07-27",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Akvaryum seçimi, hobinin en kalıcı kararıdır: filtre değiştirilir, balık eklenir çıkarılır ama tank yıllarca aynı kalır. Bu rehber; boyut, cam tipi, form ve yerleşim kararlarını doğru vermenize yardımcı olur.",
      },
      { type: "h2", id: "boyut", title: "Boyut: Büyük Tank, Kolay Tank" },
      {
        type: "p",
        text: "Yeni başlayanların en sık yaptığı hata 'önce küçükle deneyeyim' yaklaşımıdır. Küçük hacimde su değerleri çok hızlı bozulur: 20 litrelik bir tankta unutulan bir yemleme suyu birkaç saatte kirletir, 100 litrede aynı hata fark bile edilmez. Bütçeniz ve alanınız elverdiğince büyük başlayın.",
      },
      {
        type: "table",
        caption: "Boyuta göre uygunluk",
        headers: ["Hacim", "Kimin için", "Notlar"],
        rows: [
          ["20-40 L", "Beta, karides, nano tank", "Deneyim ister; su değerleri hızlı bozulur"],
          ["60-100 L", "İlk topluluk akvaryumu - önerilen", "Bağışlayıcı hacim, geniş tür seçeneği"],
          ["100-200 L", "Ciddi hobiciler", "Melek, gurami gibi orta boy türler mümkün"],
          ["200 L+", "Büyük türler, resif", "Ciklet, discus, tuzlu su kurulumları"],
        ],
      },
      { type: "h2", id: "cam", title: "Cam Tipi ve Kalınlık" },
      {
        type: "ul",
        items: [
          "Düz camlı klasik dikdörtgen tanklar en sağlıklı görüş açısını verir ve ekipman montajı en kolay olandır.",
          "Kavisli (oval/panoramik) camlar görüntüyü kırar ve balıkları olduğundan farklı boyutta gösterir; temizlik aparatları kavise tam oturmaz.",
          "60 cm'e kadar tanklarda 5-6 mm, 80-100 cm tanklarda 8 mm, daha büyüklerde 10-12 mm cam kalınlığı standarttır. Hazır markalı tanklarda bu hesap yapılmıştır.",
          "Ultra şeffaf (low iron / optiwhite) cam, yeşilimsi cam tonunu ortadan kaldırır - bitkili ve resif akvaryumlarında fark yaratır, fiyatı daha yüksektir.",
        ],
      },
      { type: "h2", id: "sehpa", title: "Sehpa ve Zemin" },
      {
        type: "p",
        text: "Dolu akvaryum ağırlığı kabaca: litre × 1,3 kg (su + cam + taban + dekor). 100 litrelik bir sistem 130-150 kg eder. Sıradan TV ünitesi ve kitaplıklar bu yük için tasarlanmamıştır; zamanla esner ve cam çatlamasına yol açar. Tam düz, teraziyle kontrol edilmiş bir yüzey şarttır - tanka özel üretilmiş akvaryum sehpaları en güvenli seçimdir. Tank ile sehpa arasına strafor veya özel mat koymak, küçük yüzey pürüzlerinin cama nokta yükü bindirmesini engeller.",
      },
      { type: "h2", id: "yerlesim", title: "Akvaryum Nereye Konmalı?" },
      {
        type: "ul",
        items: [
          "Direkt güneş almayan bir duvar kenarı ideal - güneş ışığı kontrolsüz yosun büyümesinin baş nedenidir.",
          "Kalorifer, klima ve soba yakınından uzak durun; ortam sıcaklığındaki dalgalanma su sıcaklığını oynatır.",
          "Sık kapı çarpması ve titreşim olan noktalar balıkları strese sokar.",
          "Elektrik prizine ve su kaynağına yakınlık, haftalık bakımı ciddi kolaylaştırır.",
          "Zeminin taşıma kapasitesini büyük tanklarda (300 L+) mutlaka değerlendirin.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Satın almadan önce",
        text: "Mağazamıza gelin, hedeflediğiniz balık türlerini söyleyin - türün yetişkin boyuna ve davranışına göre en doğru tank boyutunu birlikte belirleyelim.",
      },
    ],
    faq: [
      {
        q: "Yuvarlak fanus akvaryum balık için uygun mu?",
        a: "Hayır. Fanuslar filtre ve ısıtıcı montajına uygun değildir, su hacmi çok küçüktür ve kavisli cam balıkta strese yol açar. Japon balığı dahil hiçbir balık için fanus önermiyoruz.",
      },
      {
        q: "Akvaryumun kapağı olmalı mı?",
        a: "Çoğu balık türü ürktüğünde zıplayabilir; kapak hem zıplamayı hem buharlaşmayı ve toz girişini önler. Özellikle beta, mercan gibi zıplamaya meyilli türlerde kapak şarttır.",
      },
    ],
    related: ["ilk-akvaryum-kurulumu", "baslangic-ekipman-listesi", "ilk-baliklar"],
  },
  {
    slug: "baslangic-ekipman-listesi",
    title: "Yeni Başlayanlar İçin Akvaryum Ekipman Listesi",
    description:
      "Akvaryum için hangi ekipmanlar şart, hangileri opsiyonel? Filtre, ısıtıcı, aydınlatma, test kiti ve bakım aletleri - eksiksiz alışveriş listesi.",
    category: "baslangic",
    keywords: [
      "akvaryum ekipmanları",
      "akvaryum malzemeleri",
      "akvaryum filtresi",
      "akvaryum ısıtıcısı",
      "akvaryum alışveriş listesi",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Akvaryum vitrininin önünde 'bunlardan hangisi gerçekten gerekli?' diye düşünüyorsanız bu liste sizin için. Ekipmanları 'şart', 'şiddetle önerilen' ve 'opsiyonel' olarak ayırdık; her kalemin ne işe yaradığını ve seçerken nelere bakmanız gerektiğini açıkladık.",
      },
      { type: "h2", id: "sart-olanlar", title: "Olmazsa Olmazlar" },
      {
        type: "table",
        headers: ["Ekipman", "Görevi", "Seçim kriteri"],
        rows: [
          [
            "Filtre",
            "Suyu mekanik + biyolojik olarak temizler; faydalı bakterilerin evidir",
            "Saatte tank hacminin 4-6 katını devirmeli (100 L tank → 400-600 L/s filtre)",
          ],
          [
            "Isıtıcı",
            "Tropikal balıklar için suyu 24-27°C'de sabit tutar",
            "Litre başına ~1 watt (100 L → 100 W); termostatlı model şart",
          ],
          [
            "Termometre",
            "Isıtıcının doğru çalıştığını bağımsız doğrular",
            "Cam veya dijital; ısıtıcının kendi göstergesine güvenmeyin",
          ],
          [
            "Su şartlandırıcı",
            "Musluk suyundaki klor ve ağır metalleri nötralize eder",
            "Her su değişiminde kullanılır; büyük şişe daha ekonomik",
          ],
          [
            "Test kiti",
            "Amonyak, nitrit, nitrat ve pH ölçümü",
            "Damla test kitleri şerit testlerden çok daha hassastır",
          ],
          [
            "Taban malzemesi",
            "Bakteri yüzeyi + doğal görünüm; bitkiler için besin ortamı",
            "1-3 mm kum/ince çakıl çoğu kurulum için ideal",
          ],
        ],
      },
      { type: "h2", id: "onerilenler", title: "Şiddetle Önerilenler" },
      {
        type: "ul",
        items: [
          "Aydınlatma - çoğu hazır tankta vardır; ayrı alıyorsanız LED armatürler ekonomi ve ömür açısından floresana açık ara üstündür. Zamanlayıcı prizle günde 6-8 saate sabitleyin.",
          "Sifon hortumu - taban temizliği ve su değişiminin ana aracı. Elle başlatmalı basit modeller yeterlidir.",
          "Kepçe - balık transferi ve artık toplama için. Yumuşak fileli olanlar yüzgeçlere zarar vermez.",
          "Kova (sadece akvaryuma özel) - deterjan görmüş kova kullanmayın; akvaryum işleri için ayrı bir kova edinin.",
          "Cam sileceği/kazıyıcı - mıknatıslı modeller elinizi ıslatmadan haftalık cam temizliği sağlar.",
          "Bakteri kültürü - kurulumda döngüyü hızlandırır, filtre temizliği sonrası koloniyi destekler.",
        ],
      },
      { type: "h2", id: "opsiyonel", title: "Opsiyoneller" },
      {
        type: "ul",
        items: [
          "Hava motoru ve taş - filtre yüzeyi yeterince hareketlendiriyorsa şart değildir; sıcak yaz günlerinde ve kalabalık tanklarda ekstra güvence sağlar.",
          "Otomatik yemleme makinesi - tatile çıkanlar için birebir.",
          "CO2 sistemi - yalnızca yoğun bitkili kurulumlar için gereklidir.",
          "UV sterilizatör - inatçı yeşil su ve patojen kontrolünde kullanılır; standart kurulumda gerekmez.",
          "Karantina tankı - birden fazla akvaryumu olanlar ve hassas tür besleyenler için değerli bir yatırım.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Bütçe ipucu",
        text: "Tasarrufu dekordan yapın, filtreden yapmayın. Filtre akvaryumun kalbidir - bir üst kapasite filtre almak her zaman doğru yatırımdır. Mağazamızda tank hacminize uygun filtre seçiminde yardımcı olmaktan memnuniyet duyarız.",
      },
    ],
    faq: [
      {
        q: "İç filtre mi dış filtre mi almalıyım?",
        a: "100 litreye kadar tanklarda kaliteli bir iç filtre yeterlidir. Daha büyük hacimlerde ve yoğun stoklu tanklarda dış filtreler hem daha büyük bakteri yüzeyi hem daha seyrek bakım avantajı sunar. Ayrıntı için Filtre Rehberi'ne bakın.",
      },
      {
        q: "Işık olmadan akvaryum olur mu?",
        a: "Balıklar için ışık hayati değildir ama gece-gündüz ritmi sağlar ve tankı izlenebilir kılar. Canlı bitki varsa aydınlatma zorunludur.",
      },
    ],
    related: ["ilk-akvaryum-kurulumu", "filtre-rehberi", "isitici-kullanimi", "aydinlatma-rehberi"],
  },
  {
    slug: "ilk-baliklar",
    title: "İlk Balıklarınızı Seçmek: Yeni Başlayanlar İçin Dayanıklı Türler",
    description:
      "Yeni akvaryum için en uygun balıklar hangileri? Lepistes, plati, moli, zebra tetra ve daha fazlası - uyum tablosu ve stoklama planıyla.",
    category: "baslangic",
    keywords: [
      "akvaryum balığı önerisi",
      "yeni başlayan balıkları",
      "dayanıklı akvaryum balıkları",
      "lepistes bakımı",
      "topluluk akvaryumu balıkları",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "İlk balık seçimi, akvaryum yolculuğunuzun keyfini belirler. Doğru türlerle başlarsanız balıklarınız küçük hataları tolere eder, siz de öğrenerek ilerlersiniz. Bu rehberde başlangıç için en uygun türleri, birlikte yaşama uyumlarını ve örnek stoklama planlarını bulacaksınız.",
      },
      { type: "h2", id: "kriterler", title: "İyi Bir Başlangıç Balığı Neye Benzer?" },
      {
        type: "ul",
        items: [
          "Su değerlerindeki dalgalanmalara toleranslıdır.",
          "Barışçıldır; topluluk tankında sorun çıkarmaz.",
          "Yetişkin boyu tankınıza uygundur (balıklar yavru satılır - yetişkin boyuna göre plan yapın!).",
          "Kuru yem kabul eder, özel beslenme gerektirmez.",
        ],
      },
      { type: "h2", id: "onerilen-turler", title: "Önerilen Türler" },
      {
        type: "table",
        caption: "Başlangıç dostu türler ve temel ihtiyaçları",
        headers: ["Tür", "Yetişkin boy", "Grup", "Min. tank", "Not"],
        rows: [
          ["Lepistes", "4-5 cm", "3+ (1 erkek 2 dişi)", "40 L", "Çok hızlı ürer; sadece erkek alarak üremeyi önleyebilirsiniz"],
          ["Plati", "5-6 cm", "3+", "60 L", "Sakin, renk çeşidi bol, çok dayanıklı"],
          ["Moli", "6-10 cm", "3+", "80 L", "Hafif tuzlu suyu sever; biraz büyür"],
          ["Zebra tetra (danio)", "5 cm", "6+", "60 L", "Çok hareketli sürü balığı; üst katmanda yüzer"],
          ["Kiraz çubuk (cherry barb)", "5 cm", "6+", "60 L", "Barışçıl, canlı renkli"],
          ["Koridoras (çöpçü)", "5-7 cm", "4+", "60 L", "Dip temizliğine katkı; batan tablet yem şart"],
          ["Beta (erkek)", "6-7 cm", "Tek", "20 L+", "Tek başına veya dikkatli seçilmiş sakin türlerle"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Bunlarla başlamayın",
        text: "Neon tetra (yeni tanklarda hassastır), discus, çiçek boynuz, Japon balığı (soğuk su + dev tank ister), vatoz ve pangasius gibi akvaryumu aşırı büyüten türler ilk tank için uygun değildir. Japon balığı tropikal balıklarla aynı tankta tutulmamalıdır.",
      },
      { type: "h2", id: "stoklama", title: "Kaç Balık Alabilirim?" },
      {
        type: "p",
        text: "Pratik kural: her 1 cm yetişkin balık boyu için 1-2 litre su. 80 litrelik bir tankta toplam 40-60 cm'lik yetişkin balık yükü rahat taşınır. Sürü balıklarını asla tek veya çift almayın - 6'dan az bireyle sürü balığı sürekli stres yaşar, renkleri solar ve saldırganlaşabilir.",
      },
      { type: "h3", title: "Örnek 80 litre topluluk planı" },
      {
        type: "ul",
        items: [
          "8 × zebra tetra (üst-orta katman, hareket)",
          "6 × kiraz çubuk (orta katman, renk)",
          "5 × koridoras (dip katmanı)",
          "Alternatif: 3 plati + 6 zebra tetra + 4 koridoras",
        ],
      },
      { type: "h2", id: "satin-alma", title: "Balık Satın Alırken Nelere Bakmalı?" },
      {
        type: "ul",
        items: [
          "Yüzgeçler açık ve hasarsız, gözler berrak olmalı.",
          "Balık aktif yüzmeli; köşede hareketsiz duran veya yüzeyde hava yutmaya çalışan bireyleri almayın.",
          "Vücutta beyaz benek, pamuksu oluşum veya yara olmamalı.",
          "Aynı tanktaki diğer balıklar da sağlıklı görünmeli - hasta tanktan sağlıklı görünen balık almak risklidir.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Canlı balık garantisi",
        text: "Gri Akvaryum'dan aldığınız balıklar özel oksijenli paketlerle teslim edilir; teslimatta yaşanan kayıplarda koşulsuz değişim garantimiz vardır. Tür uyumu konusunda emin olmadığınız her kombinasyonu satın almadan önce bize sorabilirsiniz.",
      },
    ],
    faq: [
      {
        q: "Balıkları eve getirince ne yapmalıyım?",
        a: "Poşeti 15-20 dakika akvaryumda yüzdürün, ardından poşete kademeli olarak akvaryum suyu ekleyerek 30-40 dakikada alıştırma yapın. Balığı kepçeyle aktarın; poşet suyunu akvaryuma dökmeyin.",
      },
      {
        q: "Beta balığı topluluk tankına konur mu?",
        a: "Erkek betalar birbirine ve yüzgeci uzun/parlak balıklara (lepistes gibi) saldırır. Sakin, kısa yüzgeçli türlerle (koridoras, kiraz çubuk) geniş tankta denenebilir ama en güvenlisi betayı tek beslemektir.",
      },
      {
        q: "Balıklar birbirini kovalıyor, normal mi?",
        a: "Tür içi kısa kovalamalar (özellikle canlı doğuranlarda erkeklerin dişileri kovalaması) normaldir. Sürekli tek bir bireyin hedef alınması, yüzgeç ısırma ve köşeye sıkıştırma varsa uyum sorunu vardır - bize danışın.",
      },
    ],
    related: ["ilk-akvaryum-kurulumu", "yemleme-rehberi", "karantina", "stres-belirtileri"],
  },
];
