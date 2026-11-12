import "server-only";
import { boundedJson } from "./http";
import { productsResponse, categoriesResponse, orderReceipt } from "./catalogue-schema";
import { withProductImages } from "./product-images";
export { formatPrice, primaryImage, productIcon } from "./product-display";
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
  const slug = process.env.EASYTRADE_CATALOG_SLUG?.trim();
  if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error("EASYTRADE_CATALOG_SLUG ortam değişkeni tanımlı değil");
  }
  return `${BASE_URL}/${slug}${path}`;
}

async function etFetch(path: string, fresh = false): Promise<unknown> {
  const res = await fetch(catalogUrl(path), {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: REVALIDATE_SECONDS } }),
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
  });
  if (!res.ok) {
    throw new Error(`EasyTrade katalog isteği başarısız: ${res.status} (${path})`);
  }
  return boundedJson(res);
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
  const response = productsResponse(await etFetch(`/products?${params.toString()}`));
  return { ...response, data: response.data.map(product => withProductImages(product)) };
}

// Tüm katalog: filtreleme/sayfalama lokalde yapılacağı için bütün sayfalar çekilir.
// Her sayfa URL'i Next fetch cache'inde 4 dk tutulur; sonraki isteklerde ağa çıkılmaz.
const ALL_PER_PAGE = 48;

export async function getAllProducts(fresh = false): Promise<EtProduct[]> {
  const first = productsResponse(await etFetch(
    `/products?per_page=${ALL_PER_PAGE}&page=1`, fresh
  ));
  const lastPage = first.pagination.last_page;
  if (!Number.isSafeInteger(lastPage) || lastPage < 1 || lastPage > 200 || !Array.isArray(first.data)) throw new Error("Invalid catalogue response");
  const all: EtProduct[][] = [first.data];

  const CHUNK = 10;
  for (let start = 2; start <= lastPage; start += CHUNK) {
    const nums: number[] = [];
    for (let p = start; p < start + CHUNK && p <= lastPage; p++) nums.push(p);
    const results = await Promise.all(
      nums.map((p) =>
        etFetch(`/products?per_page=${ALL_PER_PAGE}&page=${p}`, fresh).then(productsResponse)
      )
    );
    for (const r of results) all.push(r.data);
  }
  // Sayfalar arası veri kayarsa oluşabilecek mükerrerleri ele
  const seen = new Set<number>();
  return all.flat().filter((p) => !seen.has(p.id) && seen.add(p.id))
    .map(product => withProductImages(product));
}

export async function getCategories(): Promise<EtCategory[]> {
  return categoriesResponse(await etFetch("/categories"));
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

export async function postOrder(payload: OrderPayload) {
  if (process.env.NODE_ENV === "development") throw new Error("External order writes are disabled in development");
  // Laravel CSRF koruması: önce katalog sayfasından XSRF çerezi alınır,
  // sonra sipariş bu çerez ve X-XSRF-TOKEN başlığıyla gönderilir.
  const page = await fetch(catalogUrl(""), {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    redirect: "error",
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
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Order service rejected request (${res.status})`);
  }
  return orderReceipt(await boundedJson(res, 128_000), payload.total_amount);
}
