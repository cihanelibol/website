import { CATEGORY_CONTENT } from "./catalog-seo";
import { productGroupKeys } from "./catalog";
import type { EtProduct } from "./easytrade";

// Editorial navigation, not a medical recommendation or a claim of product compatibility.
// These category pages are published; individual product stock stays on the catalogue.
export const GUIDE_CATEGORY_KEYS: Record<string, readonly string[]> = {
  "ilk-akvaryum-kurulumu": ["akvaryumlar", "filtreler", "dekor-taban"],
  "akvaryum-dongusu": ["su-bakimi", "filtreler"],
  "akvaryum-secimi": ["akvaryumlar"],
  "baslangic-ekipman-listesi": ["akvaryumlar", "filtreler", "isitma-aydinlatma"],
  "ilk-baliklar": ["baliklar-canlilar", "yemler"],
  "haftalik-bakim-rutini": ["aksesuar-temizlik", "su-bakimi"],
  "akvaryum-temizligi": ["aksesuar-temizlik", "filtreler"],
  "bitkili-akvaryum": ["bitki-co2", "dekor-taban", "isitma-aydinlatma"],
  "yosun-sorunlari": ["su-bakimi", "aksesuar-temizlik"],
  "karides-ve-salyangozlar": ["baliklar-canlilar", "yemler"],
  "tuzlu-su-akvaryumuna-giris": ["akvaryumlar", "su-bakimi", "motorlar-hava"],
  "tuz-ve-yogunluk": ["su-bakimi"],
  "canli-kaya-ve-olgunlasma": ["su-bakimi", "dekor-taban"],
  "resif-mercan-bakimi": ["isitma-aydinlatma", "su-bakimi"],
  "protein-skimmer": ["filtreler"],
  "su-parametreleri": ["su-bakimi"],
  "azot-dongusu": ["su-bakimi", "filtreler"],
  "su-testleri": ["su-bakimi"],
  "su-sartlandiricilar": ["su-bakimi"],
  "karantina": ["akvaryumlar", "aksesuar-temizlik"],
  "yemleme-rehberi": ["yemler"],
  "filtre-rehberi": ["filtreler", "motorlar-hava"],
  "isitici-kullanimi": ["isitma-aydinlatma"],
  "aydinlatma-rehberi": ["isitma-aydinlatma", "bitki-co2"],
  "hava-motoru": ["motorlar-hava"],
  "co2-sistemleri": ["bitki-co2"],
};

function categoryLinks(keys: readonly string[]) {
  return [...new Set(keys)]
    .filter(key => Object.hasOwn(CATEGORY_CONTENT, key))
    .map(key => ({ href: `/kategori/${key}`, title: CATEGORY_CONTENT[key].title }));
}

export function guideCategoryLinks(slug: string) {
  return categoryLinks(Object.hasOwn(GUIDE_CATEGORY_KEYS, slug) ? GUIDE_CATEGORY_KEYS[slug] : []);
}

export function productCategoryLinks(product: EtProduct) {
  return categoryLinks(productGroupKeys(product));
}
