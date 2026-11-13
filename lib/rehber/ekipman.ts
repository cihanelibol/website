import type { Article } from "./types";
import { ekipmanSecimiArticles } from "./ekipman-secimi";

export const ekipmanArticles: Article[] = [
  ...ekipmanSecimiArticles,
  {
    slug: "aydinlatma-rehberi",
    title: "Akvaryum Aydınlatması: LED Seçimi, Süre ve Spektrum",
    description:
      "Akvaryum ışığı kaç saat açık kalmalı? LED armatür seçimi, Kelvin ve spektrum kavramları, bitkili ve resif tankı aydınlatması.",
    category: "ekipman",
    keywords: [
      "akvaryum aydınlatma",
      "akvaryum LED",
      "akvaryum ışığı kaç saat",
      "bitki ışığı",
      "kelvin spektrum",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Aydınlatma; balıklar için gece-gündüz ritmi, bitkiler için gıda, sizin içinse akvaryumun vitrini demektir. Doğru ışık tankı sağlıklı ve muhteşem gösterir; yanlış ışık ya cansız bir görüntü ya da yosun ormanı üretir. Bu rehber süre, güç ve spektrum kararlarını netleştirir.",
      },
      { type: "h2", id: "sure", title: "En Önemli Karar: Süre" },
      {
        type: "ul",
        items: [
          "Standart tank (az bitkili/bitkisiz): günde 6-8 saat.",
          "Yoğun bitkili tank: günde 8-9 saat; yeni kurulumda 6 saatle başlayıp haftalarla artırın.",
          "10+ saat = neredeyse garantili yosun sorunu. Işık, balık için değil sizin izleme saatleriniz için açılır - evde olduğunuz saatlere programlayın.",
          "Zamanlayıcı priz kullanın: her gün aynı saatte açılan ışık, elle 'bugün erken açayım' düzensizliğinden kat kat sağlıklıdır.",
          "Öğle molası (siesta) tekniği: 4 saat açık + 2-3 saat kapalı + 4 saat açık düzeni, hem izleme süresini uzatır hem bazı yosun türlerini baskılar.",
        ],
      },
      { type: "h2", id: "led", title: "Neden LED?" },
      {
        type: "ul",
        items: [
          "Floresan tüplere göre %60-80 daha az elektrik tüketir ve 5-10 kat uzun ömürlüdür.",
          "Işık şiddeti yıllar içinde çok az düşer (floresan 12 ayda belirgin zayıflar ve yıllık değişim ister).",
          "Modern armatürlerde kısılabilirlik, gün doğumu/batımı simülasyonu ve renk kanalı kontrolü standartlaşmıştır.",
          "Eski floresan kaportanız varsa çoğuna LED retrofit tüp takılabilir - bize sorun.",
        ],
      },
      { type: "h2", id: "spektrum", title: "Kelvin ve Spektrum: Hangi Renk Işık?" },
      {
        type: "table",
        headers: ["Kelvin", "Görünüm", "Kullanım"],
        rows: [
          ["4000-5500K", "Sıcak/nötr beyaz", "Doğal gün ışığı görünümü; bitkiler için uygun"],
          ["6500K", "Saf beyaz gün ışığı", "Bitkili tankların altın standardı"],
          ["8000-10000K", "Beyaz-buz mavisi", "Berrak 'kristal' görünüm; tatlı ve tuzlu suda popüler"],
          ["14000-20000K + aktinik mavi", "Yoğun mavi", "Resif tankları - mercan floresanını patlatır ve zooxanthellae'yi besler"],
        ],
      },
      {
        type: "p",
        text: "Bitkiler için tek başına 'bitki ışığı' pazarlamasına gerek yok: 6500K civarı tam spektrum beyaz LED, yaygın bitkilerin tamamını büyütür. Kırmızı-mavi ağırlıklı özel spektrumlar renk doygunluğunu artırır ama zorunlu değildir. Resifte ise mavi ağırlıklı spektrum estetik tercih değil, mercan biyolojisinin gereğidir.",
      },
      { type: "h2", id: "guc", title: "Ne Kadar Güç?" },
      {
        type: "ul",
        items: [
          "Bitkisiz/az bitkili tank: görünüm yeterliyse güç yeterlidir - watt hesabına gerek yok.",
          "Bitkili tank kabaca: kolay bitkiler için litre başına 0,25-0,5 W LED; iddialı halı bitkileri için 0,5-1 W + CO2.",
          "Derin tanklarda (50 cm+) ışığın dibe ulaşması için daha güçlü/lensli armatür gerekir.",
          "Işık çok güçlüyse kısmak her zaman mümkündür (dimmer); zayıf ışığı güçlendirmek yeni armatür demektir - sınırda kalacaksanız güçlüyü alın.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Balık uykusu",
        text: "Balıklar da uyur - göz kapakları olmadığı için fark edilmez. Işığı 7/24 açık bırakmak balıklarda kronik stres, bitkilerde verim düşüşü ve tankta yosun patlaması demektir. Karanlık, aydınlık kadar gereklidir.",
      },
    ],
    faq: [
      {
        q: "Gece mavi ışık (moonlight) balıklara zarar verir mi?",
        a: "Kısık lunar aydınlatma kısa süreli izleme için sorun değildir; ama sabaha kadar açık kalması balıkların dinlenmesini bozar. Gece modunu da zamanlayıcıya bağlayın.",
      },
      {
        q: "Işık yosun yaptı, tamamen kapatsam olur mu?",
        a: "Birkaç günlük tam karartma yeşil su gibi salgınlarda etkili bir müdahaledir; ama kalıcı çözüm süreyi 6-8 saate sabitlemek ve besin yükünü azaltmaktır. Bitkili tankta uzun karartma bitkilere de zarar verir.",
      },
    ],
    related: ["bitkili-akvaryum", "yosun-sorunlari", "resif-mercan-bakimi", "baslangic-ekipman-listesi"],
  },
  {
    slug: "hava-motoru",
    title: "Hava Motoru ve Akvaryum Oksijenlendirmesi",
    description:
      "Hava motoru gerekli mi? Oksijen eksikliği belirtileri, hava taşı kullanımı, çekvalf montajı ve sessiz çalıştırma ipuçları.",
    category: "ekipman",
    keywords: [
      "hava motoru",
      "akvaryum oksijen",
      "hava taşı",
      "çekvalf",
      "akvaryum havalandırma",
    ],
    updated: "2026-07-27",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Baloncuklar akvaryumun simgesidir ama işlevi çoğu kişinin sandığından farklıdır: oksijen, kabarcıkların içinden değil, esas olarak su YÜZEYİNDEN girer. Hava motorunun asıl görevi yüzeyi hareketlendirerek bu gaz alışverişini artırmaktır. Bu rehber ne zaman gerekli olduğunu ve doğru kurulumu anlatır.",
      },
      { type: "h2", id: "gerekli-mi", title: "Hava Motoru Şart mı?" },
      {
        type: "ul",
        items: [
          "Filtre çıkışı su yüzeyini görünür şekilde dalgalandırıyorsa, normal stoklu tankta ek hava motoru ŞART DEĞİLDİR.",
          "Şart olduğu durumlar: kalabalık stok, yaz sıcakları (sıcak su az oksijen tutar), ilaç tedavisi dönemi, sünger filtre kullanımı (motoru zaten hava çalıştırır) ve elektrik kesintisi yedeği (pilli modeller).",
          "Faydalı olduğu durumlar: gece bitkilerin oksijen tüketimi (yoğun bitkili tanklarda gece havalandırma), derin-dar tanklarda dikey sirkülasyon.",
        ],
      },
      { type: "h2", id: "belirtiler", title: "Oksijen Eksikliği Nasıl Anlaşılır?" },
      {
        type: "ul",
        items: [
          "Balıklar yüzeye toplanmış, ağızlarıyla yüzeyden 'hava yudumluyor' (piping) - acil durum işaretidir.",
          "Solungaç hareketleri hızlanmış, balıklar durgun.",
          "Belirti önce iri ve oksijen ihtiyacı yüksek balıklarda başlar.",
          "Acil müdahale: filtre çıkışını yüzeye yönlendirin, hava taşı ekleyin, %20 taze su verin, sıcaklık yüksekse düşürün. Ardından nedeni bulun: aşırı stok mu, sıcaklık mı, kirlilik mi?",
        ],
      },
      { type: "h2", id: "kurulum", title: "Kurulum" },
      {
        type: "steps",
        items: [
          {
            title: "Motoru su seviyesinin ÜSTÜNE koyun (veya çekvalf takın)",
            text: "Elektrik kesilince su, hava hortumundan geriye sifonlanıp motoru ve zemini ıslatabilir. Çözüm: hortuma bir çekvalf (tek yön ventili) takmak - küçük parça, büyük sigorta.",
          },
          {
            title: "Hava taşını yerleştirin",
            text: "Taşı, tabana yakın ama çakıla gömmeden konumlandırın. Köşeye yakın yerleşim dairesel su akışı oluşturur.",
          },
          {
            title: "Debiyi ayarlayın",
            text: "Vanalı modellerde kabarcığı, balıkları savurmayacak nazik bir seviyeye kısın. Şiddetli türbülans bazı türleri (beta, dev gurami gibi durgun su balıkları) rahatsız eder.",
          },
        ],
      },
      { type: "h2", id: "sessizlik", title: "Sessiz Çalıştırma İpuçları" },
      {
        type: "ul",
        items: [
          "Motoru sünger veya keçe üzerine koyun; titreşimin mobilyaya iletilmesi ana gürültü kaynağıdır.",
          "Eski ve kireçlenmiş hava taşı motoru zorlar ve sesi artırır - taşlar birkaç ayda bir yenilenecek sarf malzemesidir.",
          "Hortum kıvrılmış/tıkalıysa motor inler; hattı düzeltin.",
          "İçindeki lastik diyafram aşındıkça ses artar ve debi düşer; çoğu markada yedek diyafram seti satılır.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Dekoratif kullanım",
        text: "Hava perdeleri ve baloncuklu dekorlar işlevden çok görsellik içindir - zararı yoktur, keyif veriyorsa kullanın. Oksijen için kritik olan yüzey hareketidir, baloncuğun kendisi değil.",
      },
    ],
    faq: [
      {
        q: "Hava motoru 7/24 mü çalışmalı?",
        a: "Ana oksijen kaynağınızsa (sünger filtre gibi) evet, kesintisiz. Destek amaçlıysa zamanlayıcıyla gece çalıştırmak (bitkilerin O2 tükettiği saatler) mantıklı bir orta yoldur.",
      },
      {
        q: "CO2 sistemim var, hava taşı CO2'yi uçurur mu?",
        a: "Evet - yüzey hareketi CO2'yi atmosfere kaçırır. CO2'li bitkili tanklarda hava taşını yalnızca gece (CO2 kapaliyken) çalıştırmak standart uygulamadır.",
      },
    ],
    related: ["filtre-rehberi", "co2-sistemleri", "baslangic-ekipman-listesi", "isitici-kullanimi"],
  },
  {
    slug: "co2-sistemleri",
    title: "Bitkili Akvaryumda CO2 Sistemi Kurulumu ve Kullanımı",
    description:
      "Basınçlı CO2 sistemi bileşenleri, kabarcık sayısı ayarı, drop checker kullanımı, güvenlik kuralları ve CO2 alternatifleri.",
    category: "ekipman",
    keywords: [
      "akvaryum CO2",
      "CO2 sistemi",
      "bitki CO2",
      "drop checker",
      "CO2 regülatör",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "Işık ve gübreden sonra bitki büyümesinin üçüncü ayağı karbondur - ve sudaki doğal CO2, iddialı bitki kurulumları için çoğu zaman yetersizdir. Basınçlı CO2 sistemi, bitkili akvaryumda 'iyi'yi 'muhteşem'e taşıyan yatırımdır: büyüme hızlanır, renkler koyulaşır, halı bitkileri gerçekten halı olur. Bu rehber sistemi güvenle kurmayı ve ayarlamayı anlatır.",
      },
      { type: "h2", id: "gerekli-mi", title: "CO2'ye Gerçekten İhtiyacım Var mı?" },
      {
        type: "ul",
        items: [
          "GEREKMİYOR: anubias, java eğreltisi, moss, cryptocoryne, vallisneria gibi kolay türlerle düşük teknoloji (low-tech) tank kuruyorsanız.",
          "GEREKİYOR: halı bitkileri (monte carlo, HC cuba), kırmızı iddialı türler ve yoğun 'aquascape' hedefliyorsanız.",
          "Ara yol: sıvı karbon takviyeleri hafif destek sağlar ama basınçlı sistemin yerini tutmaz; bazı bitkilere (vallisneria) yüksek dozda zarar verebilir.",
          "Unutmayın: güçlü ışık + CO2'süz tank = yosun daveti. CO2, güçlü ışığın dengeleyicisidir.",
        ],
      },
      { type: "h2", id: "bilesenler", title: "Sistem Bileşenleri" },
      {
        type: "table",
        headers: ["Parça", "Görevi"],
        rows: [
          ["CO2 tüpü", "Gaz deposu; dolumu yapılabilen çelik/alüminyum tüpler uzun vadede en ekonomik"],
          ["Regülatör", "Tüpteki yüksek basıncı kullanılabilir seviyeye indirir; çift göstergeli modeller doluluk takibi sağlar"],
          ["İğne vana", "Kabarcık hassas ayarı - kaliteli iğne vana, stabil CO2'nin anahtarıdır"],
          ["Selenoid (opsiyonel ama önerilir)", "Zamanlayıcıya bağlanıp CO2'yi ışıkla senkron açar/kapar - gece gaz israfını ve pH çakılmasını önler"],
          ["Kabarcık sayacı", "Saniyedeki kabarcık sayısını görünür kılar"],
          ["Çekvalf", "Suyun regülatöre geri kaçmasını önler"],
          ["Difüzör/atomizer", "Gazı mikro kabarcıklara bölerek suda çözer; seramik diskli modeller standarttır"],
          ["Drop checker", "Sudaki CO2 seviyesini renkle gösteren küçük cam gözlemci"],
        ],
      },
      { type: "h2", id: "kurulum-ayar", title: "Kurulum ve Ayar" },
      {
        type: "steps",
        items: [
          {
            title: "Hattı kurun",
            text: "Tüp → regülatör → selenoid → iğne vana → kabarcık sayacı → çekvalf → difüzör sırasıyla CO2'ye dayanıklı hortumla bağlayın. Bağlantıları sabunlu suyla kaçak testi yapın.",
          },
          {
            title: "Zamanlamayı ayarlayın",
            text: "CO2'yi ışıktan 1-2 saat ÖNCE açıp ışık kapanmadan 1 saat ÖNCE kapatın (selenoid + zamanlayıcı). Bitkiler ışık açıldığında hazır CO2 bulur.",
          },
          {
            title: "Düşük dozla başlayın",
            text: "100 litrelik tank için saniyede ~1 kabarcıkla başlayın. Her ayar değişikliğinden sonra sistemin oturması saatler alır - sabırlı ayar yapın.",
          },
          {
            title: "Drop checker ile doğrulayın",
            text: "Mavi = az CO2, YEŞİL = ideal (~30 ppm), sarı = TEHLİKELİ fazla. Renk değişimi 1-2 saat geriden gelir; anlık gösterge değildir.",
          },
          {
            title: "Balıkları gözlemleyin",
            text: "Balıklar yüzeyde soluyorsa CO2 fazladır: hemen kısın ve havalandırmayı artırın. İdeal sistemde balıklar CO2'nin varlığını hiç hissetmez.",
          },
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Güvenlik",
        text: "CO2 tüpü basınçlı kaptır: dik, devrilmeyecek şekilde ve ısı kaynaklarından uzak konumlandırın. Doluma yalnızca yetkili dolum noktalarında gidin. Ve asla drop checker olmadan yüksek doz CO2 vermeyin - aşırı CO2, balıkları saatler içinde boğar.",
      },
      { type: "h2", id: "ph-etkisi", title: "CO2 ve pH İlişkisi" },
      {
        type: "p",
        text: "CO2 suda karbonik asit oluşturur ve pH'ı düşürür - gün içinde 0.5-1.0'lık pH salınımı CO2'li tanklarda normaldir ve balıklar buna uyum sağlar. Kritik nokta KH'dir: KH 3 dKH üzerindeyse sistem tamponludur ve güvenlidir; çok düşük KH'li sularda CO2, pH'ı tehlikeli hızda düşürebilir. CO2'ye başlamadan KH'nizi ölçün.",
      },
    ],
    faq: [
      {
        q: "Mayalı (DIY) CO2 sistemi işe yarar mı?",
        a: "Küçük tanklarda (60 L altı) çalışır ama üretim istikrarsızdır ve gece kapatılamaz. Ciddi bitkili tank hedefliyorsanız basınçlı sisteme yatırım, birkaç ay içinde kendini rahatlıkla amorti eder.",
      },
      {
        q: "CO2 karidesler için güvenli mi?",
        a: "Doğru dozda (drop checker yeşil) evet. Karidesler balıklardan biraz daha duyarlıdır; yeni sistemde dozu kademeli artırıp davranışlarını izleyin.",
      },
      {
        q: "Tüpüm ne kadar gider?",
        a: "Kaba tahmin: 100 litrelik orta yoğun tankta 2 kg'lık tüp, günde 8 saat kullanımla 3-6 ay dayanır. Regülatördeki tüp basınç göstergesi düşmeye başladığında dolum vakti yaklaşmış demektir.",
      },
    ],
    related: ["bitkili-akvaryum", "aydinlatma-rehberi", "su-parametreleri", "hava-motoru"],
  },
];
