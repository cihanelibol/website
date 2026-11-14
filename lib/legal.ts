import { SHIPPING } from "./shipping";

// Yasal metinler: KVKK aydınlatma, üyelik sözleşmesi, ticari ileti onayı,
// ön bilgilendirme formu ve mesafeli satış sözleşmesi.
// Şirket bilgileri netleşince [•] işaretli alanlar doldurulmalıdır.

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; title: string }
  | { type: "ul"; items: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string; // ISO tarih
  intro: string;
  blocks: LegalBlock[];
};

const COMPANY = "GRİ AKVARYUM & BALIK GALERİSİ";
const SITE = "griakvaryum.com";

export const legalDocs: LegalDoc[] = [
  {
    slug: "kargo-teslimat",
    title: "Kargo ve Teslimat Koşulları",
    updated: "2026-11-14",
    intro: SHIPPING.summary,
    blocks: [
      { type: "h2", title: "Kargo ücreti" },
      { type: "p", text: `${SHIPPING.summary} Eşik, KDV dahil ürünler toplamına göre hesaplanır; tam 2.500 TL tutarındaki siparişlerde kargo 200 TL'dir. Türkiye içi teslimatlar için geçerlidir.` },
      { type: "h2", title: "Kargoya teslim" },
      { type: "p", text: `${SHIPPING.dispatch} Saatler Türkiye saatidir. Kargoya verilme zamanı, alıcıya teslim zamanı değildir; taşıma süresi teslimat adresine ve kargo firmasına göre değişir.` },
      { type: "h2", title: "Mağazadan teslim ve canlılar" },
      { type: "p", text: "Mağazadan teslim için bizimle iletişime geçebilirsiniz. Canlı hayvanların taşıma koşulları ve teslim zamanı mağazayla ayrıca kararlaştırılır." },
    ],
  },
  {
    slug: "analitik-cerezler",
    title: "Analitik Çerez Tercihleri",
    updated: "2026-11-12",
    intro: "Zorunlu oturum ve sepet işlevleri, analitik izninizden bağımsız çalışır. İsteğe bağlı ziyaret ölçümünü aşağıdaki şekilde yönetebilirsiniz.",
    blocks: [
      { type: "h2", title: "İsteğe bağlı ziyaret ölçümü" },
      { type: "p", text: "Analitiğe izin verdiğinizde Google Tag Manager üzerinden Google Analytics yüklenir. Sayfa ziyaretleri, ürün etkileşimleri ve telefon, WhatsApp veya yol tarifi bağlantısı tıklamaları siteyi geliştirmek için ölçülür. Analitik çerezler tarayıcınızı ve ziyaret oturumlarını ayırt etmek için kullanılabilir; veriler Google altyapısında işlenir. Uygulamanın eklediği olaylara ad, e-posta, telefon veya adres bilgisi eklenmez. Reklam depolama ve reklam kişiselleştirme izinleri kapalı tutulur." },
      { type: "h2", title: "Tercihinizi değiştirme" },
      { type: "p", text: "Yalnızca gerekli seçeneğinde Google ölçüm betiği yüklenmez. Tercihiniz tarayıcınızın yerel depolamasında saklanır. Alt menüdeki Çerez tercihleri bağlantısından izninizi geri alabilirsiniz; bu durumda ölçüm durdurulur, erişilebilir Google Analytics çerezleri silinir ve sayfa yenilenir. Bu tercih, daha önce işlenmiş verileri kendiliğinden silmez." },
    ],
  },
  /* ---------------- KVKK Aydınlatma Metni ---------------- */
  {
    slug: "kvkk-aydinlatma",
    title: "Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni",
    updated: "2026-07-27",
    intro:
      "İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") m.10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu sıfatıyla hareket eden " +
      COMPANY +
      " (\"Şirket\") tarafından kişisel verilerinizin işlenmesine ilişkin olarak sizleri bilgilendirmek amacıyla hazırlanmıştır.",
    blocks: [
      { type: "h2", title: "1. Veri Sorumlusu" },
      {
        type: "p",
        text:
          "Veri Sorumlusu: " +
          COMPANY +
          " - Adres: [•] (İstanbul) - Telefon: [•] - E-posta: [•]. Kişisel verileriniz, veri sorumlusu sıfatıyla Şirketimiz tarafından aşağıda açıklanan kapsamda işlenebilecektir.",
      },
      { type: "h2", title: "2. İşlenen Kişisel Veriler" },
      {
        type: "ul",
        items: [
          "Kimlik Bilgileri: ad, soyad",
          "İletişim Bilgileri: e-posta adresi, telefon numarası, teslimat ve fatura adresi",
          "Müşteri İşlem Bilgileri: sipariş bilgileri, sepet içeriği, sipariş geçmişi, talep ve şikayet kayıtları, ürün değerlendirme ve yorumları",
          "İşlem Güvenliği Bilgileri: IP adresi, çerez kayıtları, oturum bilgileri, parola özeti (şifrelenmiş)",
          "Pazarlama Bilgileri (yalnızca açık rızanız varsa): alışveriş tercihlerinize ilişkin bilgiler",
        ],
      },
      { type: "h2", title: "3. Kişisel Verilerin İşlenme Amaçları" },
      {
        type: "ul",
        items: [
          "Üyelik kaydının oluşturulması ve yönetilmesi",
          "Mesafeli satış sözleşmesinin kurulması ve ifası; siparişlerin alınması, hazırlanması ve teslimi",
          "Ödeme ve iade süreçlerinin yürütülmesi",
          "Müşteri talep ve şikayetlerinin karşılanması, iletişim faaliyetlerinin yürütülmesi",
          "Bilgi güvenliği süreçlerinin yürütülmesi ve kötüye kullanımın önlenmesi",
          "Yetkili kişi, kurum ve kuruluşlara bilgi verilmesi; hukuki yükümlülüklerin yerine getirilmesi",
          "Açık rızanızın bulunması hâlinde; kampanya, tanıtım ve pazarlama faaliyetlerinin yürütülmesi, ticari elektronik ileti gönderilmesi",
        ],
      },
      { type: "h2", title: "4. İşlemenin Hukuki Sebepleri" },
      {
        type: "p",
        text:
          "Kişisel verileriniz; KVKK m.5/2-c (sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması), m.5/2-ç (hukuki yükümlülüğün yerine getirilmesi), m.5/2-e (bir hakkın tesisi, kullanılması veya korunması), m.5/2-f (temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaat) hukuki sebeplerine; pazarlama amaçlı işleme faaliyetleri bakımından ise münhasıran KVKK m.5/1 uyarınca açık rızanıza dayanılarak işlenmektedir.",
      },
      { type: "h2", title: "5. Kişisel Verilerin Aktarılması" },
      {
        type: "p",
        text:
          "Kişisel verileriniz; siparişin teslimi amacıyla kargo ve lojistik firmalarına, sipariş ve stok yönetimi amacıyla hizmet aldığımız yazılım ve barındırma (hosting) hizmeti sağlayıcılarına, hukuki yükümlülüklerimiz kapsamında yetkili kamu kurum ve kuruluşlarına, KVKK m.8 ve m.9'da öngörülen şartlara uygun olarak ve amaçla sınırlı biçimde aktarılabilecektir. Kişisel verileriniz üçüncü kişilere satılmaz ve pazarlanmaz.",
      },
      { type: "h2", title: "6. Saklama Süresi" },
      {
        type: "p",
        text:
          "Kişisel verileriniz, işleme amacının gerektirdiği süre ve her hâlükârda ilgili mevzuatta öngörülen zamanaşımı süreleri (6098 sayılı TBK, 6102 sayılı TTK, 213 sayılı VUK ve sair mevzuat) boyunca saklanır; sürelerin sonunda silinir, yok edilir veya anonim hâle getirilir.",
      },
      { type: "h2", title: "7. KVKK m.11 Kapsamındaki Haklarınız" },
      {
        type: "ul",
        items: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
          "KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme",
          "Düzeltme/silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
          "Münhasıran otomatik sistemlerle yapılan analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
          "Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        ],
      },
      {
        type: "p",
        text:
          "Bu haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun olarak yukarıda belirtilen adresimize yazılı olarak veya e-posta adresimize iletebilirsiniz. Başvurunuz en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılır.",
      },
    ],
  },

  /* ---------------- Üyelik Sözleşmesi ---------------- */
  {
    slug: "uyelik-sozlesmesi",
    title: "Üyelik Sözleşmesi",
    updated: "2026-07-27",
    intro:
      "İşbu Üyelik Sözleşmesi (\"Sözleşme\"); " +
      COMPANY +
      " (\"Şirket\") ile " +
      SITE +
      " internet sitesine (\"Site\") üye olan kullanıcı (\"Üye\") arasında, Üye'nin Site'ye üye olması ve Site'de sunulan hizmetlerden yararlanmasına ilişkin koşulların belirlenmesi amacıyla elektronik ortamda akdedilmiştir.",
    blocks: [
      { type: "h2", title: "1. Üyelik" },
      {
        type: "p",
        text:
          "Üyelik; Üye'nin kayıt formunu doğru ve güncel bilgilerle doldurması, işbu Sözleşme ile KVKK Aydınlatma Metni'ni onaylaması ile kurulur. Üyelik ücretsizdir. 18 yaşından küçükler üye olamaz. Site'den üye olmaksızın da (misafir) sipariş verilebilir.",
      },
      { type: "h2", title: "2. Üye'nin Yükümlülükleri" },
      {
        type: "ul",
        items: [
          "Üye, kayıt sırasında verdiği bilgilerin doğru ve güncel olduğunu; değişiklikleri gecikmeksizin güncelleyeceğini kabul eder.",
          "Hesap ve parola güvenliği Üye'nin sorumluluğundadır; hesap üzerinden gerçekleştirilen tüm işlemler Üye tarafından yapılmış sayılır.",
          "Üye, Site'yi hukuka ve ahlaka aykırı amaçlarla kullanamaz; sistem güvenliğini tehlikeye düşürecek faaliyetlerde bulunamaz.",
          "Üye'nin ürünlere yazdığı yorum ve değerlendirmeler; hakaret, hukuka aykırılık, üçüncü kişi haklarının ihlali veya haksız rekabet içeremez. Şirket, bu nitelikteki içerikleri yayımlamama veya kaldırma hakkını saklı tutar.",
        ],
      },
      { type: "h2", title: "3. Şirket'in Hak ve Yükümlülükleri" },
      {
        type: "ul",
        items: [
          "Şirket, Site'de sunulan hizmetleri, ürünleri ve fiyatları önceden bildirimde bulunmaksızın değiştirme, askıya alma veya durdurma hakkını saklı tutar.",
          "Site'deki ürün görselleri tanıtım amaçlıdır; ambalaj ve içerik üreticiler tarafından değiştirilebilir.",
          "Şirket, işbu Sözleşme'ye aykırılık hâlinde üyeliği askıya alabilir veya sonlandırabilir.",
          "Şirket, mevzuattan kaynaklanan yükümlülükleri saklı kalmak kaydıyla, Site'nin kesintisiz ve hatasız çalışacağını taahhüt etmez.",
        ],
      },
      { type: "h2", title: "4. Kişisel Verilerin Korunması" },
      {
        type: "p",
        text:
          "Üye'ye ait kişisel veriler, Site'de yayımlanan KVKK Aydınlatma Metni'nde açıklanan kapsam ve amaçlarla işlenir. Ticari elektronik ileti gönderimi, yalnızca Üye'nin ayrıca ve özgür iradesiyle vereceği onaya bağlıdır; bu onay üyeliğin ya da alışverişin ön şartı değildir ve dilediğiniz zaman geri alınabilir.",
      },
      { type: "h2", title: "5. Fikri Mülkiyet" },
      {
        type: "p",
        text:
          "Site'nin tasarımı, yazılımı, logo ve markaları dâhil tüm unsurları Şirket'e aittir veya lisans altında kullanılmaktadır; izinsiz kullanılamaz, çoğaltılamaz ve dağıtılamaz.",
      },
      { type: "h2", title: "6. Sözleşmenin Feshi" },
      {
        type: "p",
        text:
          "Üye, dilediği zaman üyeliğinin sonlandırılmasını talep edebilir. Şirket, Sözleşme'ye aykırılık hâlinde üyeliği derhâl feshedebilir. Fesih, fesih tarihine kadar doğmuş hak ve borçları etkilemez.",
      },
      { type: "h2", title: "7. Uyuşmazlıkların Çözümü ve Yürürlük" },
      {
        type: "p",
        text:
          "İşbu Sözleşme'den doğan uyuşmazlıklarda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir; tüketici işlemlerinde Tüketici Hakem Heyetleri ile Tüketici Mahkemelerine başvuru hakkı saklıdır. Sözleşme, üyeliğin onaylanmasıyla yürürlüğe girer.",
      },
    ],
  },

  /* ---------------- Ticari Elektronik İleti Onayı ---------------- */
  {
    slug: "ticari-ileti",
    title: "Ticari Elektronik İleti Onay Metni",
    updated: "2026-07-27",
    intro:
      "İşbu onay metni, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve Ticari İletişim ve Ticari Elektronik İletiler Hakkında Yönetmelik kapsamında hazırlanmıştır.",
    blocks: [
      { type: "h2", title: "1. Onayın Kapsamı" },
      {
        type: "p",
        text:
          "Onay vermeniz hâlinde; " +
          COMPANY +
          " tarafından kampanya, indirim, yeni ürün, tanıtım, çekiliş ve bilgilendirme içerikli ticari elektronik iletiler, tarafınıza e-posta, SMS ve telefon (arama) kanallarıyla gönderilebilecek; bu amaçla iletişim verileriniz işlenebilecektir.",
      },
      { type: "h2", title: "2. Onayın Niteliği" },
      {
        type: "ul",
        items: [
          "Bu onay tamamen isteğe bağlıdır; üyelik veya alışveriş yapmanın ön şartı değildir.",
          "Onay vermemeniz hâlinde sipariş süreçlerinize ilişkin zorunlu bilgilendirmeler (sipariş onayı, teslimat bilgisi vb.) yine tarafınıza iletilir; bunlar ticari ileti sayılmaz.",
          "Onayınız, İleti Yönetim Sistemi (İYS) üzerinden de kayıt altına alınabilir.",
        ],
      },
      { type: "h2", title: "3. Ret (Vazgeçme) Hakkı" },
      {
        type: "p",
        text:
          "Dilediğiniz zaman, hiçbir gerekçe göstermeksizin ticari elektronik ileti almayı reddedebilirsiniz. Ret bildiriminizi iletilerde yer alan çıkış yöntemiyle, [•] e-posta adresine bildirerek veya İYS üzerinden yapabilirsiniz. Ret bildiriminiz en geç 3 (üç) iş günü içinde işleme alınır.",
      },
    ],
  },

  /* ---------------- Ön Bilgilendirme Formu ---------------- */
  {
    slug: "on-bilgilendirme",
    title: "Ön Bilgilendirme Formu",
    updated: "2026-07-27",
    intro:
      "İşbu Ön Bilgilendirme Formu, 6502 sayılı Tüketicinin Korunması Hakkında Kanun (\"TKHK\") ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, mesafeli satış sözleşmesi kurulmadan önce tüketicinin bilgilendirilmesi amacıyla hazırlanmıştır.",
    blocks: [
      { type: "h2", title: "1. Satıcı Bilgileri" },
      {
        type: "ul",
        items: [
          "Unvan: " + COMPANY,
          "Adres: [•] (İstanbul)",
          "Telefon: [•] - E-posta: [•]",
          "MERSİS / Vergi No: [•]",
        ],
      },
      { type: "h2", title: "2. Sözleşme Konusu Ürün ve Bedel" },
      {
        type: "p",
        text:
          "Sözleşme konusu ürünlerin cinsi, adedi ve tüm vergiler dâhil satış bedeli, sipariş özeti sayfasında ve sipariş onayında gösterilmektedir. İlan edilen fiyatlar güncelleme yapılana kadar geçerlidir.",
      },
      { type: "h2", title: "3. Ödeme ve Teslimat" },
      {
        type: "ul",
        items: [
          "Ödeme, siparişin alınmasının ardından Satıcı'nın sizinle iletişime geçmesi üzerine mutabık kalınan yöntemle (havale/EFT, kapıda ödeme veya mağazada ödeme) yapılır. " + SHIPPING.summary,
          "Ürünler, sipariş onayını takiben en geç 30 (otuz) gün içinde, bildirdiğiniz teslimat adresine gönderilir veya mutabık kalınması hâlinde mağazadan teslim edilir.",
          "Canlı hayvan (balık ve diğer canlılar) teslimatları, canlı sağlığının korunması amacıyla Satıcı tarafından belirlenen özel taşıma koşullarına tabidir; stok ve mevsim koşullarına göre teslimat süresi değişebilir.",
        ],
      },
      { type: "h2", title: "4. Cayma Hakkı" },
      {
        type: "p",
        text:
          "Tüketici, malı teslim aldığı tarihten itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma bildirimi, süresi içinde yazılı olarak veya kalıcı veri saklayıcısı ile (e-posta dâhil) Satıcı'ya yöneltilmelidir. Cayma hâlinde ürün bedeli, bildirimin ulaşmasından itibaren 14 gün içinde iade edilir.",
      },
      { type: "h2", title: "5. Cayma Hakkının İstisnaları" },
      {
        type: "ul",
        items: [
          "Canlı hayvanlar (balık, karides, salyangoz vb.) - çabuk bozulabilen/niteliği itibarıyla iadeye elverişli olmayan mallar kapsamında (Yönetmelik m.15/1-c)",
          "Ambalajı açılmış yem, vitamin, su düzenleyici ve benzeri; sağlık ve hijyen açısından iadeye uygun olmayan ürünler (m.15/1-e)",
          "Tüketicinin istekleri doğrultusunda kişiselleştirilen ürünler (m.15/1-b)",
        ],
      },
      { type: "h2", title: "6. Şikâyet ve Başvuru Yolları" },
      {
        type: "p",
        text:
          "Sipariş ve ürünlere ilişkin şikâyetlerinizi yukarıdaki iletişim kanallarından Satıcı'ya iletebilirsiniz. Ayrıca, Ticaret Bakanlığı'nca her yıl belirlenen parasal sınırlar dâhilinde yerleşim yerinizin bulunduğu veya tüketici işleminin yapıldığı yerdeki Tüketici Hakem Heyeti'ne veya Tüketici Mahkemesi'ne başvurabilirsiniz.",
      },
    ],
  },

  /* ---------------- Mesafeli Satış Sözleşmesi ---------------- */
  {
    slug: "mesafeli-satis",
    title: "Mesafeli Satış Sözleşmesi",
    updated: "2026-07-27",
    intro:
      "İşbu Mesafeli Satış Sözleşmesi (\"Sözleşme\"), aşağıda bilgileri yer alan Satıcı ile Alıcı arasında, 6502 sayılı TKHK ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak elektronik ortamda kurulmuştur.",
    blocks: [
      { type: "h2", title: "1. Taraflar" },
      {
        type: "ul",
        items: [
          "SATICI: " + COMPANY + " - Adres: [•] (İstanbul) - Tel: [•] - E-posta: [•]",
          "ALICI: Sipariş formunda ad-soyad, adres ve iletişim bilgileri yer alan kişi",
        ],
      },
      { type: "h2", title: "2. Konu" },
      {
        type: "p",
        text:
          "İşbu Sözleşme'nin konusu; Alıcı'nın, Satıcı'ya ait " +
          SITE +
          " internet sitesinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş özetinde belirtilen ürünlerin satışı ve teslimi ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.",
      },
      { type: "h2", title: "3. Sözleşme Konusu Ürün, Bedel ve Ödeme" },
      {
        type: "ul",
        items: [
          "Ürünlerin cinsi, adedi ve tüm vergiler dâhil satış bedeli, sipariş özeti ekranında ve sipariş kaydında belirtildiği gibidir.",
          "Ödeme; siparişin alınmasını takiben Satıcı'nın Alıcı ile kurduğu iletişimde mutabık kalınan yöntemle (havale/EFT, kapıda ödeme veya mağazada ödeme) gerçekleştirilir.",
          SHIPPING.summary,
        ],
      },
      { type: "h2", title: "4. Teslimat" },
      {
        type: "p",
        text:
          "Ürünler, yasal 30 (otuz) günlük süreyi aşmamak kaydıyla, Alıcı'nın bildirdiği teslimat adresine kargo ile gönderilir veya tarafların mutabakatı hâlinde mağazadan teslim edilir. Canlı hayvan teslimatları özel taşıma koşullarına tabi olup teslim zamanı taraflarca ayrıca kararlaştırılır. Teslim anında ürünün hasarlı, ayıplı veya eksik olması hâlinde durumun tutanak altına alınması ve Satıcı'ya derhâl bildirilmesi gerekir.",
      },
      { type: "h2", title: "5. Cayma Hakkı" },
      {
        type: "p",
        text:
          "Alıcı, malı teslim aldığı tarihten itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma bildirimi yazılı olarak veya kalıcı veri saklayıcısıyla Satıcı'ya yöneltilir. Cayma hâlinde ürünün 10 (on) gün içinde Satıcı'ya iadesi gerekir; ürün bedeli, cayma bildiriminin ulaşmasından itibaren 14 gün içinde Alıcı'ya iade edilir. İade edilecek ürünün kutusu, ambalajı ve varsa standart aksesuarları ile eksiksiz ve hasarsız olması gerekir.",
      },
      { type: "h2", title: "6. Cayma Hakkının Kullanılamayacağı Hâller" },
      {
        type: "ul",
        items: [
          "Canlı hayvanlar (balık ve diğer canlılar) ile çabuk bozulabilen veya son kullanma tarihi geçebilecek mallar",
          "Ambalajı açıldıktan sonra sağlık ve hijyen açısından iadeye uygun olmayan ürünler (açılmış yem, vitamin, su katkıları vb.)",
          "Alıcı'nın istekleri doğrultusunda kişiselleştirilen ürünler",
        ],
      },
      { type: "h2", title: "7. Genel Hükümler" },
      {
        type: "ul",
        items: [
          "Alıcı, sipariş özetinde yer alan ürünlerin temel nitelikleri, satış fiyatı, ödeme ve teslimata ilişkin Ön Bilgilendirme Formu'nu okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.",
          "Satıcı, sipariş konusu ürünün tedarikinin imkânsızlaşması hâlinde durumu 3 (üç) gün içinde Alıcı'ya bildirir ve varsa ödenen bedeli 14 gün içinde iade eder.",
          "Mücbir sebepler (doğal afet, salgın, mevzuat değişikliği, taşıma engelleri vb.) nedeniyle ifa edilemeyen yükümlülüklerden Satıcı sorumlu tutulamaz.",
          "İşbu Sözleşme'de düzenlenmeyen hususlarda TKHK ve ilgili mevzuat hükümleri uygulanır.",
        ],
      },
      { type: "h2", title: "8. Uyuşmazlıkların Çözümü ve Yürürlük" },
      {
        type: "p",
        text:
          "Uyuşmazlıklarda, Ticaret Bakanlığı'nca ilan edilen parasal sınırlar çerçevesinde Alıcı'nın yerleşim yerindeki veya tüketici işleminin yapıldığı yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir. Sözleşme, Alıcı'nın siparişi elektronik ortamda onaylamasıyla kurulmuş ve yürürlüğe girmiş sayılır.",
      },
    ],
  },
];

const bySlug = new Map(legalDocs.map((d) => [d.slug, d]));

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return bySlug.get(slug);
}
