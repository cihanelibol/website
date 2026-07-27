// Katalog filtre mantığı: EasyTrade'den gelen düz kategori listesini
// ana gruplara ayırır ve ürün adı/kategorisinden marka tespiti yapar.

import type { EtCategory, EtProduct } from "./easytrade";

// Türkçe büyük İ/I sorunlarına takılmadan karşılaştırma için normalizasyon
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i");
}

/* ---------------- Markalar ---------------- */

export type Brand = { slug: string; label: string; re: RegExp };

export const BRANDS: Brand[] = [
  { slug: "aquael", label: "AquaEl", re: /aquael/ },
  { slug: "boyu", label: "BOYU", re: /^boyu\b/ },
  { slug: "eheim", label: "EHEIM", re: /eheim/ },
  { slug: "fluval", label: "Fluval", re: /fluval/ },
  { slug: "reeflowers", label: "ReeFlowers", re: /reeflowers/ },
  { slug: "seachem", label: "Seachem", re: /seachem/ },
  { slug: "sera", label: "Sera", re: /^sera\b/ },
  { slug: "sezen", label: "Sezen Akvaryum", re: /^sezen\b/ },
  { slug: "sobo", label: "SOBO", re: /^sobo\b/ },
  { slug: "tetra", label: "Tetra", re: /^tetra\b/ },
  { slug: "tropical", label: "Tropical", re: /^tropical\b/ },
  { slug: "tropifit", label: "TropiFit", re: /tropifit/ },
];

export function productMatchesBrand(product: EtProduct, brand: Brand): boolean {
  if (brand.re.test(norm(product.name))) return true;
  return product.categories.some((c) => brand.re.test(norm(c.name)));
}

/* ---------------- Kategori grupları ---------------- */

export type CategoryGroup = {
  key: string;
  title: string;
  emoji: string;
  categories: EtCategory[];
  total: number;
};

// Marka adıyla başlayan kategoriler ağaçta gösterilmez - marka filtresi bunları kapsıyor
// (bu kategorilerdeki ürünler genel kategorilerde de mevcut).
const BRAND_CATEGORY_PREFIX = /^(eheim|sera|sobo|tropical|tropifit|sezen)\b/;

type GroupRule = {
  key: string;
  title: string;
  emoji: string;
  test: (lowerName: string) => boolean;
};

// Sıra önemli: ilk eşleşen kural kazanır.
const GROUP_RULES: GroupRule[] = [
  {
    key: "yemler",
    title: "Yemler",
    emoji: "🦐",
    test: (n) => /yem/.test(n) && !/yemleme makine/.test(n),
  },
  {
    key: "kaplumbaga-surungen",
    title: "Kaplumbağa & Sürüngen",
    emoji: "🐢",
    test: (n) => /kaplumbağa|sürüngen|reptil|kertenkele/.test(n),
  },
  {
    key: "kemirgenler",
    title: "Kemirgenler",
    emoji: "🐹",
    test: (n) => /hamster|tavşan|guinea|kemirgen/.test(n),
  },
  {
    key: "filtreler",
    title: "Filtreler",
    emoji: "🌀",
    test: (n) => /filtre/.test(n),
  },
  {
    key: "motorlar-hava",
    title: "Motorlar & Hava",
    emoji: "💨",
    test: (n) => /motor|hava|dalga/.test(n),
  },
  {
    key: "bitki-co2",
    title: "Bitki & CO2",
    emoji: "🌿",
    test: (n) => /bitki|gübre|co2|soil|regülatör|reaktör/.test(n),
  },
  {
    key: "dekor-taban",
    title: "Dekor & Taban",
    emoji: "🪸",
    test: (n) => /dekor|kum|taban|zemin/.test(n),
  },
  {
    key: "su-bakimi",
    title: "Su Bakımı & Kimyasallar",
    emoji: "🧪",
    test: (n) =>
      /kimyasal|düzenleyici|ph|test|bakteri|ilaç|vitamin|tuz|yosun|katkı|doğal/.test(
        n
      ),
  },
  {
    key: "isitma-aydinlatma",
    title: "Isıtma & Aydınlatma",
    emoji: "💡",
    test: (n) => /ısıtıcı|ısıtma|aydınlatma|led|termometre/.test(n),
  },
  {
    key: "akvaryumlar",
    title: "Akvaryumlar",
    emoji: "🐟",
    test: (n) => /akvaryum|fanus/.test(n),
  },
  {
    key: "baliklar-canlilar",
    title: "Balıklar & Canlılar",
    emoji: "🐠",
    test: (n) => /^balık$|^canlı$|karides/.test(n),
  },
  {
    key: "aksesuar-temizlik",
    title: "Aksesuar & Temizlik",
    emoji: "🧰",
    test: () => true,
  },
];

