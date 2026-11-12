import { BRANDS } from "./catalog";

export type CatalogParams = Record<string, string | string[] | undefined>;
export type CatalogFilters = { grup?: string; kategori?: number; marka?: string; q?: string; stok?: boolean; sirala?: string; sayfa?: number };
export const CATEGORY_CONTENT: Record<string, { title: string; description: string; guide: string }> = {
  "baliklar-canlilar": { title: "Akvaryum Balıkları ve Canlılar", description: "Akvaryumunuza canlı seçerken tank hacmini, mevcut türleri ve su koşullarını birlikte değerlendirin. Güncel ürünleri inceleyin; tür uyumu ve mağazadan teslim bilgisi için bize ulaşın.", guide: "karantina" },
  akvaryumlar: { title: "Akvaryum Modelleri", description: "Akvaryum seçimini yerleştireceğiniz alan, beslemek istediğiniz canlılar ve ekipman ihtiyaçlarına göre yapın. Modelleri karşılaştırırken ölçüleri ve set içeriğini kontrol edin.", guide: "akvaryum-secimi" },
  yemler: { title: "Balık Yemleri", description: "Pul, granül ve diğer yemleri balığınızın türüne, boyutuna ve beslenme alışkanlığına göre karşılaştırın. Ambalaj miktarını ve ürünün kullanım açıklamasını inceleyerek seçim yapın.", guide: "yemleme-rehberi" },
  filtreler: { title: "Akvaryum Filtreleri ve Filtre Malzemeleri", description: "İç filtre, dış filtre ve filtre malzemelerini akvaryum hacmi, canlı yükü ve bakım ihtiyacına göre değerlendirin. Debi tek başına yeterli değildir; filtre ortamı ve model uyumluluğunu da kontrol edin.", guide: "filtre-rehberi" },
  "motorlar-hava": { title: "Akvaryum Hava Motorları ve Pompalar", description: "Hava motoru ve pompa seçerken çıkış sayısı, debi, kullanım amacı ve ekipman uyumunu karşılaştırın. Akvaryumunuzun ölçülerini paylaşarak seçim desteği alabilirsiniz.", guide: "hava-motoru" },
  "su-bakimi": { title: "Akvaryum Su Bakımı ve Test Ürünleri", description: "Su düzenleyicileri, testleri ve bakım ürünlerini ölçülen su değerlerine göre seçin. Ürünün kullanım talimatını ve canlılarla uyumluluğunu kontrol edin; farklı ürünleri gelişigüzel birleştirmeyin.", guide: "su-testleri" },
  "isitma-aydinlatma": { title: "Akvaryum Isıtıcıları ve Aydınlatma", description: "Isıtıcı ve aydınlatma seçiminde tank ölçüleri, ortam koşulları, canlı ve bitki ihtiyaçları birlikte değerlendirilir. Ürün gücünü, ölçülerini ve montaj uyumunu karşılaştırın.", guide: "isitici-kullanimi" },
  "aksesuar-temizlik": { title: "Akvaryum Aksesuarları ve Temizlik Ürünleri", description: "Kepçe, sifon, hortum ve bakım aksesuarlarını tank ölçülerinize ve kullanım amacınıza göre seçin. Temizlik ekipmanında malzeme uyumunu ve erişim uzunluğunu kontrol edin.", guide: "akvaryum-temizligi" },
  "bitki-co2": { title: "Akvaryum Bitkileri ve CO2 Ekipmanları", description: "Bitkili akvaryum için ürünleri ışık, taban ve bakım düzeninizle birlikte değerlendirin. CO2 ekipmanlarında bağlantı uyumu ve üreticinin güvenli kullanım talimatları önemlidir.", guide: "bitkili-akvaryum" },
  "dekor-taban": { title: "Akvaryum Dekorları ve Taban Malzemeleri", description: "Kum, taban ve dekor seçerken canlıların ihtiyaçlarını, tank ölçülerini ve malzemenin suya etkisini değerlendirin. Ürün ölçülerini ve paket miktarını karşılaştırın.", guide: "ilk-akvaryum-kurulumu" },
};

export function parseCatalogParams(raw: CatalogParams): CatalogFilters | null {
  const keys = ["grup", "kategori", "marka", "q", "stok", "sirala", "sayfa"];
  if (keys.some(k => Array.isArray(raw[k]))) return null;
  const p = raw as Record<string, string | undefined>;
  const positiveInteger = (v: string) => /^[1-9]\d*$/.test(v) && Number.isSafeInteger(Number(v));
  if ((p.kategori && !positiveInteger(p.kategori)) || (p.sayfa && !positiveInteger(p.sayfa))) return null;
  if (p.sirala && !["default", "price_asc", "price_desc"].includes(p.sirala)) return null;
  if (p.stok && p.stok !== "1") return null;
  return { grup: p.kategori ? undefined : p.grup || undefined, kategori: p.kategori ? Number(p.kategori) : undefined, marka: p.marka || undefined, q: p.q?.trim() || undefined, stok: p.stok === "1", sirala: p.sirala || "default", sayfa: p.sayfa ? Number(p.sayfa) : 1 };
}

export function catalogUrl(f: CatalogFilters): string {
  const params = new URLSearchParams();
  let path = "/urunler";
  if (f.grup && !f.kategori && Object.hasOwn(CATEGORY_CONTENT, f.grup)) path = `/kategori/${f.grup}`;
  else if (f.marka && !f.kategori && !f.grup && BRANDS.some(b => b.slug === f.marka)) path = `/marka/${f.marka}`;
  else if (f.grup && !f.kategori) params.set("grup", f.grup);
  if (f.kategori) params.set("kategori", String(f.kategori));
  if (f.marka && !path.startsWith("/marka/")) params.set("marka", f.marka);
  if (f.q) params.set("q", f.q);
  if (f.stok) params.set("stok", "1");
  if (f.sirala && f.sirala !== "default") params.set("sirala", f.sirala);
  if (f.sayfa && f.sayfa > 1) params.set("sayfa", String(f.sayfa));
  return params.size ? `${path}?${params}` : path;
}

export function catalogNoindex(f: CatalogFilters, total: number) {
  return total === 0 || Boolean(f.q || f.stok || (f.sirala && f.sirala !== "default") || (f.marka && (f.grup || f.kategori)));
}
