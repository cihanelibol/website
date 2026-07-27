import type { Article } from "./types";

export const tuzluSuArticles: Article[] = [
  {
    slug: "tuzlu-su-akvaryumuna-giris",
    title: "Tuzlu Su Akvaryumuna Giriş: Başlangıç Rehberi",
    description:
      "Deniz akvaryumu kurmak ister misiniz? FOWLR ve resif farkı, gerekli ekipmanlar, maliyet beklentisi ve başlangıç balıkları - tam giriş rehberi.",
    category: "tuzlu-su",
    keywords: [
      "tuzlu su akvaryumu",
      "deniz akvaryumu",
      "resif akvaryumu",
      "tuzlu su balıkları",
      "marine akvaryum kurulumu",
    ],
    updated: "2026-07-27",
    minutes: 11,
    blocks: [
      {
        type: "p",
        text: "Tuzlu su akvaryumu, hobinin zirvesi kabul edilir: palyaço balıkları, cerrahlar, mercanlar ve canlı kayalarıyla evinize gerçek bir resif parçası taşırsınız. Tatlı sudan daha fazla disiplin ve bütçe ister, ama sanıldığı kadar ulaşılmaz da değildir. Bu rehber gerçekçi bir yol haritası sunar.",
      },
      { type: "h2", id: "hazir-miyim", title: "Tuzlu Suya Hazır mıyım?" },
      {
        type: "ul",
        items: [
          "En az 6-12 ay tatlı su deneyimi şiddetle önerilir - su kimyası ve döngü kavramlarına hâkim olmalısınız.",
          "Haftalık düzenli bakıma ayıracak vaktiniz olmalı; tuzlu su ihmali affetmez.",
          "Başlangıç bütçesi tatlı suyun 3-5 katıdır; canlılar da ekipman da daha pahalıdır.",
          "Sabır şart: tuzlu su tankının olgunlaşması aylar sürer, acele eden herkes canlı kaybeder.",
        ],
      },
      { type: "h2", id: "sistem-tipleri", title: "Sistem Tipleri: FOWLR mı, Resif mi?" },
      {
        type: "table",
        headers: ["Sistem", "İçerik", "Zorluk", "Kimin için"],
        rows: [
          [
            "FOWLR (Fish Only With Live Rock)",
            "Balık + canlı kaya, mercan yok",
            "Orta",
            "Tuzlu suya ilk adım - önerilen başlangıç",
          ],
          [
            "Yumuşak mercan resifi",
            "Balık + deri mercanlar, zoanthus, mantar mercanlar",
            "Orta-ileri",
            "FOWLR sonrası doğal ikinci adım",
          ],
          [
            "LPS/SPS resif",
            "Taş mercanlar, ileri aydınlatma ve element takviyesi",
            "İleri",
            "Deneyimli resifçiler",
          ],
        ],
      },
      { type: "h2", id: "ekipman", title: "Temel Ekipman Listesi" },
      {
        type: "ul",
        items: [
          "Tank: en az 200 litre önerilir - tuzlu suda da büyük hacim daha stabil demektir. 100 litre altı 'nano resif' kurulumlar mümkündür ama yeni başlayan için daha zordur.",
          "Protein skimmer: tuzlu suyun imza ekipmanı; organik atıkları çürümeden sudan alır. Ayrıntı için Protein Skimmer rehberimize bakın.",
          "Sirkülasyon pompaları: resifte güçlü ve dağınık akıntı şarttır; saatte toplam hacmin 20-40 katı devir hedeflenir.",
          "Isıtıcı + soğutma planı: hedef 25-26°C; yaz aylarında fan veya chiller gerekebilir.",
          "Aydınlatma: FOWLR için standart LED yeterli; mercan besleyecekseniz tam spektrumlu resif LED'i gerekir.",
          "Refraktometre: tuzluluğu ölçmenin güvenilir yolu (yüzer hidrometreler yanıltıcı olabilir).",
          "RO/DI su arıtma cihazı: musluk suyundaki silikat ve fosfat resifte yosun felaketi doğurur; arıtılmış su kullanmak standarttır.",
          "Test kitleri: tuzluluk, amonyak, nitrit, nitrat + (resif için) kalsiyum, alkalinite, magnezyum.",
        ],
      },
      { type: "h2", id: "kurulum-yolu", title: "Kurulum Yol Haritası" },
      {
        type: "steps",
        items: [
          {
            title: "Tankı ve ekipmanı kurun",
            text: "Tank, skimmer, sirkülasyon ve ısıtıcıyı yerleştirin. Tuzlu su hazırlayıp (bkz. Tuz ve Yoğunluk rehberi) tankı doldurun.",
          },
          {
            title: "Kaya ve kumu ekleyin",
            text: "Canlı kaya veya kuru resif kayasını istifleyin, canlı kum serin. Kaya istifinin depreme değil, salyangoz ve balık kazılarına dayanıklı olması gerekir - sağlam istifleyin.",
          },
          {
            title: "Döngüyü tamamlayın",
            text: "Tatlı sudaki azot döngüsünün aynısı burada da geçerlidir; 4-8 hafta sürer. Bakteri kültürüyle hızlandırılabilir.",
          },
          {
            title: "Temizlik ekibini ekleyin",
            text: "Döngü bitince önce temizlik ekibi girer: nassarius ve turbo salyangozları, keşiş yengeçleri.",
          },
          {
            title: "İlk balıklar",
            text: "2-4 hafta arayla, azar azar. İlk balıklar dayanıklı türlerden seçilir (aşağıda). Her yeni canlıya karantina uygulamak tuzlu suda daha da önemlidir.",
          },
          {
            title: "Mercanlar (opsiyonel)",
            text: "Tank 3-6 ay stabil kaldıktan sonra kolay yumuşak mercanlarla başlayın.",
          },
        ],
      },
      { type: "h2", id: "ilk-baliklar", title: "Başlangıç İçin Tuzlu Su Balıkları" },
      {
        type: "ul",
        items: [
          "Palyaço balığı (ocellaris) - dayanıklı, üretim (kaptif) bireyleri bol; çiftler hâlinde alın.",
          "Yeşil kromis - barışçıl sürü balığı; 5+ grupla.",
          "Ateş kayası (firefish) - sakin ve dayanıklı; zıplayabilir, kapak şart.",
          "Cüce melek (coral beauty) - 200 L+ tanklarda; mercan dostluğu bireysel değişir.",
          "Kaçının: mandarin (özel beslenme), cerrah balıkları (dev tank ister), damselfish (aşırı saldırgan olabilir).",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Bize danışın",
        text: "Tuzlu su kurulumu ciddi bir yatırımdır; tank boyutunuza ve hedefinize göre ekipman listesini birlikte netleştirelim. Mağazamız kurulum planlamasında ücretsiz destek verir.",
      },
    ],
    faq: [
      {
        q: "Tuzlu su akvaryumu bakımı tatlı sudan çok mu zor?",
        a: "Rutin benzerdir (su değişimi, test, yemleme) ama hata payı daha dardır ve ek parametreler (tuzluluk, resifte kalsiyum/alkalinite) takip edilir. Disiplinli bir tatlı su hobicisi tuzlu suya rahat geçer.",
      },
      {
        q: "Tuzlu su tankında musluk suyu kullanılabilir mi?",
        a: "Önerilmez. Musluk suyundaki fosfat, silikat ve ağır metaller resifte inatçı yosun sorunlarına yol açar. Standart uygulama RO/DI arıtılmış su ile tuz karışımı hazırlamaktır.",
      },
      {
        q: "En küçük kaç litreyle tuzlu su kurulur?",
        a: "Teknik olarak 60-100 litrelik nano sistemler mümkündür; ancak küçük hacimde tuzluluk ve sıcaklık çok hızlı oynar. İlk tuzlu su tankı için 200 litre ve üzeri çok daha güvenlidir.",
      },
    ],
    related: ["tuz-ve-yogunluk", "canli-kaya-ve-olgunlasma", "protein-skimmer", "resif-mercan-bakimi"],
  },
  {
    slug: "tuz-ve-yogunluk",
    title: "Akvaryum Tuzu Karışımı ve Yoğunluk (Tuzluluk) Ölçümü",
    description:
      "Deniz tuzu nasıl hazırlanır? Doğru tuzluluk değerleri, refraktometre kullanımı, tuzlu su değişimi ve buharlaşma telafisi (top-off) rehberi.",
    category: "tuzlu-su",
    keywords: [
      "akvaryum tuzu",
      "deniz tuzu karışımı",
      "tuzluluk ölçümü",
      "refraktometre",
      "spesifik gravite",
      "tuzlu su hazırlama",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Tuzlu su akvaryumunda 'su hazırlamak' başlı başına bir beceridir: doğru tuz, doğru oran, doğru ölçüm. Bu rehber, deniz suyu hazırlamanın ve tuzluluğu sabit tutmanın tüm inceliklerini anlatır.",
      },
      { type: "h2", id: "hedef-degerler", title: "Hedef Tuzluluk Değerleri" },
      {
        type: "table",
        headers: ["Sistem", "Spesifik gravite (SG)", "Tuzluluk (ppt)"],
        rows: [
          ["FOWLR (sadece balık)", "1.020 - 1.025", "27 - 33"],
          ["Resif (mercanlı)", "1.024 - 1.026", "32 - 35"],
          ["Doğal deniz suyu (referans)", "1.025", "35"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "İstikrar > mükemmel değer",
        text: "1.024'te sabit duran bir tank, 1.023-1.026 arasında salınan tanktan çok daha sağlıklıdır. Mercanlar ve omurgasızlar tuzluluk dalgalanmasına balıklardan çok daha duyarlıdır.",
      },
      { type: "h2", id: "tuz-secimi", title: "Tuz Seçimi" },
      {
        type: "ul",
        items: [
          "Mutlaka akvaryum için üretilmiş sentetik deniz tuzu kullanın - sofra tuzu, kaya tuzu veya yemeklik deniz tuzu ASLA kullanılamaz.",
          "FOWLR için standart deniz tuzları yeterlidir; resif tuzları ekstra kalsiyum ve magnezyum içerir.",
          "Aynı markada kalın: her markanın element profili farklıdır, sık marka değiştirmek parametre dalgalanması yaratır.",
        ],
      },
      { type: "h2", id: "hazirlama", title: "Tuzlu Su Nasıl Hazırlanır?" },
      {
        type: "steps",
        items: [
          {
            title: "RO/DI su hazırlayın",
            text: "Temiz bir kovaya (sadece akvaryum için kullanılan) arıtılmış su alın ve ısıtıcıyla tank sıcaklığına getirin.",
          },
          {
            title: "Tuzu suya ekleyin",
            text: "Her zaman tuz suya eklenir, tersi değil. Ortalama doz: litre başına ~33-35 gram (marka etiketine bakın). Küçük bir sirkülasyon pompasıyla karıştırın.",
          },
          {
            title: "Bekletin",
            text: "Tuz tamamen çözünene ve su berraklaşana kadar en az birkaç saat, ideali 12-24 saat pompayla karıştırmaya devam edin.",
          },
          {
            title: "Ölçün ve ayarlayın",
            text: "Refraktometreyle tuzluluğu ölçün. Yüksekse arıtılmış su ekleyin, düşükse azar azar tuz ilave edin. Hedefe oturunca su kullanıma hazırdır.",
          },
        ],
      },
      { type: "h2", id: "olcum", title: "Yoğunluk Nasıl Ölçülür?" },
      {
        type: "ul",
        items: [
          "Refraktometre: standart araçtır. Kullanmadan önce saf suyla (0 ppt) kalibre edin; birkaç damla örnek yeterlidir.",
          "Yüzer hidrometre / salınım kollu hidrometre: ucuzdur ama hava kabarcığı ve tuz birikintisi ölçümü saptırır - yalnızca yedek olarak kullanın.",
          "Dijital tuzluluk ölçerler: hassas ve hızlıdır; düzenli kalibrasyon ister.",
        ],
      },
      { type: "h2", id: "buharlasma", title: "Buharlaşma ve Top-Off: Kritik Ayrıntı" },
      {
        type: "p",
        text: "Su buharlaşırken tuz buharlaşmaz - yani tanktan su eksildikçe tuzluluk YÜKSELİR. Bu yüzden buharlaşan suyun yerine tuzlu su değil, TATLI (arıtılmış) su eklenir. Buna 'top-off' denir. Günlük top-off'u elle yapabilir veya otomatik top-off (ATO) sistemine devredebilirsiniz; ATO, tuzlu su hobisinin en rahatlatıcı otomasyonudur.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Su değişimi tuzlu suda",
        text: "Haftalık %10-15 değişim tuzlu su standardıdır. Yeni su, tankla aynı sıcaklık ve tuzlulukta olmalı - bu yüzden değişim suyunu bir gün önceden hazırlamak en sağlıklısıdır.",
      },
    ],
    faq: [
      {
        q: "Tuzluluk yükselmiş, nasıl düşürürüm?",
        a: "Tanktan bir miktar su alıp yerine arıtılmış tatlı su ekleyin - ama yavaşça, günde en fazla 0.001-0.002 SG düşecek şekilde. Ani tuzluluk değişimi canlıları şoklar.",
      },
      {
        q: "Karıştırdığım tuzlu suyu ne kadar saklayabilirim?",
        a: "Kapalı bir bidonda, ara ara sirkülasyonla haftalarca saklanabilir. Kullanmadan önce sıcaklığa getirip tuzluluğu tekrar ölçün.",
      },
    ],
    related: ["tuzlu-su-akvaryumuna-giris", "su-testleri", "canli-kaya-ve-olgunlasma"],
  },
  {
    slug: "canli-kaya-ve-olgunlasma",
    title: "Canlı Kaya, Canlı Kum ve Tuzlu Su Tankının Olgunlaşması",
    description:
      "Canlı kaya nedir, ne işe yarar? Kuru kaya farkı, kaya miktarı hesabı, curing süreci ve tuzlu su akvaryumunun olgunlaşma evreleri.",
    category: "tuzlu-su",
    keywords: [
      "canlı kaya",
      "live rock",
      "canlı kum",
      "resif kayası",
      "tank olgunlaşması",
      "uglies dönemi",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Tuzlu su akvaryumunun asıl filtresi cihazlar değil, kayalardır. Gözenekli resif kayası, milyarlarca faydalı bakteriye ev sahipliği yaparak tankın biyolojik motorunu oluşturur. Bu rehber canlı kaya, canlı kum ve tankın olgunlaşma sürecini anlatır.",
      },
      { type: "h2", id: "canli-kaya-nedir", title: "Canlı Kaya Nedir?" },
      {
        type: "p",
        text: "Canlı kaya (live rock), okyanusta veya olgun sistemlerde bekletilmiş, üzerinde bakteri, süngerler, kabuklu yosunlar (coralline) ve mikro canlılar barındıran gözenekli kalker kayadır. 'Canlı' olan kayanın kendisi değil, üzerindeki ve içindeki yaşamdır. Tanka hazır bir biyolojik filtre ve biyoçeşitlilik aşısı olarak girer.",
      },
      {
        type: "table",
        caption: "Canlı kaya ile kuru kaya karşılaştırması",
        headers: ["", "Canlı kaya", "Kuru (dead/dry) kaya"],
        rows: [
          ["Döngü süresi", "Çok kısalır (hazır bakteri)", "Sıfırdan başlar (4-8 hafta)"],
          ["Biyoçeşitlilik", "Zengin - copepod, sünger, coralline", "Yok; zamanla oluşur"],
          ["İstenmeyen misafir riski", "Var (aiptasia, kıl kurdu, yengeç)", "Yok - sterildir"],
          ["Fiyat", "Yüksek", "Uygun"],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Karma strateji",
        text: "Çoğunluğu kuru kaya + az miktarda kaliteli canlı kaya: hem bütçe dostu hem istenmeyen misafir riski düşük, hem de bakteri ve biyoçeşitlilik aşısı hazır. Yeni başlayanlar için en dengeli yol budur.",
      },
      { type: "h2", id: "miktar", title: "Ne Kadar Kaya Gerekir?" },
      {
        type: "p",
        text: "Klasik kural her litre için yaklaşık 0,1-0,15 kg kayadır (200 L tank → 20-30 kg). Modern minimalist resiflerde daha az kayayla açık istifler de yapılıyor; önemli olan toplam gözenekli yüzey ve balıklara yetecek saklanma alanıdır. Kayaları cam tabana değil, kumdan önce yerleştirilen bir kaide üzerine oturtmak istif kaymasını önler.",
      },
      { type: "h2", id: "canli-kum", title: "Canlı Kum" },
      {
        type: "ul",
        items: [
          "Aragonit esaslı kum, pH ve alkaliniteyi tamponlamaya yardım eder - silis kumu tuzlu suda kullanılmaz.",
          "2-5 cm derinlik standarttır; kum eleyen canlılar (nassarius, bazı kayabalıkları) için biraz daha kalın olabilir.",
          "Paketli 'canlı kum' bakteri aşısı sağlar; kuru aragonit kum + bakteri kültürü kombinasyonu da aynı işi görür.",
        ],
      },
      { type: "h2", id: "olgunlasma", title: "Olgunlaşma Evreleri: 'Çirkin Dönem' Normaldir" },
      {
        type: "steps",
        items: [
          {
            title: "0-6 hafta: Döngü",
            text: "Amonyak → nitrit → nitrat zinciri kurulur. Tank boş ve sabır ister.",
          },
          {
            title: "1-3 ay: Diyatom ve yosun dalgaları ('uglies')",
            text: "Kahverengi diyatom, ardından yeşil saç yosunu ve bazen siyanobakteri dalgaları gelir. Bu evre HER tankta yaşanır ve geçicidir - ekipman değiştirerek değil, sabır ve temizlik ekibiyle aşılır.",
          },
          {
            title: "3-6 ay: Dengelenme",
            text: "Coralline yosunlar (mor kabuklu) yayılmaya başlar, parametreler oturur. Kolay mercanlar için kapı açılır.",
          },
          {
            title: "6-12 ay: Olgun sistem",
            text: "Mikrofauna (copepod) popülasyonu oturur, tank kendi ritmini bulur. Hassas türler için uygun zemin artık hazırdır.",
          },
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "İstenmeyen misafirler",
        text: "Canlı kayayla gelebilen aiptasia (cam anemon) hızla çoğalıp mercan yakan bir baş belasıdır. Gördüğünüz anda müdahale edin (aiptasia ilacı veya peppermint karidesi). Kayaları tanka koymadan önce iyi inceleyin.",
      },
    ],
    faq: [
      {
        q: "Tank kurduktan 2 ay sonra her yer yosun oldu, sistemim mi bozuk?",
        a: "Hayır - bu 'uglies' denen doğal olgunlaşma evresidir. Işık süresini kısıp temizlik ekibini güçlendirin ve rutininize devam edin; 1-2 ay içinde dalga geçer.",
      },
      {
        q: "Mercan ne zaman ekleyebilirim?",
        a: "Parametreler (özellikle alkalinite ve nitrat) en az 4-6 hafta stabil kaldıktan sonra kolay yumuşak mercanlarla başlayın. Genelde bu, kurulumdan 3-4 ay sonrasına denk gelir.",
      },
    ],
    related: ["tuzlu-su-akvaryumuna-giris", "resif-mercan-bakimi", "tuz-ve-yogunluk", "azot-dongusu"],
  },
  {
    slug: "resif-mercan-bakimi",
    title: "Resif Akvaryumunda Mercan Bakımı: Yumuşaktan SPS'e",
    description:
      "Mercan türleri (yumuşak, LPS, SPS), başlangıç mercanları, yerleştirme, ışık ve akıntı ihtiyaçları, mercan besleme ve element takviyesi.",
    category: "tuzlu-su",
    keywords: [
      "mercan bakımı",
      "resif akvaryumu",
      "yumuşak mercan",
      "LPS mercan",
      "SPS mercan",
      "mercan besleme",
    ],
    updated: "2026-07-27",
    minutes: 10,
    blocks: [
      {
        type: "p",
        text: "Mercanlar, resif akvaryumunu diğer her şeyden ayıran canlılardır - hem hayvan, hem (içindeki simbiyotik alglerle) yarı bitki gibi davranırlar. Bu rehber mercan gruplarını, hangi sırayla başlanacağını ve temel bakım parametrelerini anlatır.",
      },
      { type: "h2", id: "gruplar", title: "Üç Büyük Grup" },
      {
        type: "table",
        headers: ["Grup", "Örnekler", "Zorluk", "İhtiyaç"],
        rows: [
          [
            "Yumuşak mercanlar",
            "Deri mercan, zoanthus, mantar, xenia, kenya ağacı",
            "Kolay",
            "Orta ışık, orta akıntı; parametre toleransı yüksek",
          ],
          [
            "LPS (iri poliplii taş mercanlar)",
            "Euphyllia (çekiç, meşale), duncan, acan, favia",
            "Orta",
            "Orta-güçlü ışık; stabil kalsiyum ve alkalinite",
          ],
          [
            "SPS (küçük polipli taş mercanlar)",
            "Acropora, montipora, stylophora",
            "İleri",
            "Çok güçlü ışık, güçlü akıntı, laboratuvar hassasiyetinde stabilite",
          ],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Başlangıç sıralaması",
        text: "Yumuşak → LPS → SPS. İlk mercanlarınız için ideal adaylar: mantar mercanlar, zoanthus, kenya ağacı ve deri mercan. Bunlar hataları affeder ve hızlı büyüyerek moral verir.",
      },
      { type: "h2", id: "parametreler", title: "Resif Parametreleri" },
      {
        type: "table",
        headers: ["Parametre", "Hedef", "Not"],
        rows: [
          ["Sıcaklık", "25-26°C", "Günlük ±0,5°C'den az oynamalı"],
          ["Tuzluluk", "1.025-1.026 SG", "ATO ile sabitleyin"],
          ["Alkalinite (dKH)", "7-10", "En kritik parametre; ani değişim mercan öldürür"],
          ["Kalsiyum", "400-450 ppm", "Taş mercanlar iskelet için tüketir"],
          ["Magnezyum", "1250-1350 ppm", "Ca ve dKH dengesinin sigortası"],
          ["Nitrat", "2-10 ppm", "Sıfır nitrat da zararlıdır - mercanlar az besin ister"],
          ["Fosfat", "0.02-0.1 ppm", "Yüksekse yosun, sıfırsa mercan solar"],
        ],
      },
      { type: "h2", id: "yerlestirme", title: "Mercan Yerleştirme" },
      {
        type: "ul",
        items: [
          "Işık ihtiyacına göre katmanlayın: SPS üstte, LPS ortada, yumuşaklar alt ve gölgeli bölgelerde.",
          "Mercanlar savaşır! Özellikle euphyllia türleri uzun savaş polipleriyle komşularını yakar - her mercana en az 10-15 cm büyüme payı bırakın.",
          "Yeni mercanı önce alçak bir noktaya koyup tankın ışığına 1-2 haftada alıştırın, sonra kalıcı yerine taşıyın.",
          "Frag (küçük parça) almak hem ekonomiktir hem adaptasyonu kolaydır - büyük koloniden daha hızlı uyum sağlar.",
        ],
      },
      { type: "h2", id: "besleme", title: "Mercan Beslemesi" },
      {
        type: "p",
        text: "Mercanların çoğu enerjisinin büyük kısmını ışıkla (içlerindeki zooxanthellae algleri sayesinde) üretir; kalanını sudan süzdükleri planktonla tamamlar. Haftada 1-2 kez mercan yemi (toz/sıvı plankton karışımları) beslemek renk ve büyümeyi belirgin destekler. LPS mercanlara haftada bir tek tük et parçası (mysis, karides) hedefli verilebilir.",
      },
      { type: "h2", id: "takviye", title: "Element Takviyesi" },
      {
        type: "ul",
        items: [
          "Az mercanlı tanklarda haftalık %10-15 su değişimi, tükettikleri elementleri tek başına yerine koyar - ekstra takviye gerekmez.",
          "Taş mercan yoğunluğu arttıkça kalsiyum ve alkalinite tüketimi su değişiminin karşılayabileceğini aşar; iki parçalı (balling) solüsyonlarla günlük dozlama başlar.",
          "Kural: Ölçmediğiniz hiçbir şeyi dozlamayın. Takviye, test sonucuna göre yapılır; körlemesine dozlama tankları çökerten bir hatadır.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Mercan sararması/beyazlaması",
        text: "Mercan dokusunun beyazlaması (bleaching) genelde ışık şoku, sıcaklık artışı veya alkalinite dalgalanmasının işaretidir. Parametreleri test edin, ışığı kısın ve stabiliteyi geri kurun - beyazlayan mercan hızlı müdahaleyle kurtulabilir.",
      },
    ],
    faq: [
      {
        q: "Mercan için hangi ışık gerekir?",
        a: "Tam spektrumlu, mavi ağırlıklı resif LED armatürleri standarttır. Yumuşak mercanlar orta seviye ışıkla yetinir; SPS ciddi PAR değerleri ister. Armatür seçiminde tank derinliğinizi mutlaka hesaba katın.",
      },
      {
        q: "Mercanlar balıklarla uyumlu mu?",
        a: "Resif güvenli (reef-safe) türler sorunsuzdur: palyaço, kromis, kayabalıkları, ateş balığı. Melek balıklarının bir kısmı ve tetikçi balıklar mercan didikler - tür seçiminde 'reef-safe' etiketini kontrol edin.",
      },
    ],
    related: ["tuzlu-su-akvaryumuna-giris", "canli-kaya-ve-olgunlasma", "protein-skimmer", "aydinlatma-rehberi"],
  },
  {
    slug: "protein-skimmer",
    title: "Protein Skimmer Nedir, Nasıl Çalışır ve Nasıl Ayarlanır?",
    description:
      "Tuzlu su akvaryumunun imza ekipmanı protein skimmer'ın çalışma prensibi, seçimi, kurulumu, ıslak-kuru köpük ayarı ve bakımı.",
    category: "tuzlu-su",
    keywords: [
      "protein skimmer",
      "skimmer nedir",
      "skimmer ayarı",
      "tuzlu su filtre",
      "köpük ayırıcı",
    ],
    updated: "2026-07-27",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Protein skimmer (köpük ayırıcı), tuzlu su akvaryumlarının imza ekipmanıdır: organik atıkları amonyağa dönüşmeden ÖNCE sudan fiziksel olarak çıkarır. Tatlı suda çalışmayan bu teknoloji, tuzlu suyun kimyası sayesinde mümkündür.",
      },
      { type: "h2", id: "nasil-calisir", title: "Nasıl Çalışır?" },
      {
        type: "p",
        text: "Skimmer, reaksiyon odasında milyonlarca mikro hava kabarcığı üretir. Proteinler ve yağlı organik moleküller su-hava yüzeyine yapışma eğilimindedir; kabarcıklara tutunarak yukarı taşınır ve koyu renkli, kötü kokulu bir köpük hâlinde toplama kabında birikir. Kabı boşalttığınızda, o atıklar tankınızın azot yükünden kalıcı olarak çıkmış olur. Tuzlu su, küçük ve kararlı kabarcık oluşumuna izin verdiği için skimmer yalnız deniz sistemlerinde verimli çalışır.",
      },
      { type: "h2", id: "gerekli-mi", title: "Skimmer Şart mı?" },
      {
        type: "ul",
        items: [
          "FOWLR ve mercanlı sistemlerde şiddetle önerilir - balık yükü arttıkça vazgeçilmez hâle gelir.",
          "Az stoklu nano tanklarda sık su değişimiyle skimmersiz de yürütülür; ama hata payınız daralır.",
          "Skimmer ayrıca su yüzeyindeki yağ filmini kırar ve suya sürekli oksijen kazandırır - ikincil faydaları bile değerlidir.",
        ],
      },
      { type: "h2", id: "secim", title: "Skimmer Seçimi" },
      {
        type: "ul",
        items: [
          "Üretici derecelendirmesine güvenin ama bir beden büyük alın: '300 litreye kadar' yazan model, 200 litrelik yoğun stoklu tankta idealdir.",
          "Sump'lı sistemlerde sump içi (in-sump) modeller standarttır; sump yoksa askı (hang-on-back) modeller kullanılır.",
          "Kaliteli iğne çarklı (needle wheel) pompa, skimmer performansının kalbidir.",
        ],
      },
      { type: "h2", id: "ayar", title: "Islak mı, Kuru mu? Skimmer Ayarı" },
      {
        type: "steps",
        items: [
          {
            title: "Rodaj bekleyin",
            text: "Yeni skimmer ilk 1-2 hafta düzensiz çalışır - plastik yüzeylerdeki üretim kalıntıları köpük tutmayı engeller. Bu süre normaldir.",
          },
          {
            title: "Su seviyesini ayarlayın",
            text: "Reaksiyon odasındaki su seviyesi, boyun kısmının hemen altında duracak şekilde çıkış vanasını ayarlayın.",
          },
          {
            title: "Köpük kıvamını seçin",
            text: "Kuru köpük (seviye düşük): kapta koyu, yoğun, az sıvı birikir - daha seçici toplar. Islak köpük (seviye yüksek): açık renkli, bol sıvı - daha agresif toplar. Başlangıç için orta-kuru ayar idealdir.",
          },
          {
            title: "Gözlemleyip ince ayar yapın",
            text: "Kap 2-3 günde çay renginde sıvıyla doluyorsa ayar iyidir. Hiç birikmiyorsa seviyeyi yükseltin; berrak su doluyorsa alçaltın.",
          },
        ],
      },
      { type: "h2", id: "bakim", title: "Bakım" },
      {
        type: "ul",
        items: [
          "Toplama kabını haftada 1-2 kez boşaltıp yıkayın - boyun kısmındaki birikinti performansı hızla düşürür.",
          "Ayda bir pompayı ve hava girişini kontrol edin; tuz kristalleri hava hattını tıkayabilir.",
          "İlaç, mercan yemi veya bakteri dozlamasından sonra skimmer'ın taşması (overflow) normaldir - dozlamadan sonra birkaç saat kapatabilirsiniz.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Doğru model için",
        text: "Tank hacminizi, balık yükünüzü ve sump durumunuzu bize iletin - bütçenize uygun skimmer modelini birlikte seçelim.",
      },
    ],
    faq: [
      {
        q: "Skimmer tatlı su akvaryumunda çalışır mı?",
        a: "Hayır. Tatlı suda yüzey gerilimi, skimmer'ın ihtiyaç duyduğu küçük ve kararlı kabarcıkların oluşmasına izin vermez. Tatlı suda aynı işi düzenli su değişimi ve iyi filtrasyon görür.",
      },
      {
        q: "Skimmer sürekli mi çalışmalı?",
        a: "Evet, 7/24 çalışır. Yalnızca yemleme ve dozlama sonrası kısa süreli kapatmalar normaldir.",
      },
    ],
    related: ["tuzlu-su-akvaryumuna-giris", "resif-mercan-bakimi", "filtre-rehberi"],
  },
];