export function buildCategoryGroups(categories: EtCategory[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const rule of GROUP_RULES) {
    groups.set(rule.key, {
      key: rule.key,
      title: rule.title,
      emoji: rule.emoji,
      categories: [],
      total: 0,
    });
  }

  for (const cat of categories) {
    const lowerName = cat.name.toLocaleLowerCase("tr-TR");
    if (BRAND_CATEGORY_PREFIX.test(lowerName)) continue;
    const rule = GROUP_RULES.find((r) => r.test(lowerName))!;
    const group = groups.get(rule.key)!;
    group.categories.push(cat);
    group.total += cat.products_count;
  }

  for (const group of groups.values()) {
    group.categories.sort((a, b) => b.products_count - a.products_count);
  }

  return [...groups.values()].filter((g) => g.categories.length > 0);
}

export function findGroup(
  groups: CategoryGroup[],
  key: string | undefined
): CategoryGroup | undefined {
  return key ? groups.find((g) => g.key === key) : undefined;
}

/** Ürünün kategorilerinden hangi ana gruplara girdiğini bulur */
export function productGroupKeys(product: EtProduct): string[] {
  const keys = new Set<string>();
  for (const cat of product.categories) {
    const lowerName = cat.name.toLocaleLowerCase("tr-TR");
    if (BRAND_CATEGORY_PREFIX.test(lowerName)) continue;
    const rule = GROUP_RULES.find((r) => r.test(lowerName));
    if (rule && rule.key !== "aksesuar-temizlik") keys.add(rule.key);
  }
  return [...keys];
}

/* ---------------- Ürün detayı: kullanım önerileri ---------------- */

export type UsageSection = { title: string; tips: string[] };

const USAGE_BY_GROUP: Record<string, UsageSection> = {
  yemler: {
    title: "Yemleme Önerileri",
    tips: [
      "Balıklarınızın 2-3 dakikada bitirebileceği kadar yem verin; artan yem su kalitesini bozar.",
      "Günde 1-2 kez az miktarda yemleme, tek seferde çok yemlemeden her zaman daha sağlıklıdır.",
      "Yem kutusunu ağzı kapalı, serin ve kuru bir yerde saklayın; açıldıktan sonra 3-4 ay içinde tüketin.",
      "Farklı yem türlerini (granül, pul, canlı/dondurulmuş) dönüşümlü kullanmak balıkların bağışıklığını güçlendirir.",
    ],
  },
  filtreler: {
    title: "Filtre Kullanımı & Bakımı",
    tips: [
      "Filtre süngerlerini musluk suyuyla değil, akvaryumdan aldığınız suyla yıkayın - klor faydalı bakterileri öldürür.",
      "Filtre malzemelerinin tamamını aynı anda değiştirmeyin; biyolojik dengeyi korumak için sırayla yenileyin.",
      "Filtreyi günde 24 saat kesintisiz çalıştırın; kapatmak azot döngüsünü bozar.",
      "Debi düştüyse önce hortum ve rotor bölmesini kontrol edip temizleyin.",
    ],
  },
  "motorlar-hava": {
    title: "Motor & Hava Sistemi Kullanımı",
    tips: [
      "Hava motorunu su seviyesinin üzerine yerleştirin ya da çek valf kullanın; elektrik kesintisinde su geri kaçabilir.",
      "Hava taşını ayda bir kontrol edin; tıkanan taş motoru yorar ve debiyi düşürür.",
      "Titreşim sesini azaltmak için motoru sünger ya da yumuşak bir zemin üzerine koyun.",
    ],
  },
  "isitma-aydinlatma": {
    title: "Isıtıcı & Aydınlatma Kullanımı",
    tips: [
      "Isıtıcıyı su akışının olduğu bir noktaya, filtre çıkışına yakın yerleştirin - ısı eşit dağılır.",
      "Ayrı bir termometreyle sıcaklığı doğrulayın; termostatlar sapma gösterebilir.",
      "Su değişiminde ısıtıcıyı önce fişten çekin, 10 dakika soğumadan sudan çıkarmayın.",
      "Aydınlatmayı günde 6-8 saatle sınırlayın; uzun süre ışık yosun patlamasına yol açar.",
    ],
  },
  "su-bakimi": {
    title: "Su Bakım Ürünü Kullanımı",
    tips: [
      "Dozajı mutlaka ürün etiketindeki talimata ve akvaryum litrenize göre ayarlayın; fazla doz zararlıdır.",
      "Su şartlandırıcıyı yeni suyu akvaryuma eklemeden önce, kovada uygulayın.",
      "Bakteri kültürlerini filtre çıkışına yakın dökün ve o gün UV cihazını (varsa) kapatın.",
      "Düzenli su testi yapmadan kimyasal katkı kullanmayın; önce ölçün, sonra düzeltin.",
    ],
  },
  "bitki-co2": {
    title: "Bitki & CO2 Kullanımı",
    tips: [
      "Sıvı gübreyi ışıkların açıldığı saatte verin; bitkiler ışıkla birlikte besini kullanır.",
      "CO2 sistemini ışıklardan 1 saat önce açıp 1 saat önce kapatacak şekilde zamanlayın.",
      "Yeni bitkileri dikmeden önce kurşun bandını ve taş yününü çıkarın, köklerini hafifçe budayın.",
      "Damla sayacı (drop checker) ile CO2 seviyesini yeşil tonda tutun; mavi az, sarı tehlikeli demektir.",
    ],
  },
  akvaryumlar: {
    title: "Akvaryum Kurulum İpuçları",
    tips: [
      "Akvaryumu düz, sağlam ve güneş almayan bir zemine kurun; direkt güneş yosun sorununa yol açar.",
      "Yeni akvaryumda balık eklemeden önce 3-4 haftalık azot döngüsünü tamamlayın.",
      "Camı sirke ya da akvaryum güvenli temizleyiciyle silin; deterjan kalıntısı balıklar için öldürücüdür.",
      "Litre başına yaklaşık 1 cm balık kuralıyla başlayın; aşırı stok en yaygın başlangıç hatasıdır.",
    ],
  },
  "baliklar-canlilar": {
    title: "Canlı Bakım Önerileri",
    tips: [
      "Yeni balıkları poşetiyle birlikte 15-20 dakika akvaryum suyunda yüzdürerek sıcaklığa alıştırın.",
      "Poşet suyunu akvaryuma boşaltmayın; balığı kepçeyle alın.",
      "İlk günler yemlemeyi hafif tutun ve balıkları stres belirtilerine karşı gözlemleyin.",
      "Mümkünse yeni canlıları 2 hafta karantina tankında tutup ana akvaryuma öyle ekleyin.",
    ],
  },
  "dekor-taban": {
    title: "Dekor & Taban Malzemesi Kullanımı",
    tips: [
      "Kum ve çakılı akvaryuma sermeden önce bulanıklık gidene kadar temiz suyla yıkayın.",
      "Doğal kaya ve kütükleri kaynatarak ya da fırçalayarak temizleyin; sirke testiyle kireç kontrolü yapın.",
      "Taban kalınlığı bitkili akvaryumda 5-6 cm, bitkisizde 2-3 cm idealdir.",
    ],
  },
  "kaplumbaga-surungen": {
    title: "Kaplumbağa & Sürüngen Bakımı",
    tips: [
      "Su kaplumbağaları için suyun dışında kuru bir güneşlenme alanı mutlaka bulunmalıdır.",
      "UVB aydınlatma kabuk sağlığı için zorunludur; lambayı 6-12 ayda bir yenileyin.",
      "Su sıcaklığını 24-28°C aralığında tutun ve güçlü bir filtre kullanın - kaplumbağalar suyu hızlı kirletir.",
    ],
  },
  kemirgenler: {
    title: "Kemirgen Bakımı",
    tips: [
      "Taze su ve yemi her gün yenileyin; kafesi haftada bir tamamen temizleyin.",
      "Kemirgenlerin dişleri sürekli uzar; kemirme taşı ya da dalları eksik etmeyin.",
    ],
  },
};

