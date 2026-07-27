import type { Article } from "./types";

export const ekipmanArticles: Article[] = [
  {
    slug: "filtre-rehberi",
    title: "Akvaryum Filtresi Türleri, Seçimi ve Bakımı",
    description:
      "İç filtre, dış filtre, askı filtre, sünger filtre - hangisi size uygun? Filtre kapasitesi hesabı, filtre malzemesi dizilimi ve doğru bakım.",
    category: "ekipman",
    keywords: [
      "akvaryum filtresi",
      "dış filtre",
      "iç filtre",
      "sünger filtre",
      "filtre malzemesi",
      "filtre bakımı",
    ],
    updated: "2026-07-27",
    minutes: 10,
    blocks: [
      {
        type: "p",
        text: "Filtre, akvaryumun kalbi ve karaciğeridir: suyu hem dolaştırır hem temizler. Ama az bilinen gerçek şu - filtrenin asıl işi kiri toplamak değil, faydalı bakterilere ev sahipliği yapmaktır. Bu rehber filtre türlerini, doğru kapasite hesabını ve ömür uzatan bakım tekniklerini anlatır.",
      },
      { type: "h2", id: "uc-gorev", title: "Filtrasyonun Üç Görevi" },
      {
        type: "ul",
        items: [
          "Mekanik: süngerler askıdaki partikülleri (dışkı, yem artığı) fiziksel olarak tutar.",
          "Biyolojik: sünger ve biyolojik ortam yüzeyindeki bakteriler amonyağı nitrite, nitriti nitrata çevirir - filtrasyonun asıl hayati katmanı budur.",
          "Kimyasal: aktif karbon ve reçineler; ilaç kalıntısı, renk ve koku gideriminde DÖNEMSEL kullanılır, sürekli şart değildir.",
        ],
      },
      { type: "h2", id: "turler", title: "Filtre Türleri" },
      {
        type: "table",
        headers: ["Tür", "İdeal kullanım", "Artı", "Eksi"],
        rows: [
          [
            "İç filtre",
            "40-120 L tanklar",
            "Ekonomik, kurulumu saniyeler",
            "Tank içinde yer kaplar, sünger hacmi sınırlı",
          ],
          [
            "Askı (şelale/HOB) filtre",
            "40-150 L tanklar",
            "Tank dışında, bakımı çok kolay, yüzeyi havalandırır",
            "Su buharlaşınca ses yapabilir",
          ],
          [
            "Dış (kova/canister) filtre",
            "100 L üzeri tanklar",
            "Dev malzeme hacmi, seyrek bakım, sessiz",
            "Fiyat; hortum kurulumu ister",
          ],
          [
            "Sünger (pipo) filtre",
            "Yavru, karides ve karantina tankları",
            "Canlı emme riski sıfır, ucuz, ilaçtan etkilenmez",
            "Hava motoru ister, görüntüsü sade",
          ],
          [
            "Sump sistemi",
            "Büyük tanklar ve tuzlu su",
            "Sınırsız özelleştirme, ekipman gizleme",
            "Kurulum bilgisi ve taşma güvenliği ister",
          ],
        ],
      },
      { type: "h2", id: "kapasite", title: "Kapasite Hesabı" },
      {
        type: "p",
        text: "Temel kural: filtre, tank hacminin 4-6 katını saatte devirebilmeli. 100 litrelik tank için 400-600 L/saat debili filtre uygundur. Üretici debileri boş (malzemesiz) ölçülür - gerçek debi malzeme dolunca %30-40 düşer. Bu yüzden sınırda kalmayın; bir üst model her zaman doğru tercihtir. Kalabalık stok, iri balıklar (ciklet, Japon balığı) ve az bitkili tanklar daha da yüksek kapasite ister.",
      },
      { type: "h2", id: "malzeme", title: "Filtre Malzemesi Dizilimi" },
      {
        type: "steps",
        items: [
          {
            title: "1. Kaba sünger (su girişi)",
            text: "İri partikülleri ilk aşamada tutar; en sık yıkanan katman budur.",
          },
          {
            title: "2. İnce sünger / elyaf",
            text: "Küçük partikülleri yakalar, su berraklığını sağlar. Elyaf tıkandıkça değiştirilir.",
          },
          {
            title: "3. Biyolojik ortam",
            text: "Seramik halka, sinterlenmiş cam veya biyo-toplar - bakterilerin ana yerleşkesi. Asla klorlu suyla yıkanmaz, nadiren sadece çalkalanır.",
          },
          {
            title: "4. Kimyasal ortam (opsiyonel, çıkışa yakın)",
            text: "Aktif karbon vb. Sadece ihtiyaç dönemlerinde: ilaç sonrası temizlik, koku/renk giderimi. 3-4 haftada etkisini yitirir, süresi dolunca çıkarın.",
          },
        ],
      },
      { type: "h2", id: "bakim", title: "Filtre Bakımı: Az Dokun, Doğru Dokun" },
      {
        type: "ul",
        items: [
          "Süngerleri AYDA BİR, akvaryumdan çektiğiniz suyun içinde sıkarak yıkayın - asla musluk altında değil.",
          "Tüm malzemeyi aynı gün yıkamayın; her bakımda tek katmanı temizleyin ki bakteri kolonisi hep korunmuş kalsın.",
          "Debi gözle görülür düştüyse pervane (impeller) bölmesini açıp temizleyin - filtre 'bozuldu' sanılan vakaların çoğu kirli pervanedir.",
          "Dış filtre hortumları iç yüzeyden daralarak tıkanır; 6 ayda bir hortum fırçasıyla temizlik debiyi gençleştirir.",
          "Sünger lime lime olduğunda yenisiyle değiştirin ama eskisini birkaç hafta yenisinin yanında tutun (bakteri transferi).",
          "Filtre 7/24 çalışır - geceleri kapatmak bakteri kolonisini oksijensiz bırakıp öldürür ve sabah tanka zehir pompalar.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Elektrik kesintisi sonrası",
        text: "Uzun kesintide (2+ saat) dış filtre içindeki su oksijensiz kalır ve bakteriler ölmeye başlar. Elektrik gelince filtreyi direkt tanka basmadan önce içindeki suyu dökün, malzemeyi tank suyuyla çalkalayıp yeniden kurun.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Filtre seçiminde yardım",
        text: "Tank hacminizi ve beslediğiniz türleri bize iletin; mağazamızdaki modeller arasından bütçenize uygun doğru kapasiteyi birlikte seçelim.",
      },
    ],
    faq: [
      {
        q: "Filtre sesli çalışıyor, ne yapabilirim?",
        a: "Sırasıyla kontrol edin: pervane bölmesinde çakıl/kir var mı, emiş hava mı yapıyor (su seviyesi düşük olabilir), filtre cama titreşim mi iletiyor (altına sünger koyun). İç filtrelerde hava karıştırma (venturi) hattı açıksa ses normaldir; kısabilirsiniz.",
      },
      {
        q: "Yeni filtre aldım, eskisini hemen çıkarabilir miyim?",
        a: "Hayır! Yeni filtre steril doğar. İkisini 3-4 hafta birlikte çalıştırın veya eski filtrenin malzemesini yeni filtreye taşıyın - aksi hâlde tankınız sıfırdan döngüye girer.",
      },
      {
        q: "Aktif karbon sürekli kullanılmalı mı?",
        a: "Gerekmez. Karbon 3-4 haftada doyar ve sonrasında sadece yer kaplar. Rutin kullanım yerine ihtiyaç anında (ilaç sonrası, koku/sararma) takıp süresi dolunca çıkarmak en doğrusudur - boşalan bölmeye ekstra biyolojik malzeme koyun.",
      },
    ],
    related: ["baslangic-ekipman-listesi", "akvaryum-temizligi", "akvaryum-dongusu", "hava-motoru"],
  },
  {
    slug: "isitici-kullanimi",
    title: "Akvaryum Isıtıcısı Seçimi, Kurulumu ve Güvenli Kullanımı",
    description:
      "Kaç watt ısıtıcı gerekir? Isıtıcı nereye monte edilir, sıcaklık nasıl ayarlanır, arızalar nasıl anlaşılır - güvenlik kurallarıyla tam rehber.",
    category: "ekipman",
    keywords: [
      "akvaryum ısıtıcısı",
      "ısıtıcı kaç watt",
      "akvaryum sıcaklığı",
      "ısıtıcı montajı",
      "termostatlı ısıtıcı",
    ],
    updated: "2026-07-27",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Tropikal balıklar soğukkanlıdır: vücut sıcaklıkları suyla birlikte iner çıkar. Sabit ve doğru sıcaklık bu yüzden konfor değil, hayati ihtiyaçtır. Isıtıcı ucuz ve basit bir cihazdır ama yanlış kullanımı en pahalı sonuçları doğurur - bu rehber doğru seçimi ve güvenli kullanımı anlatır.",
      },
      { type: "h2", id: "watt", title: "Kaç Watt Gerekir?" },
      {
        type: "table",
        headers: ["Tank hacmi", "Normal oda (20-22°C)", "Soğuk ortam (<18°C)"],
        rows: [
          ["40-60 L", "50-75 W", "100 W"],
          ["80-100 L", "100 W", "150 W"],
          ["150-200 L", "150-200 W", "250-300 W"],
          ["300 L+", "2 × 150-200 W", "2 × 250 W"],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Büyük tankta çift ısıtıcı",
        text: "200 L üzeri tanklarda toplam gücü iki ısıtıcıya bölmek çift güvenlik sağlar: biri arızalanıp kapanırsa diğeri suyu taşır; biri açık takılı kalırsa tek başına suyu tehlikeli seviyeye ısıtamaz.",
      },
      { type: "h2", id: "montaj", title: "Doğru Montaj" },
      {
        type: "ul",
        items: [
          "Isıtıcıyı su akışının olduğu yere monte edin - filtre çıkışının yakını idealdir; ısı böylece tanka eşit dağılır.",
          "Cihazı yatay veya 45° eğimli takmak, termostatın ısınan suyu daha doğru okumasını sağlar (sıcak su yükselir; dikey montajda termostat üstte kalıp erken kapanabilir).",
          "Isıtıcı tamamen su altında kalmalı; minimum su seviyesi çizgisine dikkat edin.",
          "Cam ısıtıcıyı çakıla gömmeyin ve dekorla sıkıştırmayın - cam bölgesel ısınıp çatlar.",
        ],
      },
      { type: "h2", id: "kullanim", title: "Kullanım Kuralları" },
      {
        type: "steps",
        items: [
          {
            title: "Önce 15-30 dakika bekleyin",
            text: "Yeni ısıtıcıyı suya koyduktan sonra fişe takmadan önce iç termostatın su sıcaklığına dengelenmesini bekleyin. Aynısı tersi için de geçerli: fişten çekmeden su dışına çıkarmayın; sıcak cam anında çatlar.",
          },
          {
            title: "Ayrı termometreyle doğrulayın",
            text: "Isıtıcı kadranları ±1-2°C sapabilir. Ayarı yaptıktan sonra 24 saat bekleyip bağımsız termometreyle kontrol edin; gerekirse kadranı sapma kadar düzeltin.",
          },
          {
            title: "Su değişiminde fişi çekin",
            text: "Su seviyesi düşünce açıkta kalan ısıtıcı havada aşırı ısınır. Su değişiminden önce fişi çekmeyi ritüel hâline getirin.",
          },
          {
            title: "Günlük göz kontrolü",
            text: "Termometre kontrolü günde 2 saniyedir. Sıcaklık hedeften 1-2°C saparsa nedenini aynı gün araştırın.",
          },
        ],
      },
      { type: "h2", id: "ariza", title: "Arıza Senaryoları" },
      {
        type: "ul",
        items: [
          "Isıtıcı hiç ısıtmıyor (su soğuk): rezistans ömrünü doldurmuş olabilir - en yaygın arıza. Yedek ısıtıcı bulundurmak ucuz bir sigortadır.",
          "Isıtıcı kapanmıyor (su aşırı sıcak): yapışan termostat nadir ama en tehlikeli arızadır. Balıklar yüzeyde hızlı soluyorsa önce sıcaklığa bakın! Fişi çekin, suyu kademeli soğutun (kapak açın, ışığı kapatın, az miktarda serin su ekleyin).",
          "Sık aç-kapa (klik sesleri) normaldir; termostatın çalıştığını gösterir.",
          "5 yaşını geçen ısıtıcıları proaktif değiştirmek, arızayı beklemekten ucuzdur.",
        ],
      },
    ],
    faq: [
      {
        q: "Yazın ısıtıcıyı çıkarmalı mıyım?",
        a: "Hayır - takılı bırakın. Termostatlı ısıtıcı su hedefin üzerindeyse zaten çalışmaz; ama serin bir gece veya klimalı odada devreye girerek dalgalanmayı önler. Yaz sorunu tersi olabilir: su 30°C'yi aşıyorsa kapak açmak, aydınlatma süresini kısaltmak ve fan kullanmak gerekir.",
      },
      {
        q: "Isıtıcısız akvaryum olur mu?",
        a: "Japon balığı, dağ beyazı (white cloud) gibi soğuk su türleriyle, sıcaklığı stabil bir odada olur. Tropikal türlerin tamamı (lepistes dahil) ısıtıcı ister - oda kışın 24°C altına düşüyorsa ısıtıcı şarttır.",
      },
    ],
    related: ["baslangic-ekipman-listesi", "beyaz-benek", "su-parametreleri", "filtre-rehberi"],
  },
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
