import type { Article } from "./types";

export const tatliSuArticles: Article[] = [
  {
    slug: "haftalik-bakim-rutini",
    title: "Haftalık Akvaryum Bakım Rutini: Eksiksiz Kontrol Listesi",
    description:
      "Günlük, haftalık ve aylık akvaryum bakımı nasıl yapılır? Su değişimi, sifonlama, filtre bakımı ve test takvimi - tek sayfada tüm rutin.",
    category: "tatli-su",
    keywords: [
      "akvaryum bakımı",
      "haftalık su değişimi",
      "akvaryum bakım listesi",
      "akvaryum rutini",
      "su değişimi nasıl yapılır",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Sağlıklı bir akvaryumun sırrı büyük müdahaleler değil, küçük ve düzenli alışkanlıklardır. Haftada 30-45 dakikalık bir rutin, akvaryumunuzu yıllarca sorunsuz taşır. Bu sayfayı yer imlerine ekleyin - bakım gününüzün kontrol listesi burada.",
      },
      { type: "h2", id: "gunluk", title: "Her Gün (2 dakika)" },
      {
        type: "ul",
        items: [
          "Balıkları yemleme sırasında gözlemleyin: hepsi yeme geliyor mu, yüzüşleri normal mi, vücutlarında değişiklik var mı?",
          "Termometreye göz atın - sıcaklık hedef aralıkta mı?",
          "Filtre çıkışının normal güçte aktığını kontrol edin.",
          "Ölü balık veya bitki kontrolü yapın; varsa hemen çıkarın.",
        ],
      },
      { type: "h2", id: "haftalik", title: "Her Hafta (30-45 dakika)" },
      {
        type: "steps",
        items: [
          {
            title: "Camları temizleyin",
            text: "Mıknatıslı silecek veya kazıyıcıyla iç camdaki yosun filmini alın. Su değişiminden ÖNCE yapın ki kalkan partiküller sifonla dışarı çıksın.",
          },
          {
            title: "Tabanı sifonlayın",
            text: "Sifon hortumuyla çakıl arasına birikmiş dışkı ve yem artıklarını çekin. Her hafta tabanın farklı bir bölgesini derinlemesine sifonlamak yeterlidir.",
          },
          {
            title: "%20-25 su değiştirin",
            text: "Sifonla çektiğiniz su zaten değişimin bir parçasıdır. Yerine koyacağınız su akvaryumla aynı sıcaklıkta olmalı ve mutlaka şartlandırıcıdan geçmelidir.",
          },
          {
            title: "Bitki bakımı yapın",
            text: "Ölü yaprakları koparın, aşırı uzayan sürgünleri budayın. Sıvı gübre kullanıyorsanız haftalık dozu su değişiminden sonra verin.",
          },
          {
            title: "Ekipmanı gözden geçirin",
            text: "Isıtıcı lambası yanıp sönüyor mu, filtre debisi düştü mü, hava taşı tıkalı mı - 30 saniyelik kontrol büyük arızaları önler.",
          },
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Asla yapmayın",
        text: "Tüm suyu aynı anda değiştirmek, filtreyi musluk suyunda yıkamak ve camı deterjanla silmek - bu üç hata faydalı bakteri kolonisini çökertir ve balıklarınızı riske atar.",
      },
      { type: "h2", id: "aylik", title: "Her Ay" },
      {
        type: "ul",
        items: [
          "Filtre süngerini akvaryumdan aldığınız suyun içinde hafifçe sıkarak yıkayın. Süngerin simsiyah su bırakması normaldir - amaç tıkanıklığı açmak, steril etmek değil.",
          "Su testi yapın: amonyak (0 olmalı), nitrit (0 olmalı), nitrat (<40 ppm), pH (türlerinize uygun aralıkta ve stabil).",
          "Hava taşını ve hortumları kontrol edin; kireçlenmiş hava taşlarını değiştirin.",
          "Isıtıcı ve termometre değerlerini karşılaştırın; sapma 1°C'den fazlaysa termometreyi yenileyin.",
        ],
      },
      { type: "h2", id: "alti-aylik", title: "6 Ayda Bir" },
      {
        type: "ul",
        items: [
          "Filtre motorunun pervane bölmesini (impeller) açıp biriken kirden arındırın - debi düşüşünün en yaygın sebebi budur.",
          "Aşınan filtre süngerlerini kademeli değiştirin: hepsini aynı anda değil, birkaç hafta arayla parça parça yenileyin ki bakteri kolonisi taşınabilsin.",
          "Aydınlatma performansını değerlendirin; eski floresan tüpler yıllık değişim ister, LED'lerde sorun yoksa değişim gerekmez.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Rutinin altın kuralı",
        text: "Az ve sık, çok ve seyrekten iyidir. Haftalık %25 değişim, ayda bir %70 değişimden kıyaslanamayacak kadar sağlıklıdır - istikrar, akvaryumda her şeydir.",
      },
    ],
    faq: [
      {
        q: "Su değişiminde balıkları çıkarmam gerekir mi?",
        a: "Hayır - %20-25'lik kısmi değişimde balıklar tankta kalır. Balık kovalamak sudan daha büyük strestir; balıklar birkaç değişimden sonra sifona alışır.",
      },
      {
        q: "Tatile çıkarken ne yapmalıyım?",
        a: "Sağlıklı yetişkin balıklar 2-3 gün yemsiz sorunsuz kalır. Daha uzun süre için otomatik yemleme makinesi kurun; gitmeden hemen önce su değişimi yapın. Komşuya emanet ediyorsanız günlük porsiyonları tek tek paketleyin - misafir eli her zaman fazla yemler.",
      },
    ],
    related: ["akvaryum-temizligi", "su-testleri", "filtre-rehberi", "yemleme-rehberi"],
  },
  {
    slug: "akvaryum-temizligi",
    title: "Akvaryum Nasıl Temizlenir? Camdan Filtreye Tam Rehber",
    description:
      "Akvaryum temizliği adım adım: cam yüzeyler, taban sifonlama, dekor temizliği, filtre bakımı ve doğru su değişimi teknikleri.",
    category: "tatli-su",
    keywords: [
      "akvaryum temizliği",
      "akvaryum nasıl temizlenir",
      "sifonlama",
      "filtre temizliği",
      "yosun temizleme",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "Akvaryum temizliği doğru yapıldığında balıklar için bayram, yanlış yapıldığında felakettir. Çünkü akvaryum 'temizlenirken' asıl korunması gereken şey görünmez: filtrede ve tabanda yaşayan faydalı bakteri kolonisi. Bu rehber, sistemi bozmadan pırıl pırıl bir akvaryuma ulaşmanın yöntemlerini anlatır.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Altın kural",
        text: "Asla tüm suyu bir anda değiştirmeyin ve asla deterjan, sabun, çamaşır suyu gibi temizlik kimyasalları kullanmayın. En küçük kimyasal kalıntı bile balıklar için öldürücüdür.",
      },
      { type: "h2", id: "cam-temizligi", title: "Cam Yüzeylerin Temizliği" },
      {
        type: "p",
        text: "İç camda oluşan yeşilimsi film tabakası, ışık ve besinle beslenen mikroskobik yosunlardır. Haftalık temizlik bu filmi görünür hâle gelmeden yok eder.",
      },
      {
        type: "ul",
        items: [
          "Mıknatıslı cam sileceği: elinizi ıslatmadan haftalık rutin temizlik için en pratik araç.",
          "Jiletli kazıyıcı: inatçı nokta yosunları (green spot algae) için; akrilik tanklarda jilet yerine plastik ağızlı kazıyıcı kullanın.",
          "Dış cam: hafif nemli mikrofiber bezle silin. Cam temizleme spreylerini tankın kapağı açıkken asla kullanmayın - buharı suya karışır.",
        ],
      },
      { type: "h2", id: "sifonlama", title: "Taban Sifonlama" },
      {
        type: "p",
        text: "Dışkı, artık yem ve çürüyen bitki parçaları taban malzemesinin arasına gömülür ve orada amonyak-nitrat kaynağına dönüşür. Sifon, hem bu birikintiyi çeker hem de çektiği suyla haftalık su değişiminizi yapmış olursunuz - tek taşla iki kuş.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Sifonu başlatın",
            text: "Sifon başlığını suya daldırıp pompalayarak (veya modeline göre birkaç kez aşağı-yukarı sallayarak) akışı başlatın. Hortumun ucu kovada olsun.",
          },
          {
            title: "Çakılı havalandırın",
            text: "Sifon başlığını çakıla saplayın; çakıl başlık içinde yükselip düşerken kir suyla birlikte emilir, çakıl geri düşer. Kum tabanda başlığı kumun 1-2 cm üzerinde gezdirin.",
          },
          {
            title: "Bölge bölge ilerleyin",
            text: "Her hafta tabanın üçte birini derinlemesine sifonlayın. Tüm tabanı aynı gün altüst etmek, tabandaki bakteri dengesini bozabilir.",
          },
          {
            title: "%20-25'te durun",
            text: "Çektiğiniz su toplam hacmin çeyreğini bulduğunda sifonu durdurun. Devamı gelecek haftaya.",
          },
        ],
      },
      { type: "h2", id: "dekor", title: "Dekor ve Kütük Temizliği" },
      {
        type: "ul",
        items: [
          "Yosun tutan taş ve dekorları su değişiminde çıkarıp çektiğiniz akvaryum suyunda fırçalayın - musluk altında değil.",
          "İnatçı yosunlu dekorlar için: 1/20 oranında sirke-su çözeltisinde bekletip bol suyla durulayın ve kurutun.",
          "Canlı bitkili kütükleri mümkünse hiç çıkarmayın; yerinde yumuşak fırçayla temizleyin.",
        ],
      },
      { type: "h2", id: "filtre", title: "Filtre Temizliği: En Hassas Nokta" },
      {
        type: "p",
        text: "Filtre süngeri akvaryumun biyolojik kalbidir. Temizliğin amacı süngeri 'sterilize etmek' değil, sadece debiyi düşüren kaba kiri açmaktır.",
      },
      {
        type: "ul",
        items: [
          "Süngeri her zaman akvaryumdan aldığınız suyun içinde birkaç kez sıkarak yıkayın. Musluk suyundaki klor bakteri kolonisini öldürür.",
          "Filtre temizliğini su değişimiyle aynı güne denk getirin; çektiğiniz su zaten hazır yıkama suyudur.",
          "Ayda bir sünger yıkama çoğu kurulum için yeterlidir. Debi belirgin düşmediyse daha sık ellemeyin.",
          "Biyolojik ortamları (seramik halka, biyo-top) sadece üzerindeki kaba kiri çalkalayacak kadar yıkayın; asla fırçalamayın.",
          "Süngeri değiştirmeniz gerekiyorsa eskisiyle yenisini birkaç hafta birlikte çalıştırın ki koloni yeni süngere taşınsın.",
        ],
      },
      { type: "h2", id: "yeni-su", title: "Yeni Suyun Hazırlanması" },
      {
        type: "ul",
        items: [
          "Eklenecek su akvaryum sıcaklığına yakın olmalı (±1-2°C). Soğuk şoku balıklarda ani strese ve beyaz benek salgınına davetiye çıkarır.",
          "Su şartlandırıcıyı kovadaki suya, akvaryuma dökmeden önce ekleyin.",
          "Suyu yavaşça, dekorların üzerine veya elinize dökerek ekleyin; tabanı kazımasın.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Temizlik ürünleri",
        text: "Sifon, mıknatıslı silecek, şartlandırıcı ve yosun kazıyıcı - tüm temizlik ekipmanlarını mağazamızda bulabilirsiniz. Hangi sifonun tankınıza uygun olduğunu sorun, birlikte seçelim.",
      },
    ],
    faq: [
      {
        q: "Akvaryum ne sıklıkla temizlenmeli?",
        a: "Cam silme + sifonlama + %20-25 su değişimi haftada bir; filtre süngeri yıkama ayda bir. Bu ritim çoğu topluluk akvaryumu için idealdir.",
      },
      {
        q: "Su berrak görünüyor, yine de değiştirmeli miyim?",
        a: "Evet. Nitrat ve çözünmüş organikler gözle görülmez; su kristal berrak olsa bile birikirler. Berraklık temizliğin değil, sadece partikül azlığının göstergesidir.",
      },
      {
        q: "Çöpçü balık varsa temizlik gerekmez mi?",
        a: "Çöpçüler artık yemleri yer ama dışkı da üretirler - sifon ihtiyacını ortadan kaldırmazlar. Hiçbir balık su değişiminin yerini tutmaz.",
      },
    ],
    related: ["haftalik-bakim-rutini", "yosun-sorunlari", "filtre-rehberi", "su-sartlandiricilar"],
  },
  {
    slug: "bitkili-akvaryum",
    title: "Bitkili Akvaryuma Giriş: Substrat, Işık ve Gübre",
    description:
      "Canlı bitkili akvaryum nasıl kurulur? Kolay bitki türleri, bitki toprağı seçimi, aydınlatma süresi, sıvı gübre ve CO2 gereksinimleri.",
    category: "tatli-su",
    keywords: [
      "bitkili akvaryum",
      "akvaryum bitkileri",
      "kolay akvaryum bitkileri",
      "akvaryum bitki toprağı",
      "akvaryum gübresi",
    ],
    updated: "2026-07-27",
    minutes: 10,
    blocks: [
      {
        type: "p",
        text: "Canlı bitkiler akvaryumu bir cam kutudan yaşayan bir ekosisteme dönüştürür: nitratı emer, oksijen üretir, yosunla rekabet eder ve balıklara doğal sığınak sağlar. Üstelik sanıldığı kadar zor değildir - doğru türlerle plastik bitkiden farksız kolaylıkta başlayabilirsiniz.",
      },
      { type: "h2", id: "kolay-bitkiler", title: "Başlangıç İçin En Kolay Bitkiler" },
      {
        type: "table",
        caption: "Düşük ışıkta, CO2'siz yaşayabilen türler",
        headers: ["Bitki", "Konum", "Zorluk", "Not"],
        rows: [
          ["Anubias", "Kütük/kayaya bağlanır", "Çok kolay", "Rizomu toprağa gömmeyin; gölgeyi sever"],
          ["Java yosunu (moss)", "Her yüzeye tutunur", "Çok kolay", "Yavru balıklar için mükemmel sığınak"],
          ["Java eğreltisi (fern)", "Kütük/kayaya bağlanır", "Çok kolay", "Rizom gömülmez; yavaş büyür"],
          ["Vallisneria", "Arka plan, toprağa", "Kolay", "Hızlı uzar, koşucularla çoğalır"],
          ["Amazon kılıcı", "Orta/arka plan", "Kolay", "Kök gübresi (tablet) ister; büyük kalır"],
          ["Cryptocoryne", "Ön/orta plan", "Kolay", "İlk hafta yaprak eritebilir (cryptocoryne erimesi) - normaldir, toparlar"],
          ["Ceratophyllum (tilki kuyruğu)", "Yüzücü/dikili", "Çok kolay", "Nitrat süpürücüsü; çok hızlı büyür"],
        ],
      },
      { type: "h2", id: "substrat", title: "Taban: Kum mu, Bitki Toprağı mı?" },
      {
        type: "ul",
        items: [
          "Anubias, java eğreltisi ve moss gibi bağlanan türler taban malzemesini hiç umursamaz - çakıl da olur, kum da.",
          "Köklü bitkiler (kılıç, vallisneria, cryptocoryne) besinli taban ister. İki yol var: alta bitki toprağı (soil) serip üstünü kumla kapatmak veya normal kum kullanıp köklerin dibine gübre tableti gömmek.",
          "Bitki toprağı (aqua soil) ilk haftalarda suya amonyak salabilir - bitkili tank kurduktan sonra döngü sürecini mutlaka tamamlayın.",
          "Tane kalınlığı 2-3 mm ideal: kökler rahat yayılır, kir yüzeyde kalır.",
        ],
      },
      { type: "h2", id: "isik", title: "Aydınlatma: Süre Watt'tan Önemli" },
      {
        type: "p",
        text: "Bitki büyümesinde ışığın süresi ve düzeni, şiddetinden daha kritiktir. Günde 6-8 saat, her gün aynı saatlerde yanan orta seviye bir LED, düzensiz yakılan güçlü ışıktan çok daha iyi sonuç verir. Işık süresi 10 saati aşarsa bitki değil yosun kazanır.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Zamanlayıcı priz kullanın",
        text: "Birkaç yüz liralık mekanik zamanlayıcı priz, bitkili akvaryumun en yüksek getirili yatırımıdır. Işık ritmi sabitlenince hem bitkiler düzenli büyür hem yosun kontrol altında kalır.",
      },
      { type: "h2", id: "gubre", title: "Gübreleme" },
      {
        type: "ul",
        items: [
          "Sıvı gübre: suda yüzen ve bağlanan bitkiler besini sudan alır; haftalık su değişimi sonrası tek doz sıvı gübre çoğu tank için yeterlidir.",
          "Kök tableti: kılıç ve cryptocoryne gibi kök besleyiciler için 2-3 ayda bir kökün dibine gömülür.",
          "Demir takviyesi: kırmızı yapraklı bitkiler ekstra demir ister; yapraklar soluklaşıyorsa demirli gübreye geçin.",
          "Az balıklı tanklarda gübre daha önemli, kalabalık tanklarda balık atıkları besinin bir kısmını zaten sağlar.",
        ],
      },
      { type: "h2", id: "co2", title: "CO2 Şart mı?" },
      {
        type: "p",
        text: "Hayır - bu sayfadaki tüm türler CO2'siz yaşar. CO2 sistemi, halı bitkileri ve yoğun 'aquascape' kurulumları gibi ileri seviye hedefler için gereklidir. Merak ediyorsanız CO2 Sistemleri rehberimizde basınçlı sistemlerin kurulumunu anlattık.",
      },
      { type: "h2", id: "ekim", title: "Bitkileri Doğru Ekmek" },
      {
        type: "steps",
        items: [
          {
            title: "Hazırlık",
            text: "Saksılı bitkilerin kaya yününü tamamen temizleyin, çürük yaprakları koparın. Sümüklü böcek istilasına karşı bitkiyi durulayın.",
          },
          {
            title: "Ekim",
            text: "Köklü bitkileri cımbızla toprağa gömün; büyüme noktası (tepe sürgünü) açıkta kalsın. Rizomlu türleri (anubias, eğrelti) misina veya yapıştırıcıyla kütüğe bağlayın.",
          },
          {
            title: "İlk haftalar",
            text: "Yeni dikilen bitkilerin birkaç yaprak dökmesi normaldir - suya uyum sağlıyorlar. Sabırlı olun, kesip atmayın.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Bitkiler için hangi balıklar sorun çıkarır?",
        a: "Japon balığı, çoğu büyük ciklet ve bazı barb türleri bitkileri yer veya söker. Topluluk balıklarının (tetra, rasbora, lepistes) hiçbiri bitkiye zarar vermez.",
      },
      {
        q: "Bitki yaprakları sararıyor, neden?",
        a: "Yaygın sebepler: besin eksikliği (özellikle demir ve potasyum), yetersiz ışık süresi veya yeni ortama uyum. Önce ışık süresini 7-8 saate sabitleyin, sonra düzenli gübrelemeye başlayın.",
      },
      {
        q: "Plastik bitki mi canlı bitki mi?",
        a: "Plastik bitki bakım istemez ama suya hiçbir katkısı yoktur. Canlı bitki nitrat emer, oksijen üretir ve yosunla rekabet eder - kolay türlerle başlamak neredeyse hiç ek yük getirmez.",
      },
    ],
    related: ["co2-sistemleri", "aydinlatma-rehberi", "yosun-sorunlari", "ilk-akvaryum-kurulumu"],
  },
  {
    slug: "yosun-sorunlari",
    title: "Akvaryumda Yosun Türleri ve Yosunla Mücadele Rehberi",
    description:
      "Yeşil su, kahverengi yosun, siyah sakal, iplik yosunu - türlerine göre yosun teşhisi, nedenleri ve kalıcı çözüm yöntemleri.",
    category: "tatli-su",
    keywords: [
      "akvaryum yosun",
      "yosun temizleme",
      "siyah sakal yosunu",
      "yeşil su",
      "kahverengi yosun",
      "yosun yiyen balıklar",
    ],
    updated: "2026-07-27",
    minutes: 10,
    blocks: [
      {
        type: "p",
        text: "Her akvaryumda bir miktar yosun olur ve bu tamamen doğaldır. Sorun, yosunun kontrolden çıkmasıdır - bu da her zaman bir dengesizliğin belirtisidir: ya çok ışık, ya çok besin, ya da ikisi birden. Bu rehber yosunu türüne göre teşhis edip kök nedeni çözmenize yardımcı olur.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Temel denklem",
        text: "Yosun = ışık + besin (nitrat/fosfat). Yosunla mücadele daima bu iki değişkenden birini kısmakla başlar. Kazıyıp durmak belirtiyle savaşır; ışık ve besini düzeltmek hastalığı tedavi eder.",
      },
      { type: "h2", id: "turler", title: "Yosun Türleri ve Teşhis" },
      {
        type: "table",
        headers: ["Yosun", "Görünüm", "Ana neden", "Çözüm"],
        rows: [
          [
            "Kahverengi (diyatom)",
            "Cam ve dekorda kahverengi toz tabakası",
            "Yeni kurulmuş tank, silikat fazlası",
            "Kendiliğinden geçer (4-8 hafta); silinerek temizlenir, otocinclus sever",
          ],
          [
            "Yeşil cam yosunu",
            "Camda yeşil film",
            "Normal - her tankta olur",
            "Haftalık mıknatıslı silecek yeterli",
          ],
          [
            "Yeşil su",
            "Su yeşil çorbaya döner",
            "Aşırı ışık + amonyak/besin patlaması",
            "Işığı 3-4 gün tam kapatın, su değişimi; inatçıysa UV sterilizatör",
          ],
          [
            "İplik/saç yosunu",
            "Uzun yeşil iplikler",
            "Besin fazlası + güçlü ışık",
            "Elle/fırçayla sarıp alın, ışık süresini kısın, nitrat-fosfat düşürün",
          ],
          [
            "Siyah sakal (BBA)",
            "Dekor ve yaprak kenarlarında siyah püsküller",
            "Dalgalı CO2, eski ışık, organik birikinti",
            "Etkilenen yaprakları budayın, sifonu sıklaştırın; siyam yosun yiyeni tek doğal avcısıdır",
          ],
          [
            "Mavi-yeşil (siyanobakteri)",
            "Halı gibi kayan, kötü kokulu mavi-yeşil tabaka",
            "Aslında bakteridir; düşük akıntı + organik kirlilik",
            "Elle toplayın, akıntıyı artırın, 3 gün karartma uygulayın",
          ],
        ],
      },
      { type: "h2", id: "onleme", title: "Yosunu Önlemenin 6 Kuralı" },
      {
        type: "ul",
        items: [
          "Işık süresi günde 6-8 saat, zamanlayıcıyla sabit. Akvaryum direkt güneş almamalı.",
          "Haftalık su değişimini aksatmayın - nitrat, yosunun ana gıdasıdır.",
          "Aşırı yemlemeyin; 2-3 dakikada bitmeyen yem yosun gübresidir.",
          "Canlı bitki ekleyin: hızlı büyüyen bitkiler (vallisneria, tilki kuyruğu) besin için yosunla yarışır ve çoğu zaman kazanır.",
          "Sifonlamayla organik birikintiyi azaltın.",
          "Yeni dekor ve bitkileri tanka atmadan durulayın; bazı yosunlar bitkiyle taşınır.",
        ],
      },
      { type: "h2", id: "temizlik-ekibi", title: "Doğal Temizlik Ekibi" },
      {
        type: "ul",
        items: [
          "Otocinclus - cam ve yaprak yosunu için nazik, küçük, bitki dostu; 4-6'lı grup ister.",
          "Siyam yosun yiyen (SAE) - siyah sakal dahil çoğu yosunu yer; 14 cm'e ulaşır, geniş tank ister.",
          "Amano karidesi - iplik yosunuyla mücadelede efsanedir; 5+ grup hâlinde etkilidir.",
          "Neritina salyangozu - cam ve dekor yosununda mükemmeldir; tatlı suda üreyemez, istila yapmaz.",
          "Dikkat: 'çöpçü' diye satılan pleco türleri 30-40 cm'e ulaşır ve büyüyünce yosun yemeyi bırakır - küçük tanklara almayın.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Yosun ilaçları hakkında",
        text: "Kimyasal yosun gidericiler semptomu birkaç haftalığına bastırır ama nedeni çözmez; bazıları bitki ve karideslere zarar verir. Önce ışık-besin dengesini düzeltin; ilaç son çare olsun ve etiket dozunu asla aşmayın.",
      },
    ],
    faq: [
      {
        q: "Yeni kurduğum akvaryumda kahverengi tabaka oluştu, ne yapmalıyım?",
        a: "Bu diyatom (kahverengi yosun) evresidir ve yeni tankların neredeyse tamamında görülür. Tank olgunlaştıkça 4-8 hafta içinde kendiliğinden kaybolur. Silmeniz yeterli; panik gerektirmez.",
      },
      {
        q: "Yosun balıkları tek başına yeterli mi?",
        a: "Hayır. Temizlik ekibi yardımcı kuvvettir; ışık ve besin dengesi bozuksa hiçbir canlı yosun patlamasına yetişemez. Önce dengeyi kurun, ekibi destek olarak ekleyin.",
      },
    ],
    related: ["akvaryum-temizligi", "bitkili-akvaryum", "aydinlatma-rehberi", "su-testleri"],
  },
  {
    slug: "karides-ve-salyangozlar",
    title: "Akvaryum Karidesleri ve Salyangozları: Bakım Rehberi",
    description:
      "Red cherry ve amano karidesi bakımı, karides akvaryumu kurulumu, faydalı salyangoz türleri ve istilacı salyangozlarla mücadele.",
    category: "tatli-su",
    keywords: [
      "akvaryum karidesi",
      "red cherry karides",
      "amano karides",
      "karides bakımı",
      "akvaryum salyangozu",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Karidesler ve salyangozlar akvaryumun sessiz kahramanlarıdır: yosun temizler, artık toplar ve tanka bambaşka bir hareket katarlar. Bu rehber, omurgasızlarla ilk tanışmanız için gereken her şeyi kapsıyor.",
      },
      { type: "h2", id: "karidesler", title: "Popüler Karides Türleri" },
      {
        type: "table",
        headers: ["Tür", "Boy", "Zorluk", "Not"],
        rows: [
          ["Red cherry (neocaridina)", "2-3 cm", "Kolay", "Başlangıç için ideal; tatlı suda kolayca ürer"],
          ["Amano", "4-5 cm", "Kolay", "En iyi yosun yiyici; tatlı suda üremez"],
          ["Kristal (caridina)", "2-2,5 cm", "Zor", "Düşük pH ve yumuşak su ister; ileri seviye"],
          ["Bambu (fan shrimp)", "6-8 cm", "Orta", "Akıntıda süzerek beslenir; barışçıl dev"],
        ],
      },
      { type: "h2", id: "karides-bakimi", title: "Karides Bakımının Temelleri" },
      {
        type: "ul",
        items: [
          "Karidesler bakır bileşiklerine karşı ölümcül derecede hassastır - balık ilaçlarının çoğu bakır içerir; karidesli tankta etiket okumadan ilaç kullanmayın.",
          "Su değerleri istikrarlı olmalı: ani pH ve sıcaklık değişimi karidesleri balıklardan çok daha hızlı vurur. Alıştırmayı damla yöntemiyle (1-2 saat) yapın.",
          "Deri değiştirme (moulting) doğaldır - tankta gördüğünüz şeffaf 'ölü karides' kabuğudur, çıkarmayın; karidesler kalsiyum için kabuğu yer.",
          "Saklanacak yer şarttır: moss, kütük ve karides yuvaları; deri değiştiren karides savunmasızdır.",
          "Yem: yosun ve artıklarla geçinirler ama haftada 2-3 kez batan karides yemi veya haşlanmış sebze (kabak, ıspanak) verin.",
          "Balık seçimine dikkat: melek, gurami ve çoğu ciklet karidesi yem sayar. Küçük tetra ve rasboralarla güvenle yaşarlar.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Karides kolonisi kurmak",
        text: "10-15 red cherry ile başlarsanız birkaç ayda kendi kendini sürdüren bir koloni elde edersiniz. Renk kalitesini korumak için soluk bireyleri ayırmak yeterli.",
      },
      { type: "h2", id: "salyangozlar", title: "Faydalı Salyangozlar" },
      {
        type: "ul",
        items: [
          "Neritina - yosun temizliğinde rakipsiz; tatlı suda üreyemediği için istila riski sıfır.",
          "Elma salyangozu (mystery snail) - büyük, hareketli, sarı-mor renk seçenekleri; artık toplayıcı.",
          "Malezya trompet salyangozu (MTS) - tabanı kazarak havalandırır; gece aktiftir. Aşırı yemlemede hızla çoğalır.",
        ],
      },
      { type: "h2", id: "istila", title: "İstilacı Salyangozla Mücadele" },
      {
        type: "p",
        text: "Bitkilerle tanka giren küçük havuz salyangozları (pond/bladder snail) aşırı çoğalabilir. Salyangoz patlaması neredeyse her zaman aşırı yemlemenin göstergesidir - yem azalınca nüfus kendiliğinden çöker.",
      },
      {
        type: "ul",
        items: [
          "Yemlemeyi azaltın - en kalıcı çözüm budur.",
          "Gece marul/salatalık tuzağı kurun; sabah üzerine toplanan salyangozları alın.",
          "Yeni bitkileri tanka atmadan önce durulayıp kontrol edin.",
          "Kimyasal salyangoz ilaçlarından kaçının - bakır içerir, karides ve diğer omurgasızları da öldürür.",
        ],
      },
    ],
    faq: [
      {
        q: "Karidesler balık yavrularını yer mi?",
        a: "Hayır - karidesler sağlıklı balıklara ve yavrulara saldırmaz; sadece ölü ve ölmekte olan canlıları temizlerler. Tam tersine, birçok balık karides yavrularını yer.",
      },
      {
        q: "Karides tankında ısıtıcı gerekli mi?",
        a: "Neocaridina türleri 18-26°C aralığında yaşayabilir; ev sıcaklığı stabilse ısıtıcısız da olur. Ani dalgalanma olan ortamlarda düşük watt'lı bir ısıtıcı güvence sağlar.",
      },
    ],
    related: ["ilk-baliklar", "yosun-sorunlari", "bitkili-akvaryum", "su-parametreleri"],
  },
];