export function usageSections(product: EtProduct): UsageSection[] {
  return productGroupKeys(product)
    .map((k) => USAGE_BY_GROUP[k])
    .filter(Boolean);
}

/* ---------------- Ürün detayı: ilgili rehber makaleleri ---------------- */

const ARTICLES_BY_GROUP: Record<string, string[]> = {
  yemler: ["yemleme-rehberi", "stres-belirtileri"],
  filtreler: ["filtre-rehberi", "akvaryum-temizligi"],
  "motorlar-hava": ["hava-motoru", "filtre-rehberi"],
  "isitma-aydinlatma": ["isitici-kullanimi", "aydinlatma-rehberi"],
  "su-bakimi": ["su-sartlandiricilar", "su-testleri", "su-parametreleri"],
  "bitki-co2": ["bitkili-akvaryum", "co2-sistemleri", "yosun-sorunlari"],
  akvaryumlar: ["akvaryum-secimi", "ilk-akvaryum-kurulumu", "akvaryum-dongusu"],
  "baliklar-canlilar": ["ilk-baliklar", "balik-hastaliklari", "karides-ve-salyangozlar"],
  "dekor-taban": ["ilk-akvaryum-kurulumu", "bitkili-akvaryum"],
  "kaplumbaga-surungen": ["yemleme-rehberi"],
};

/** Ürüne göre ilgili yardım merkezi makale slug'ları (öncelik sırasıyla, en çok 4) */
export function relatedArticleSlugs(product: EtProduct): string[] {
  const slugs: string[] = [];
  const haystack = norm(
    [product.name, ...product.categories.map((c) => c.name)].join(" ")
  );
  // Tuzlu su ürünleri için özel eşleme
  if (/deniz|resif|mercan|skimmer|tuz\b/.test(haystack)) {
    slugs.push("tuzlu-su-akvaryumuna-giris", "tuz-ve-yogunluk");
  }
  for (const key of productGroupKeys(product)) {
    for (const slug of ARTICLES_BY_GROUP[key] ?? []) {
      if (!slugs.includes(slug)) slugs.push(slug);
    }
  }
  return slugs.slice(0, 4);
}
