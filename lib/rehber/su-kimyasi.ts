import type { Article } from "./types";

export const suKimyasiArticles: Article[] = [
  {
    slug: "su-parametreleri",
    title: "pH, GH, KH: Akvaryum Su Parametreleri Rehberi",
    description:
      "Akvaryumda pH, genel sertlik (GH), karbonat sertliği (KH) ve sıcaklık ne anlama gelir? İdeal değerler, ölçüm ve güvenli ayarlama yöntemleri.",
    category: "su-kimyasi",
    keywords: [
      "akvaryum pH",
      "su sertliği",
      "GH KH nedir",
      "akvaryum su değerleri",
      "ideal su parametreleri",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "Su, balıklarınızın hem evi hem havasıdır - ve her su aynı değildir. pH, sertlik ve sıcaklık, canlılarınızın konforunu belirleyen üç temel parametredir. İyi haber: bu değerleri anlamak kimya diploması gerektirmez. Bu rehber her parametreyi tek tek, pratik karşılıklarıyla açıklar.",
      },
      { type: "h2", id: "ph", title: "pH: Suyun Asitlik Dengesi" },
      {
        type: "p",
        text: "pH, suyun asitlik/bazlık ölçüsüdür: 7 nötr, altı asidik, üstü baziktir. Çoğu tropikal tatlı su balığı 6.5-7.5 aralığında mutludur; Türkiye musluk suyu genelde 7.2-8.0 civarındadır ve yaygın türlerin tamamı buna uyum sağlar.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Asıl tehlike değer değil, değişim hızıdır",
        text: "Balıklar 'yanlış' ama sabit pH'a uyum sağlar; ani pH sıçramasına sağlayamaz. Günde 0.3'ten fazla pH oynaması strese, 1.0'lık ani değişim ölüme yol açabilir. pH ayarlaması her zaman yavaş ve kademeli yapılır.",
      },
      {
        type: "ul",
        items: [
          "pH'ı düşürmek için: kütük ve yaprak (doğal tanik asit), turba (peat) filtrasyonu, RO su karışımı.",
          "pH'ı yükseltmek için: kalker/mercan kırığı taban, havalandırmayı artırmak (CO2 atılımı pH'ı yükseltir).",
          "Hızlı pH+/pH- kimyasallarına dikkat: etkileri geçicidir ve sıçramalara yol açar; KH bilgisi olmadan kullanmayın.",
        ],
      },
      { type: "h2", id: "gh", title: "GH: Genel Sertlik" },
      {
        type: "p",
        text: "GH, sudaki çözünmüş kalsiyum ve magnezyum miktarıdır - 'suyun mineral zenginliği' diye düşünebilirsiniz. Balıkların osmoregülasyonunu (vücut sıvı dengesi) doğrudan etkiler. Canlı doğuranlar (lepistes, moli) sert suyu, yumuşak su tetraları ve diskus yumuşak suyu sever.",
      },
      {
        type: "table",
        headers: ["GH (dGH)", "Tanım", "Uygun canlılar"],
        rows: [
          ["0-4", "Çok yumuşak", "Diskus, kristal karides, yabani tetralar"],
          ["4-8", "Yumuşak", "Tetralar, rasboralar, çoğu bitki"],
          ["8-12", "Orta sert", "Topluluk balıklarının geneli - en rahat bölge"],
          ["12-20", "Sert", "Canlı doğuranlar, Malawi/Tanganyika cikletleri"],
        ],
      },
      { type: "h2", id: "kh", title: "KH: Karbonat Sertliği (pH'ın Sigortası)" },
      {
        type: "p",
        text: "KH, sudaki karbonat/bikarbonat miktarını ölçer ve suyun pH değişimlerine karşı direncini (tampon kapasitesini) belirler. KH yüksekse pH kaya gibi sabit durur; KH 3 dKH'nin altına düşerse pH aniden çökebilir - buna 'pH crash' denir ve toplu balık ölümlerinin gizli sebeplerindendir.",
      },
      {
        type: "ul",
        items: [
          "Güvenli bölge: 4-8 dKH (çoğu tatlı su sistemi için).",
          "KH zamanla doğal olarak tükenir (nitrifikasyon asit üretir) - düzenli su değişimi KH'yi tazeler.",
          "KH'yi yükseltmek için: su değişimi, mercan kırığı, ticari KH+ tamponları.",
          "CO2'li bitkili tanklarda KH takibi daha da önemlidir; düşük KH + CO2 pH'ı hızla düşürür.",
        ],
      },
      { type: "h2", id: "sicaklik", title: "Sıcaklık" },
      {
        type: "table",
        headers: ["Canlı grubu", "İdeal aralık"],
        rows: [
          ["Tropikal topluluk balıkları", "24-27°C"],
          ["Diskus", "28-30°C"],
          ["Japon balığı", "18-22°C"],
          ["Karidesler (neocaridina)", "20-25°C"],
          ["Tuzlu su / resif", "25-26°C"],
        ],
      },
      { type: "h2", id: "istikrar", title: "Tek Cümlelik Özet: İstikrar Kraldır" },
      {
        type: "p",
        text: "Mükemmel değerleri kovalamak yerine mevcut değerlerinizi sabit tutun. Türlerin çoğu geniş aralıklara uyum sağlar; hiçbiri sürekli dalgalanan suya uyum sağlayamaz. Su değerlerinizi öğrenin, ona uygun canlı seçin - canlıya göre suyu zorlamak her zaman daha risklidir.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Suyunuzu tanıyın",
        text: "Musluk suyunuzun pH, GH ve KH değerlerini bir kez ölçüp not edin - bu sizin 'temel değerlerinizdir'. Mağazamıza gelirken bu değerleri getirirseniz size en uygun canlıları birlikte seçebiliriz.",
      },
    ],
    faq: [
      {
        q: "pH'ım 7.8, neon tetra besleyebilir miyim?",
        a: "Ticari üretim neonlar 7.8'e uyum sağlar; önemli olan değerin sabit kalmasıdır. Yine de yumuşak su türlerinde idealin 6.5-7.0 olduğunu bilin - üretim hedefliyorsanız RO su karışımıyla yumuşatma gerekebilir.",
      },
      {
        q: "Suyu kaynatmak sertliği düşürür mü?",
        a: "Kaynatma yalnızca geçici sertliği (KH'nin bir kısmını) düşürür, pratik bir akvaryum çözümü değildir. Sertliği düşürmenin sağlıklı yolu RO/saf su karışımıdır.",
      },
    ],
    related: ["azot-dongusu", "su-testleri", "su-sartlandiricilar", "ilk-baliklar"],
  },
  {
    slug: "azot-dongusu",
    title: "Azot Döngüsü: Amonyak, Nitrit ve Nitrat Rehberi",
    description:
      "Akvaryumdaki azot döngüsünün bilimi: amonyak ve nitrit neden öldürücü, nitrat nasıl yönetilir, zehirlenme belirtileri ve acil müdahale.",
    category: "su-kimyasi",
    keywords: [
      "azot döngüsü",
      "amonyak zehirlenmesi",
      "nitrit zehirlenmesi",
      "nitrat düşürme",
      "akvaryum su kalitesi",
    ],
    updated: "2026-07-27",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "Akvaryumda görünmez bir fabrika 7/24 çalışır: azot döngüsü. Balık atıklarını zehirden zararsıza çeviren bu süreci anlamak, hobide karşılaşacağınız sorunların yarısını daha yaşanmadan çözer. Bu rehber üç azot bileşiğini, tehlike eşiklerini ve acil durum planlarını anlatır.",
      },
      { type: "h2", id: "zincir", title: "Zincir: Atıktan Nitrata" },
      {
        type: "steps",
        items: [
          {
            title: "Amonyak (NH3/NH4) oluşur",
            text: "Dışkı, artık yem, çürüyen bitki ve balık solunumu suya amonyak salar. Amonyak, solungaçları yakan güçlü bir zehirdir; güvenli değeri KESİNLİKLE 0'dır.",
          },
          {
            title: "Nitrite (NO2) dönüşür",
            text: "Nitrosomonas bakterileri amonyağı nitrite çevirir. Nitrit, balığın kanının oksijen taşımasını engeller (kahverengi kan hastalığı); güvenli değer yine 0'dır.",
          },
          {
            title: "Nitrata (NO3) dönüşür",
            text: "Nitrospira bakterileri nitriti nitrata çevirir. Nitrat düşük dozda zararsızdır; su değişimi ve bitkilerle sistemden atılır. Hedef: 40 ppm altı (resifte 10 ppm altı).",
          },
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "pH-amonyak ilişkisi",
        text: "Amonyağın zehirli formu (NH3) yüksek pH ve sıcaklıkta artar. Aynı 'toplam amonyak' değeri pH 8.4'te, pH 6.8'dekinden kat kat daha tehlikelidir. Yüksek pH'lı tanklarda amonyak takibi daha da kritiktir.",
      },
      { type: "h2", id: "belirtiler", title: "Zehirlenme Belirtileri" },
      {
        type: "table",
        headers: ["Zehir", "Balıktaki belirti"],
        rows: [
          [
            "Amonyak",
            "Kırmızı/mor solungaçlar, yüzeyde hava hapsi, cam diplerinde durgunluk, kırmızı çatlaklı yüzgeçler",
          ],
          [
            "Nitrit",
            "Hızlı solungaç hareketi, kahverengimsi solungaç, halsizlik, yüzeye yakın 'nefes nefese' yüzme",
          ],
          [
            "Nitrat (kronik yüksek)",
            "Bağışıklık düşüşü, renk solması, büyüme geriliği, tekrarlayan hastalıklar",
          ],
        ],
      },
      { type: "h2", id: "acil", title: "Acil Durum: Amonyak/Nitrit Tespit Ettim!" },
      {
        type: "steps",
        items: [
          {
            title: "Hemen %30-50 su değiştirin",
            text: "Şartlandırılmış, sıcaklığı eşitlenmiş suyla. Değerler çok yüksekse birkaç saat arayla tekrarlayın.",
          },
          {
            title: "Yemlemeyi durdurun",
            text: "2-3 gün yem kesmek azot üretimini anında düşürür; sağlıklı balık için hiçbir riski yoktur.",
          },
          {
            title: "Nedeni bulun",
            text: "Ölü balık/salyangoz kaldı mı? Filtre mi yıkandı (klorla)? Aşırı yem mi verildi? Yeni balık yükü mü fazla geldi? Neden çözülmezse tablo tekrarlar.",
          },
          {
            title: "Bakteri kültürü ekleyin",
            text: "Şişe bakteri, sarsılan koloniyi hızla tamamlar. Amonyak bağlayıcı şartlandırıcılar (örn. amonyak detoks ürünleri) balığı korurken bakterilerin işini bitirmesine zaman kazandırır.",
          },
          {
            title: "Günlük test edin",
            text: "Değerler üst üste birkaç gün 0 çıkana kadar günlük amonyak + nitrit testi yapın.",
          },
        ],
      },
      { type: "h2", id: "nitrat-yonetimi", title: "Nitratı Düşük Tutmanın Yolları" },
      {
        type: "ul",
        items: [
          "Haftalık %20-25 su değişimi - en etkili ve en ucuz nitrat yönetimi.",
          "Canlı bitkiler - özellikle hızlı büyüyenler (vallisneria, tilki kuyruğu, yüzücü bitkiler) nitrat süpürür.",
          "Doğru stoklama - aşırı kalabalık tank, kronik yüksek nitrat demektir.",
          "Ölçülü yemleme - yenmeyen her yem tanesi gelecekteki nitrattır.",
          "Düzenli sifon - tabanda biriken organikler sürekli azot üretir.",
        ],
      },
    ],
    faq: [
      {
        q: "Testte amonyak 0.25 ppm görünüyor ama balıklar iyi, endişelenmeli miyim?",
        a: "Evet - 0'dan farklı her amonyak değeri bir sorunun işaretidir. Balıklar belirti göstermeden önce müdahale etmek için su değişimi yapın ve kaynağı araştırın. Bazı şartlandırıcılar amonyağı bağlayıp testte 'görünür ama zararsız' hâle getirir; kullandığınız ürünü not edin.",
      },
      {
        q: "Nitrat hiç sıfır olur mu?",
        a: "Yoğun bitkili tanklarda ve derin kum yataklı sistemlerde sıfıra yaklaşabilir. Balıklı standart tankta ölçülebilir nitrat normaldir; hedef sıfır değil, 40 ppm altında tutmaktır.",
      },
    ],
    related: ["akvaryum-dongusu", "su-testleri", "su-parametreleri", "haftalik-bakim-rutini"],
  },
  {
    slug: "su-testleri",
    title: "Akvaryum Su Testi Nasıl Yapılır? Test Kitleri Rehberi",
    description:
      "Damla test mi şerit test mi? Hangi değerler ne sıklıkla ölçülmeli, test sonuçları nasıl okunur ve test takvimi nasıl kurulur.",
    category: "su-kimyasi",
    keywords: [
      "akvaryum test kiti",
      "su testi nasıl yapılır",
      "damla test",
      "amonyak testi",
      "akvaryum su ölçümü",
    ],
    updated: "2026-07-27",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Su testi, akvaryumcunun stetoskopudur: sorunları balıklar hastalanmadan haftalar önce gösterir. 'Su berrak, demek ki temiz' cümlesi bu hobinin en pahalı yanılgısıdır - amonyak da nitrat da görünmezdir. Bu rehber neyi, ne zaman, nasıl ölçeceğinizi anlatır.",
      },
      { type: "h2", id: "kit-turleri", title: "Test Kiti Türleri" },
      {
        type: "table",
        headers: ["Tür", "Artısı", "Eksisi", "Tavsiyemiz"],
        rows: [
          [
            "Damla (sıvı reaktif) testler",
            "Hassas, ekonomik (yüzlerce test), raf ömrü uzun",
            "5-10 dakika sürer",
            "Ana test yönteminiz bu olsun",
          ],
          [
            "Şerit testler",
            "30 saniyede sonuç, pratik",
            "Hassasiyeti düşük, nemden bozulur",
            "Hızlı ön kontrol için yedek",
          ],
          [
            "Dijital ölçerler (pH/TDS)",
            "Anlık ve net rakam",
            "Kalibrasyon ister, amonyak/nitrit ölçmez",
            "pH takibinde iyi tamamlayıcı",
          ],
        ],
      },
      { type: "h2", id: "hangi-testler", title: "Hangi Testler Gerekli?" },
      {
        type: "ul",
        items: [
          "Temel dörtlü (her tatlı su tankı için): amonyak, nitrit, nitrat, pH.",
          "Bitkili tank ekstraları: KH, GH; CO2 kullanıyorsanız KH takibi zorunlu.",
          "Tuzlu su ekstraları: tuzluluk (refraktometre), resifte kalsiyum, alkalinite (dKH), magnezyum, fosfat.",
        ],
      },
      { type: "h2", id: "takvim", title: "Test Takvimi" },
      {
        type: "table",
        headers: ["Dönem", "Test", "Sıklık"],
        rows: [
          ["Yeni kurulum (döngü)", "Amonyak + nitrit", "2-3 günde bir"],
          ["Oturmuş tank", "Temel dörtlü", "Ayda 1-2 kez"],
          ["Yeni balık eklenince", "Amonyak + nitrit", "3-4 gün boyunca günlük"],
          ["Hastalık/ölüm görülünce", "Temel dörtlü", "HEMEN - teşhisin ilk adımı"],
          ["Resif tankı", "dKH (+ Ca, Mg)", "Haftalık; SPS yoğunsa dKH 2-3 günde bir"],
        ],
      },
      { type: "h2", id: "dogru-test", title: "Doğru Test Yapmanın Püf Noktaları" },
      {
        type: "steps",
        items: [
          {
            title: "Örneği doğru alın",
            text: "Suyu yüzeyden değil, orta derinlikten alın. Test tüpünü akvaryum suyuyla bir kez çalkalayıp sonra doldurun.",
          },
          {
            title: "Talimata harfiyen uyun",
            text: "Damla sayısı, çalkalama süresi ve bekleme süresi sonucu doğrudan etkiler. Özellikle nitrat testlerinde 2. şişenin '30 saniye kuvvetli çalkalanması' atlanırsa sonuç yanlış düşük çıkar.",
          },
          {
            title: "Renk kartını doğru okuyun",
            text: "Doğal gün ışığında, beyaz zemin üzerinde okuyun. Akvaryum lambasının mavisi renk algısını bozar.",
          },
          {
            title: "Kaydedin",
            text: "Tarih + değerleri not edin (defter veya telefon notu). Trend, tek ölçümden daha değerlidir: nitrat her ay 10 ppm artıyorsa rutininiz yetersiz demektir.",
          },
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Son kullanma tarihi",
        text: "Reaktifler eskidikçe yanlış (genelde olduğundan iyi) sonuç verir. Kit kutusundaki tarihi kontrol edin; açılmış reaktifler için üretici önerisi genelde 1 yıldır.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Ücretsiz su testi",
        text: "Emin olamadığınız sonuçlar için mağazamıza küçük bir kapta su örneği getirin - testinizi birlikte yapalım, sonucu birlikte yorumlayalım.",
      },
    ],
    faq: [
      {
        q: "TDS ölçer tek başına yeterli mi?",
        a: "Hayır. TDS toplam çözünmüş maddeyi tek rakamda gösterir; neyin çözünmüş olduğunu söylemez. Amonyak, nitrit ve pH için spesifik testler şarttır. TDS, RO su takibinde ve karides tanklarında yararlı bir yardımcıdır.",
      },
      {
        q: "Test sonuçlarım markadan markaya farklı çıkıyor, hangisine güveneyim?",
        a: "Küçük farklar normaldir (özellikle nitrat). Kararlarınızı hep aynı marka kitle verdiğiniz ölçümlere göre alın; trendi tek markayla takip edin.",
      },
    ],
    related: ["azot-dongusu", "su-parametreleri", "akvaryum-dongusu", "haftalik-bakim-rutini"],
  },
  {
    slug: "su-sartlandiricilar",
    title: "Su Şartlandırıcılar ve Bakteri Kültürleri Nasıl Kullanılır?",
    description:
      "Su şartlandırıcı ne işe yarar, nasıl dozlanır? Klor giderici, amonyak bağlayıcı, bakteri kültürü ve bitki gübresi - ürün kullanım rehberi.",
    category: "su-kimyasi",
    keywords: [
      "su şartlandırıcı",
      "klor giderici",
      "bakteri kültürü",
      "akvaryum kimyasalları",
      "su düzenleyici kullanımı",
    ],
    updated: "2026-07-27",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "Akvaryum rafındaki şişeler kafa karıştırabilir: şartlandırıcı, bakteri, yosun önleyici, berraklaştırıcı... Hangisi gerçekten gerekli, hangisi ne zaman kullanılır? Bu rehber su katkı ürünlerini tek tek açıklıyor ve doğru kullanım dozlarının mantığını anlatıyor.",
      },
      { type: "h2", id: "sartlandirici", title: "Su Şartlandırıcı (Klor Giderici): Vazgeçilmez" },
      {
        type: "p",
        text: "Musluk suyundaki klor ve kloramin, balıkların solungaçlarına ve filtrenizdeki faydalı bakterilere zarar verir. Şartlandırıcı bu maddeleri saniyeler içinde nötralize eder; çoğu ürün ağır metalleri de bağlar ve balığın koruyucu salgı tabakasını destekler.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Dozu hesaplayın",
            text: "Doz, TANKIN tamamına değil, EKLEDİĞİNİZ yeni su miktarına göre hesaplanır. 100 litrelik tankta 25 litre değiştiriyorsanız 25 litrelik doz yeterlidir.",
          },
          {
            title: "Kovada uygulayın",
            text: "Şartlandırıcıyı kovadaki yeni suya ekleyip karıştırın, sonra akvaryuma dökün. Suyu doğrudan hortumla dolduruyorsanız tüm tank hacmine göre dozlayıp önceden tanka ekleyin.",
          },
          {
            title: "Beklemeye gerek yok",
            text: "Modern şartlandırıcılar anında etki eder; suyu bekletmenize gerek kalmaz.",
          },
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Kloramin uyarısı",
        text: "Bazı şebekelerde klor yerine daha kalıcı olan kloramin kullanılır - kloramin suyu dinlendirmekle uçmaz! Şartlandırıcınızın etiketinde 'kloramin' ibaresini kontrol edin; kaliteli ürünlerin tamamı ikisini de giderir.",
      },
      { type: "h2", id: "bakteri", title: "Bakteri Kültürleri" },
      {
        type: "ul",
        items: [
          "Ne zaman: yeni kurulumda (döngüyü hızlandırır), filtre temizliği sonrası, ilaç tedavisi sonrası, yeni balık eklerken ve amonyak/nitrit sıçramalarında.",
          "Nasıl: şişeyi çalkalayıp dozu doğrudan filtre girişine yakın bölgeye dökün - hedef, bakterilerin filtre malzemesine tutunması.",
          "Bakteri dozlamasından sonra 24-48 saat UV sterilizatörü kapatın (varsa); UV, eklediğiniz bakteriyi de öldürür.",
          "Düzenli küçük dozlar, tek büyük dozdan daha etkilidir.",
        ],
      },
      { type: "h2", id: "diger-urunler", title: "Diğer Su Katkıları: Ne Zaman Gerekir?" },
      {
        type: "table",
        headers: ["Ürün", "Görevi", "Gerçekten gerekli mi?"],
        rows: [
          [
            "Amonyak bağlayıcı",
            "Amonyağı geçici zararsız forma çevirir",
            "Acil durumlarda hayat kurtarır; rutinde gerekmez",
          ],
          [
            "Su berraklaştırıcı",
            "Askıdaki partikülleri topaklayıp filtreye yakalatır",
            "Kozmetiktir; bulanıklığın nedenini çözmez - önce neden bulunmalı",
          ],
          [
            "Yosun önleyici",
            "Yosun büyümesini kimyasal baskılar",
            "Son çare; ışık-besin dengesi asıl çözümdür",
          ],
          [
            "Bitki gübresi",
            "Bitkilere mikro/makro besin sağlar",
            "Bitkili tankta evet, haftalık doz",
          ],
          [
            "KH/pH tamponları",
            "Karbonat sertliğini ve pH'ı stabilize eder",
            "Düşük KH'li sularda değerli; ölçmeden kullanmayın",
          ],
          [
            "Yaprak/kütük ekstraktı (blackwater)",
            "Doğal tanenler, yumuşak su türlerine doğal ortam",
            "Opsiyonel; tetra-diskus tanklarında güzel destek",
          ],
        ],
      },
      { type: "h2", id: "kurallar", title: "Tüm Kimyasallar İçin 5 Altın Kural" },
      {
        type: "ul",
        items: [
          "Etiket dozunu asla aşmayın - 'biraz fazla iyidir' akvaryumda geçerli değildir.",
          "Aynı anda birden fazla yeni ürünü tanka sokmayın; sorun çıkarsa neyin yaptığını bilemezsiniz.",
          "Ne için kullandığınızı bilmediğiniz ürünü kullanmayın; her şişe bir sorunun cevabıdır, önce sorunu teşhis edin.",
          "Dozlama kapağını her üründe ayrı tutun, çapraz bulaşmayı önleyin.",
          "Ürünleri serin, karanlık yerde ve çocuklardan uzakta saklayın; donmuş/aşırı ısınmış şişeleri kullanmayın.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Doğru ürünü birlikte seçelim",
        text: "Mağazamızda şartlandırıcıdan bakteri kültürüne tüm su katkıları mevcut. Sorununuzu (veya su test sonucunuzu) bize iletin, gereksiz şişe satın almadan doğru çözüme gidin.",
      },
    ],
    faq: [
      {
        q: "Şartlandırıcı kullanmayı unuttum, ne yapmalıyım?",
        a: "Hemen tank hacmine göre normal doz şartlandırıcı ekleyin - geç kalmış doz bile klor hasarını sınırlar. Balıklarda hızlı solunum görüyorsanız havalandırmayı artırın.",
      },
      {
        q: "Bakteri şişesi buzdolabında mı saklanmalı?",
        a: "Markaya göre değişir - etikete bakın. Çoğu modern ürün oda sıcaklığında saklanır; hepsinin ortak düşmanı doğrudan güneş ve aşırı sıcaktır.",
      },
      {
        q: "Berraklaştırıcı kullandım, su daha da bulandı?",
        a: "Normaldir - ürün partikülleri topaklarken kısa süreli bulanıklık artar, ardından filtre topakları yakalar. 24 saat içinde açılmazsa filtre süngerini kontrol edin ve bulanıklığın kaynağını araştırın.",
      },
    ],
    related: ["azot-dongusu", "akvaryum-dongusu", "su-testleri", "akvaryum-temizligi"],
  },
];
