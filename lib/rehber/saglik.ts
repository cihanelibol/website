import type { Article } from "./types";

export const saglikArticles: Article[] = [
  {
    slug: "balik-hastaliklari",
    title: "Yaygın Akvaryum Balığı Hastalıkları ve Tedavileri",
    description:
      "Beyaz benek, mantar, yüzgeç çürüklüğü, iç parazit ve daha fazlası: belirtiler, nedenler, tedavi yöntemleri ve ilaç kullanım kuralları.",
    category: "saglik",
    keywords: [
      "balık hastalıkları",
      "akvaryum balık tedavisi",
      "yüzgeç çürümesi",
      "balık mantarı",
      "balık ilacı kullanımı",
    ],
    updated: "2026-07-27",
    minutes: 11,
    blocks: [
      {
        type: "p",
        text: "Balık hastalıklarının neredeyse tamamının arkasında aynı hikâye vardır: stres ve bozuk su kalitesi bağışıklığı düşürür, ortamda zaten var olan patojenler fırsatı değerlendirir. Bu yüzden her tedavinin ilk adımı ilaç değil, su testidir. Bu rehber en yaygın hastalıkları teşhis ve tedavileriyle birlikte anlatır.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Tedavinin değişmez ilk adımı",
        text: "Hasta balık gördüğünüzde önce amonyak, nitrit, nitrat ve pH ölçün; ardından %30 su değişimi yapın. Vakaların önemli bölümü yalnızca su kalitesi düzeltilerek iyileşir - kötü suda ise hiçbir ilaç işe yaramaz.",
      },
      { type: "h2", id: "beyaz-benek", title: "Beyaz Benek (İch)" },
      {
        type: "p",
        text: "En yaygın akvaryum hastalığı. Vücut ve yüzgeçlerde tuz tanesi gibi beyaz noktalar, kaşınma (balığın dekorlara sürtünmesi) ve sıkışık yüzgeçlerle tanınır. Ayrıntılı tedavi protokolü için Beyaz Benek Tedavisi rehberimize bakın - özet: sıcaklığı kademeli 28-29°C'ye çıkarın ve etiket dozunda beyaz benek ilacı ile 7-10 gün tedavi uygulayın.",
      },
      { type: "h2", id: "mantar", title: "Mantar Enfeksiyonları" },
      {
        type: "ul",
        items: [
          "Belirti: vücutta veya ağız çevresinde pamuk benzeri beyaz-gri tüylü oluşumlar.",
          "Neden: yaralanma, taşıma hasarı veya kronik kötü su; mantar hemen her zaman ikincil istilacıdır.",
          "Tedavi: mantar ilacı (genelde metilen mavisi/malahit yeşili esaslı) + su kalitesinin düzeltilmesi. Yaralı bölge büyükse karantina tankında tedavi edin.",
          "Karışabilir: ağız çevresi 'mantarı' bazen bakteriyel columnaris'tir - ilerlemesi çok hızlıysa bakteriyel tedaviye geçin.",
        ],
      },
      { type: "h2", id: "yuzgec-curuklugu", title: "Yüzgeç Çürüklüğü (Fin Rot)" },
      {
        type: "ul",
        items: [
          "Belirti: yüzgeç kenarlarında beyazımsı/kızarık düzensiz erime; ilerledikçe yüzgeç kısalır.",
          "Neden: kötü su kalitesi + stres; kavgacı tank arkadaşlarının ısırıkları da zemin hazırlar.",
          "Tedavi: erken evrede sadece temiz su (haftada 2-3 kez %25 değişim) yeterli olabilir; ilerlemiş vakada geniş spektrumlu bakteriyel ilaç kullanın.",
          "Yüzgeç dokusu, çürüme durdurulduktan sonra çoğunlukla kendini yeniler.",
        ],
      },
      { type: "h2", id: "ic-parazit", title: "İç Parazitler" },
      {
        type: "ul",
        items: [
          "Belirti: iştah olduğu hâlde zayıflama, karın çöküklüğü, beyaz-şeffaf iplik gibi dışkı, renk solması.",
          "Tedavi: iç parazit ilaçları (praziquantel/levamisol esaslı) veya ilaçlı yem. Tedavi tüm tanka uygulanmalıdır; parazitler seçici davranmaz.",
          "Yeni alınan balıklarda görülme olasılığı yüksektir - karantinanın en büyük gerekçelerinden biri.",
        ],
      },
      { type: "h2", id: "hidrops", title: "Hidrops (Dropsy / Pul Kabarması)" },
      {
        type: "ul",
        items: [
          "Belirti: vücudun şişmesi ve pulların çam kozalağı gibi kabarması - böbrek yetmezliğinin dış görüntüsüdür.",
          "Gerçekçi olmak gerekirse: hidrops fark edildiğinde iç organ hasarı genelde ilerlemiştir; tedavi başarısı düşüktür.",
          "Deneme protokolü: karantina tankı + akvaryum tuzu (dikkatli dozda) + geniş spektrum antibakteriyel + birinci sınıf su kalitesi.",
          "Asıl mücadele önleyicidir: hidrops neredeyse daima kronik kötü bakımın son halkasıdır.",
        ],
      },
      { type: "h2", id: "kadife", title: "Kadife Hastalığı (Velvet/Oodinium)" },
      {
        type: "ul",
        items: [
          "Belirti: vücutta beyaz benekten daha ince, altın sarısı-gri toz serpilmiş görünüm; ışığı yandan tutunca fark edilir.",
          "Beyaz benekle karışır ama daha hızlı öldürücüdür - tedavisi bakır esaslı ilaçlarla yapılır.",
          "Tedavi sırasında ışığı karartın (parazit fotosentez yapar) ve karbon filtresini çıkarın.",
        ],
      },
      { type: "h2", id: "ilac-kurallari", title: "İlaç Kullanmanın 7 Kuralı" },
      {
        type: "steps",
        items: [
          {
            title: "Önce teşhis",
            text: "Emin değilseniz balığın net bir fotoğrafını çekip bize WhatsApp'tan gönderin - yanlış ilaç, zaman ve balık kaybettirir.",
          },
          {
            title: "Aktif karbonu çıkarın",
            text: "Filtredeki karbon, ilacı sudan emerek tedaviyi etkisiz kılar. Tedavi bitince karbonu geri takıp ilaç kalıntısını temizleyebilirsiniz.",
          },
          {
            title: "Doz = gerçek su hacmi",
            text: "Brüt tank hacmi değil; taban, kaya ve dekor düşüldükten sonraki gerçek su hacmine göre dozlayın (brüt hacmin ~%80-85'i).",
          },
          {
            title: "Kürü yarıda kesmeyin",
            text: "Belirtiler kaybolsa bile etiketteki tedavi süresini tamamlayın; erken kesilen kür nüksün baş sebebidir.",
          },
          {
            title: "Havalandırmayı artırın",
            text: "Çoğu ilaç ve yüksek sıcaklık sudaki oksijeni düşürür; tedavi boyunca hava taşı ekleyin.",
          },
          {
            title: "Omurgasızları koruyun",
            text: "Bakır içeren ilaçlar karides ve salyangozlar için ölümcüldür. Omurgasızlı tanklarda tedaviyi karantina tankında yapın.",
          },
          {
            title: "Tedavi sonrası toparlanma",
            text: "Kür bitince kademeli su değişimleriyle ilacı uzaklaştırın ve bakteri kültürüyle biyolojik filtreyi destekleyin.",
          },
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Teşhiste yardım",
        text: "Balığınızın fotoğrafını ve su test değerlerinizi bize gönderin; doğru teşhis ve mağazamızdaki uygun ilaçla tedavi planını birlikte kuralım.",
      },
    ],
    faq: [
      {
        q: "Hasta balığı hemen ayırmalı mıyım?",
        a: "Bulaşıcı görünen durumlarda (beyaz benek, kadife, columnaris) evet - karantina tankına alın. Ancak beyaz benek gibi paraziter hastalıklarda ana tank da tedavi edilmelidir; parazit suda serbest evrede yaşar.",
      },
      {
        q: "Akvaryum tuzu her hastalığa iyi gelir mi?",
        a: "Hayır ama iyi bir destekçidir: düşük doz tuz (litreye 1-2 g) osmotik stresi azaltır ve bazı dış parazitleri baskılar. Tuza duyarlı türlerde (koridoras, bazı tetralar) ve bitkili tanklarda dikkatli kullanın.",
      },
      {
        q: "Bir balık öldü, diğerleri için ne yapmalıyım?",
        a: "Ölü balığı hemen çıkarın, su testi yapın, %30 su değişimi uygulayın ve kalan balıkları birkaç gün yakından izleyin. Ölüm sebebi belirsizse ve art arda kayıp varsa bize danışın.",
      },
    ],
    related: ["beyaz-benek", "karantina", "stres-belirtileri", "su-testleri"],
  },
  {
    slug: "beyaz-benek",
    title: "Beyaz Benek Hastalığı (İch): Kesin Tedavi Protokolü",
    description:
      "Akvaryumun en yaygın hastalığı beyaz benek nasıl tedavi edilir? Parazitin yaşam döngüsü, sıcaklık yöntemi, ilaç protokolü ve önleme.",
    category: "saglik",
    keywords: [
      "beyaz benek hastalığı",
      "ich tedavisi",
      "beyaz benek ilacı",
      "balıkta beyaz noktalar",
      "ich nasıl geçer",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Balıklarınızın üzerinde tuz serpilmiş gibi beyaz noktalar mı belirdi? Bu, her akvaryumcunun er ya da geç tanıştığı beyaz benek (Ichthyophthirius multifiliis) parazitidir. İyi haber: erken fark edilirse doğru protokolle neredeyse her zaman tam iyileşme sağlanır. Kötü haber: yanlış tedaviyle günler kaybedilirse salgına dönüşür.",
      },
      { type: "h2", id: "teshis", title: "Teşhis" },
      {
        type: "ul",
        items: [
          "Vücutta ve yüzgeçlerde 0,5-1 mm, belirgin sınırlı beyaz noktalar (tuz tanesi görünümü).",
          "Balığın dekorlara ve tabana sürtünmesi (kaşınma davranışı).",
          "Sıkışık yüzgeçler, durgunluk, ileri evrede hızlı solunum (parazit solungaçlara da yerleşir).",
          "Karıştırmayın: erkek balıklarda üreme tüberkülleri (sadece solungaç kapağı/yüzgeç ucunda simetrik noktalar) ve kadife hastalığı (daha ince, sarımsı toz görünümü) farklıdır.",
        ],
      },
      { type: "h2", id: "yasam-dongusu", title: "Neden Su da Tedavi Edilmeli? Parazitin Yaşam Döngüsü" },
      {
        type: "p",
        text: "İch'in kritik özelliği üç evreli yaşam döngüsüdür: balığın üzerindeki beyaz nokta (trofont) ilaçlara karşı zırhlıdır. Parazit olgunlaşınca balıktan ayrılır, tabanda kist (tomont) olur ve patlayarak yüzlerce serbest yüzücü (theront) salar. İlaçlar YALNIZCA bu serbest evreyi öldürebilir. Bu yüzden tedavi tanka uygulanır (sadece balığa değil) ve döngü kırılana kadar günlerce sürdürülür.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Sıcaklık neden işe yarar?",
        text: "Parazitin döngüsü 25°C'de ~1 hafta, 29°C'de 3-4 gün sürer. Sıcaklığı yükseltmek paraziti ilaçlara açık serbest evreye daha hızlı sokar - tedaviyi kısaltır.",
      },
      { type: "h2", id: "protokol", title: "Adım Adım Tedavi Protokolü" },
      {
        type: "steps",
        items: [
          {
            title: "Su testi + %30 değişim",
            text: "Her tedavinin ilk adımı. Bozuk değerler bağışıklığı düşürür ve tedaviyi baltalar.",
          },
          {
            title: "Sıcaklığı kademeli yükseltin",
            text: "Günde en fazla 1-2°C artışla 28-29°C'ye çıkın. Ani ısıtma stresi artırır. Isıya duyarlı türler varsa 27°C'de kalın ve tedaviyi biraz uzatın.",
          },
          {
            title: "Havalandırmayı artırın",
            text: "Sıcak su daha az oksijen tutar; hava motoru/taşı ekleyin.",
          },
          {
            title: "Karbonu çıkarın, ilacı başlayın",
            text: "Filtreden aktif karbonu alın. Beyaz benek ilacını (malahit yeşili/formalin veya bitkisel esaslı) etiket dozunda uygulayın. Karides/salyangoz ve hassas türler (koridoras, çöpçüler) için etiketteki yarı doz uyarılarını kontrol edin.",
          },
          {
            title: "Kürü tamamlayın",
            text: "Beyaz noktalar genelde 3-4 günde kaybolur - ama tedaviyi kesmeyin! Görünmeyen serbest evre sudadır. Son beyaz noktanın kaybolmasından sonra en az 3-4 gün (toplam 7-10 gün) devam edin.",
          },
          {
            title: "Toparlanma",
            text: "Kür bitince sıcaklığı kademeli normale indirin, %25-30 su değişimi yapın, karbonu takıp kalan ilacı temizleyin.",
          },
        ],
      },
      { type: "h2", id: "onleme", title: "Önleme" },
      {
        type: "ul",
        items: [
          "Yeni balıklara 2 hafta karantina - beyaz benek tanka neredeyse her zaman yeni canlıyla girer.",
          "Ani sıcaklık düşüşlerinden kaçının; soğuk şoku, klasik ich tetikleyicisidir (ısıtıcı arızalarına dikkat).",
          "Su değişiminde yeni suyun sıcaklığını eşitleyin.",
          "Stres yönetimi: doğru tür kombinasyonu, yeterli saklanma alanı, düzenli bakım.",
        ],
      },
    ],
    faq: [
      {
        q: "İlaçsız, sadece sıcaklıkla tedavi olur mu?",
        a: "30°C ve üzerinde parazitin çoğu suşu üreyemez; dayanıklı balıklarda 10 gün 30°C + günlük taban sifonu ile ilaçsız başarı mümkündür. Ancak ısıya toleranslı olmayan türlerde ve yoğun vakalarda ilaçlı protokol daha güvenlidir.",
      },
      {
        q: "Beyaz benek insana veya diğer evcil hayvanlara bulaşır mı?",
        a: "Hayır - ich yalnızca balıklara özgü bir parazittir.",
      },
      {
        q: "Balıksız tank beyaz benekten ne zaman temizlenir?",
        a: "Konak bulamayan parazit ölür: 26°C+ sıcaklıkta balıksız bekletilen tank ~2 hafta içinde güvenli hâle gelir.",
      },
    ],
    related: ["balik-hastaliklari", "karantina", "stres-belirtileri", "isitici-kullanimi"],
  },
  {
    slug: "karantina",
    title: "Karantina Tankı Kurulumu ve Kullanımı",
    description:
      "Yeni balıklar için karantina neden şart? Basit karantina tankı kurulumu, karantina süresi, gözlem listesi ve hastane tankı olarak kullanım.",
    category: "saglik",
    keywords: [
      "karantina tankı",
      "balık karantinası",
      "hastane tankı",
      "yeni balık ekleme",
      "karantina süresi",
    ],
    updated: "2026-07-27",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Ana akvaryumunuza giren her yeni canlı, beraberinde görünmez yolcular getirebilir: parazitler, bakteriler, mantar sporları. Karantina, bu yolcuların ana tankınıza ulaşmasını önleyen tek güvenilir bariyerdir. Kulağa külfetli gelir ama basit bir kurulum yeterlidir - ve tek bir salgının maliyeti, karantina tankının maliyetini kat kat aşar.",
      },
      { type: "h2", id: "kurulum", title: "Basit Karantina Kurulumu" },
      {
        type: "ul",
        items: [
          "Tank: 20-40 litre çıplak (tabansız) bir tank yeterlidir. Çıplak taban temizliği ve gözlemi kolaylaştırır.",
          "Filtre: küçük bir sünger filtre (pipo filtre) idealdir - nazik akıntı üretir ve ilaçlardan etkilenmez.",
          "Isıtıcı + termometre: ana tankla aynı sıcaklık.",
          "Saklanma yeri: bir PVC boru parçası veya seramik saksı - dekor değil, stres azaltıcı.",
          "Işık: şart değil; loş ortam yeni balığı sakinleştirir.",
          "Kapak: yeni ve stresli balıklar zıplamaya en meyilli olanlardır.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Sünger filtre hilesi",
        text: "Ana tankınızın filtresinde sürekli bir yedek sünger bulundurun. Karantina gerektiğinde bu 'olgun' süngeri sünger filtreye takın - karantina tankınız ilk günden döngülü olur, amonyak riski yaşamazsınız.",
      },
      { type: "h2", id: "surec", title: "Karantina Süreci" },
      {
        type: "steps",
        items: [
          {
            title: "Alıştırma",
            text: "Yeni balığı normal alıştırma prosedürüyle (yüzdürme + kademeli su ekleme) karantina tankına alın.",
          },
          {
            title: "2-4 hafta gözlem",
            text: "Minimum 2 hafta; hassas veya yabani kökenli türlerde 4 hafta. Bu süre, çoğu hastalığın kuluçka döneminin belirti vermesine yeter.",
          },
          {
            title: "Günlük kontrol listesi",
            text: "İştah yerinde mi? Dışkı normal mi (beyaz iplik dışkı = iç parazit şüphesi)? Vücutta nokta, benek, pamuklaşma, yara var mı? Solunum sakin mi? Yüzüş dengeli mi?",
          },
          {
            title: "Su bakımı",
            text: "Küçük hacim hızlı kirlenir: haftada 2 kez %30 su değişimi yapın. Su, ana tanktan alınırsa balık ana tankın kimyasına da alışmış olur.",
          },
          {
            title: "Transfer",
            text: "Süre boyunca hiçbir belirti yoksa balığı kepçeyle ana tanka aktarın. Karantina suyunu ana tanka karıştırmayın.",
          },
        ],
      },
      { type: "h2", id: "hastane", title: "Hastane Tankı Olarak Kullanım" },
      {
        type: "ul",
        items: [
          "Aynı kurulum, hasta balıkların tedavisi için de kullanılır: küçük hacimde ilaç daha ekonomiktir ve ana tankın biyolojik dengesi ilaçtan zarar görmez.",
          "Bakır içeren ilaçlar karantina tankında güvenle kullanılabilir - ana tanktaki karides ve salyangozlar etkilenmez.",
          "Yaralı veya hedef gösterilen (sürekli kovalanan) balıklar için dinlenme alanı olarak da işlev görür.",
          "Tedavi sonrası tankı ve ekipmanı sıcak suyla iyice temizleyin; farklı vakalar arasında dezenfeksiyon önemlidir.",
        ],
      },
      { type: "h2", id: "bitki-karantina", title: "Bitki ve Dekor Karantinası" },
      {
        type: "p",
        text: "Hastalık yalnızca balıkla gelmez: bitkiler salyangoz ve parazit kisti taşıyabilir. Yeni bitkileri akvaryuma atmadan önce bol suyla durulayın; hassas tanklar için 5-7 gün balıksız bir kapta bekletmek en güvenlisidir. Başka bir akvaryumdan gelen dekor ve ekipmanı da kullanmadan önce iyice yıkayıp kurutun - kuruma, çoğu balık patojenini öldürür.",
      },
    ],
    faq: [
      {
        q: "Karantina tankını sürekli çalışır tutmalı mıyım?",
        a: "Gerekmez. Boş tankı kaldırın; ihtiyaç anında kurup ana filtreden olgun sünger takarak dakikalar içinde hazır edin. Sürekli yedek sünger bulundurmak bu esnekliği sağlar.",
      },
      {
        q: "Karantinada ilaç kullanmalı mıyım (önleyici tedavi)?",
        a: "Sağlıklı görünen balıkta rutin önleyici ilaç önermiyoruz - gereksiz ilaç stres ve direnç yaratır. Gözlem yeterlidir; belirti çıkarsa hedefli tedavi uygulanır.",
      },
    ],
    related: ["balik-hastaliklari", "beyaz-benek", "ilk-baliklar", "stres-belirtileri"],
  },
  {
    slug: "yemleme-rehberi",
    title: "Balık Yemleme Rehberi: Ne Kadar, Ne Sıklıkla, Hangi Yem?",
    description:
      "Doğru yemleme miktarı, yem türleri (pul, granül, tablet, canlı, dondurulmuş), tür bazlı beslenme ve aşırı yemlemenin zararları.",
    category: "saglik",
    keywords: [
      "balık yemi",
      "balık yemleme",
      "ne kadar yem verilmeli",
      "akvaryum yem çeşitleri",
      "aşırı yemleme",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "İnanması güç ama gerçek: akvaryumda açlıktan ölen balık yok denecek kadar azdır, aşırı yemlemeden (dolaylı olarak) ölen balık ise sayılamayacak kadar çoktur. Fazla yem, suyu kirleterek amonyak üretir; kirli su hastalık getirir. Doğru yemleme, akvaryum sağlığının en ucuz sigortasıdır.",
      },
      { type: "h2", id: "miktar", title: "Altın Kural: 2-3 Dakika" },
      {
        type: "ul",
        items: [
          "Günde 1-2 öğün, her öğünde balıkların 2-3 dakikada tamamen bitirebileceği kadar yem verin.",
          "Dibe çöküp kalan yem 'sonra yenir' değil, 'su kirletir' demektir - 5 dakika sonra kalanı sifonla/kepçeyle alın.",
          "Balık midesi yaklaşık gözü kadardır; 'aç bakışlar' gerçek açlık değil, öğrenilmiş dilenme davranışıdır.",
          "Haftada 1 gün yemsiz bırakmak sindirimi dinlendirir ve tamamen sağlıklıdır.",
          "Yavru balıklar istisnadır: günde 3-5 küçük öğünle beslenirler.",
        ],
      },
      { type: "h2", id: "yem-turleri", title: "Yem Türleri ve Kullanım Alanları" },
      {
        type: "table",
        headers: ["Yem", "Kimin için", "Not"],
        rows: [
          ["Pul yem", "Yüzey ve orta su balıkları (tetra, lepistes)", "Genel amaçlı standart; açıldıktan sonra 3-4 ayda tazeleyin"],
          ["Granül yem", "Orta boy ve iri balıklar (melek, ciklet)", "Yavaş batar; boyutu balık ağzına uygun seçin"],
          ["Batan tablet", "Dip balıkları (koridoras, çöpçü, vatoz)", "Işık kapandıktan sonra atmak, çekingen dip balıklarına ulaşmasını garantiler"],
          ["Spirulina/bitkisel yem", "Moli, pleco, otçul cikletler", "Otçul türlerde sindirimi düzenler, renk destekler"],
          ["Dondurulmuş yem (kan kurdu, artemia, mysis)", "Tüm etçil/hepçil türler", "Haftada 1-2 takviye; suda çözdürüp süzerek verin"],
          ["Canlı yem (artemia, su piresi)", "Üreme kondisyonu, nazlı yiyiciler", "En güçlü kondisyon aracı; güvenilir kaynaktan alın"],
          ["Yaprak/wafer yem", "Karidesler, otçul dipçiler", "Karides kolonisinin ana yemi"],
        ],
      },
      { type: "h2", id: "cesitlilik", title: "Çeşitlilik Neden Önemli?" },
      {
        type: "p",
        text: "Tek tip yem, tek tip vitamin demektir. Ana yem olarak kaliteli bir pul/granül, haftada 1-2 kez dondurulmuş yem takviyesi ve otçullar için bitkisel destek - bu üçlü, renklerin canlanması, bağışıklığın güçlenmesi ve üreme davranışının tetiklenmesi arasındaki farkı yaratır. Ayrıca haşlanmış sebzeler (kabak, bezelye içi, ıspanak) otçul türler ve karidesler için mükemmel doğal takviyedir.",
      },
      { type: "h2", id: "katmanlar", title: "Her Katmana Yem Ulaşıyor mu?" },
      {
        type: "ul",
        items: [
          "Topluluk tankında sık yapılan hata: sadece pul yem atmak. Yüzeydeki hızlı balıklar hepsini kapar, dip balıkları aç kalır.",
          "Çözüm: pul/granül ile birlikte birkaç batan tablet atın; tabletleri farklı noktalara bırakın.",
          "Çekingen ve gece aktif türler (bazı çöpçüler) için ışık kapandıktan sonra yemleme yapın.",
          "Yeme hiç gelmeyen balık = ilk hastalık alarmı. Yemleme saati aynı zamanda günlük sağlık kontrolüdür.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Aşırı yemlemenin zinciri",
        text: "Fazla yem → çürüme → amonyak/nitrat artışı → yosun patlaması + bağışıklık düşüşü → hastalık. Akvaryumdaki sorunların şaşırtıcı bir bölümü yemleme kaşığında başlar.",
      },
      { type: "h2", id: "tatil", title: "Tatilde Yemleme" },
      {
        type: "ul",
        items: [
          "2-3 gün: hiçbir şey yapmayın - sağlıklı yetişkin balık için sorun değildir.",
          "4-14 gün: otomatik yemleme makinesi kurun; gitmeden birkaç gün önce test edin.",
          "Emanetçi varsa: günlük porsiyonları ayrı ayrı paketleyin. 'Az miktarda' tarifi her zaman fazla yemlemeyle sonuçlanır.",
          "Tatil bloklarına (weekend feeder) dikkat: bazıları suyu bulandırır; önce kısa süreli deneyin.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Yem seçiminde destek",
        text: "Mağazamızda tüm yem kategorileri mevcut. Tankınızdaki türleri söyleyin, katman katman doğru yem kombinasyonunu birlikte kuralım.",
      },
    ],
    faq: [
      {
        q: "Balıklarım sürekli aç gibi davranıyor, az mı yemliyorum?",
        a: "Büyük ihtimalle hayır. Balıklar fırsatçı yiyicidir ve camda hareket gördüğünde yem dilenmeyi öğrenir. Ölçüt davranış değil, vücut hattıdır: hafif dolgun karın ideal, çökük karın yetersiz, şişkin sarkık karın fazla demektir.",
      },
      {
        q: "Hangi yem markası en iyisi?",
        a: "Tek 'en iyi' yoktur; taze olması (üretim tarihi yeni, açılalı 3-4 ayı geçmemiş) ve türe uygun formda olması markadan daha önemlidir. Büyük kutu almak yerine küçük kutuyu sık tazelemek daha sağlıklıdır.",
      },
      {
        q: "Ekmek, pirinç gibi ev yiyecekleri verilebilir mi?",
        a: "Hayır - ekmek ve tahıllar balık sindirimine uygun değildir ve suyu hızla bozar. Ev takviyesi olarak yalnızca haşlanmış sebze (kabak, bezelye) ve haşlanmış yumurta akı (ölçülü) uygundur.",
      },
    ],
    related: ["ilk-baliklar", "haftalik-bakim-rutini", "azot-dongusu", "karides-ve-salyangozlar"],
  },
  {
    slug: "stres-belirtileri",
    title: "Balıklarda Stres Belirtileri ve Çözümleri",
    description:
      "Balığınızın stresli olduğunu nasıl anlarsınız? Renk solması, saklanma, hızlı solunum gibi belirtiler, stres kaynakları ve kalıcı çözümler.",
    category: "saglik",
    keywords: [
      "balık stresi",
      "balık davranışları",
      "balık neden saklanıyor",
      "balık renk solması",
      "akvaryum stres",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Stres, balık sağlığının görünmez düşmanıdır: doğrudan öldürmez ama bağışıklığı çökerterek kapıyı hastalıklara açar. Kronik stresli bir balık, er ya da geç hasta bir balıktır. Bu rehber stresi erken tanımayı ve kaynağında çözmeyi öğretir.",
      },
      { type: "h2", id: "belirtiler", title: "Stres Nasıl Tanınır?" },
      {
        type: "ul",
        items: [
          "Renk solması - en erken ve en güvenilir işaretlerden; stresli balığın renkleri griye çalar.",
          "Sürekli saklanma veya tam tersi köşede/camda donakalma.",
          "Hızlı solungaç hareketi (dinlenirken bile 'nefes nefese' görünüm).",
          "İştah kaybı - sağlıklı balık yemi asla reddetmez.",
          "Cam boyunca aşağı-yukarı deli gibi yüzme (glass surfing).",
          "Sıkışık (kapalı) yüzgeçlerle yüzme.",
          "Ani irkilme, sıçrama, panik dalışları.",
          "Yüzeyden hava yutma (su içinde oksijen sorununun işareti).",
        ],
      },
      { type: "h2", id: "kaynaklar", title: "Stres Kaynakları ve Çözümleri" },
      {
        type: "table",
        headers: ["Kaynak", "İpucu", "Çözüm"],
        rows: [
          [
            "Kötü su kalitesi",
            "Belirtiler tüm balıklarda aynı anda",
            "Test + su değişimi; rutini sıklaştırın",
          ],
          [
            "Yanlış sıcaklık / dalgalanma",
            "Dipte durgunluk (soğuk) veya yüzeyde solunum (sıcak)",
            "Isıtıcıyı doğrulayın, termometreyle çapraz kontrol",
          ],
          [
            "Uyumsuz tank arkadaşları",
            "Tek balık hedef hâlinde; yüzgeç hasarı",
            "Saldırganı veya mağduru ayırın; tür uyumunu bize danışın",
          ],
          [
            "Yalnız sürü balığı",
            "Tek kalan tetra/danio ürkek ve soluk",
            "Sürüyü 6+ bireye tamamlayın",
          ],
          [
            "Saklanma alanı yokluğu",
            "Balıklar sürekli diken üstünde",
            "Bitki, kütük, mağara ekleyin - sığınağı olan balık daha çok ortada gezer",
          ],
          [
            "Aşırı kalabalık",
            "Kronik yosun + sık hastalık + kovalamaca",
            "Stoklamayı azaltın veya tankı büyütün",
          ],
          [
            "Dış etkenler",
            "Cama vurma, ani ışık, TV/hoparlör titreşimi",
            "Tankın yerini/alışkanlıkları düzenleyin; ışığı alacakaranlıkla açıp kapatın",
          ],
        ],
      },
      { type: "h2", id: "akut-stres", title: "Akut Stres: Taşıma ve Yeni Ortam" },
      {
        type: "ul",
        items: [
          "Yeni gelen balığın 1-2 gün saklanması, soluk olması ve yememesi NORMALDİR - panik yapmayın, ilaç atmayın.",
          "İlk gün ışığı kapalı/loş tutun, yem vermeyin, tanka müdahale etmeyin.",
          "Alıştırmayı (aklimasyon) aceleye getirmeyin: sıcaklık + kademeli su karışımı en az 30-40 dakika.",
          "Taşıma sonrası ölümlerin çoğu balığın 'zayıflığından' değil, alıştırma hatasından kaynaklanır.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Gözlem alışkanlığı",
        text: "Her yemlemede 2 dakika bilinçli gözlem yapın: kim yemedi, kimin rengi soluk, kim saklanıyor? Stresi erken yakalayan akvaryumcu, hastalıkla neredeyse hiç tanışmaz.",
      },
    ],
    faq: [
      {
        q: "Balığım camda aşağı yukarı yüzüp duruyor, ne demek?",
        a: "'Glass surfing' genelde ortam yetersizliğinin (küçük tank, saklanma alanı yokluğu, yalnızlık) veya su kalitesi sorununun işaretidir. Önce su testi yapın, sonra ortamı zenginleştirin.",
      },
      {
        q: "Işık açılınca balıklar panikliyor, normal mi?",
        a: "Karanlıktan aniden parlak ışığa geçiş balıkları ürkütür. Önce oda ışığını, birkaç dakika sonra akvaryum ışığını açın - ya da alacakaranlık modlu LED kullanın.",
      },
    ],
    related: ["balik-hastaliklari", "ilk-baliklar", "karantina", "su-parametreleri"],
  },
];
