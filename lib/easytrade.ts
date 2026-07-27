// EasyTrade Dijital Katalog API istemcisi.
// Görsel URL'leri 5 dakikalık imzalı linkler olduğu için önbellek süresi 4 dakika tutulur.

const BASE_URL = "https://pro.easytradetr.com/catalog";
const REVALIDATE_SECONDS = 240;

export type EtCategory = {
  id: number;
  name: string;
  products_count: number;
};

export type EtImage = {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
};

export type EtProduct = {
  id: number;
  name: string;
  sku: string | null;
  barcode: string | null;
  description: string | null;
  stock_quantity: number;
  price_with_tax: number;
  currency: { value: string; label: string };
  unit: { value: string; label: string };
  categories: { id: number; name: string }[];
  images: EtImage[];
  has_variations: boolean;
};

export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type ProductsResponse = {
  data: EtProduct[];
  pagination: Pagination;
};

function catalogUrl(path: string): string {
  const slug = process.env.EASYTRADE_CATALOG_SLUG;
  if (!slug) {
    throw new Error("EASYTRADE_CATALOG_SLUG ortam değişkeni tanımlı değil");
  }
  return `${BASE_URL}/${slug}${path}`;
}

async function etFetch<T>(path: string): Promise<T> {
  const res = await fetch(catalogUrl(path), {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`EasyTrade katalog isteği başarısız: ${res.status} (${path})`);
  }
  return res.json() as Promise<T>;
}

export type SortOption = "default" | "price_asc" | "price_desc";

export async function getProducts(opts: {
  page?: number;
  category?: number;
  search?: string;
  sort?: SortOption;
} = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(opts.page ?? 1));
  if (opts.category) params.set("category", String(opts.category));
  if (opts.search) params.set("search", opts.search);
  if (opts.sort && opts.sort !== "default") params.set("sort", opts.sort);
  return etFetch<ProductsResponse>(`/products?${params.toString()}`);
}

// Tüm katalog: filtreleme/sayfalama lokalde yapılacağı için bütün sayfalar çekilir.
// Her sayfa URL'i Next fetch cache'inde 4 dk tutulur; sonraki isteklerde ağa çıkılmaz.
const ALL_PER_PAGE = 48;

export async function getAllProducts(): Promise<EtProduct[]> {
  const first = await etFetch<ProductsResponse>(
    `/products?per_page=${ALL_PER_PAGE}&page=1`
  );
  const lastPage = first.pagination.last_page;
  const all: EtProduct[][] = [first.data];

  const CHUNK = 10;
  for (let start = 2; start <= lastPage; start += CHUNK) {
    const nums: number[] = [];
    for (let p = start; p < start + CHUNK && p <= lastPage; p++) nums.push(p);
    const results = await Promise.all(
      nums.map((p) =>
        etFetch<ProductsResponse>(`/products?per_page=${ALL_PER_PAGE}&page=${p}`)
      )
    );
    for (const r of results) all.push(r.data);
  }
  // Sayfalar arası veri kayarsa oluşabilecek mükerrerleri ele
  const seen = new Set<number>();
  return all.flat().filter((p) => !seen.has(p.id) && seen.add(p.id));
}

export async function getCategories(): Promise<EtCategory[]> {
  const res = await etFetch<{ data: EtCategory[] }>("/categories");
  return res.data;
}

export async function getProduct(id: number): Promise<EtProduct | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id);
}

/* ---------------- Sipariş gönderimi ---------------- */
// Katalog frontend'inin kullandığı resmi payload şeması (CartSidebar analizi)

export type OrderAddress = {
  address: string;
  city: string;
  district: string;
  postal_code: string;
};

export type OrderItem = {
  product_id: number;
  variation_id: number | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: OrderAddress;
  billing_address: OrderAddress;
  notes: string;
  items: OrderItem[];
  total_amount: number;
};

export async function postOrder(payload: OrderPayload): Promise<void> {
  // Laravel CSRF koruması: önce katalog sayfasından XSRF çerezi alınır,
  // sonra sipariş bu çerez ve X-XSRF-TOKEN başlığıyla gönderilir.
  const page = await fetch(catalogUrl(""), {
    cache: "no-store",
    headers: { Accept: "text/html" },
  });
  const setCookies = page.headers.getSetCookie();
  const cookies = setCookies.map((c) => c.split(";")[0]);
  const xsrf = cookies
    .find((c) => c.startsWith("XSRF-TOKEN="))
    ?.slice("XSRF-TOKEN=".length);
  if (!xsrf) throw new Error("CSRF çerezi alınamadı");

  const res = await fetch(catalogUrl("/order"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": decodeURIComponent(xsrf),
      Cookie: cookies.join("; "),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Sipariş gönderilemedi: ${res.status} ${text.slice(0, 300)}`);
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(price);
}

// Görseli olmayan ürünler için kategori/isim bazlı emoji seçimi
export function productEmoji(product: EtProduct): string {
  const haystack = [product.name, ...product.categories.map((c) => c.name)]
    .join(" ")
    .toLocaleLowerCase("tr-TR");

  const rules: [RegExp, string][] = [
    [/yem|vitamin|besin/, "🦐"],
    [/filtre|motor|pompa|hava/, "⚙️"],
    [/ısıtıcı|termostat|termometre/, "🌡️"],
    [/led|aydınlatma|lamba|armatür/, "💡"],
    [/bitki|moss|tohum/, "🌿"],
    [/dekor|taban|kum|çakıl|kaya|mercan/, "🪸"],
    [/akvaryum|fanus|tank/, "🐟"],
    [/kedi/, "🐱"],
    [/köpek/, "🐶"],
    [/kuş/, "🦜"],
    [/balık|tetra|lepistes|beta|japon|moli|cichlid|ciklet/, "🐠"],
    [/ilaç|bakım|su düzenleyici|şartlandırıcı/, "🧪"],
    [/kescher|kepçe|sifon|hortum/, "🪣"],
  ];

  for (const [pattern, emoji] of rules) {
    if (pattern.test(haystack)) return emoji;
  }
  return "🐠";
}

export function primaryImage(product: EtProduct): string | null {
  if (product.images.length === 0) return null;
  const primary = product.images.find((i) => i.is_primary);
  return (primary ?? product.images[0]).url;
}
