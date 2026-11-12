import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SortSelect from "./SortSelect";
import {
  getAllProducts,
  getCategories,
  type EtProduct,
  type SortOption,
} from "@/lib/easytrade";
import {
  BRANDS,
  buildCategoryGroups,
  findGroup,
  norm,
  productMatchesBrand,
} from "@/lib/catalog";

// Soğuk katalog isteği için bu rotanın çalışma bütçesi.
export const maxDuration = 60;

export const metadata = {
  title: "Ürünler | Gri Akvaryum",
  description:
    "Süs balıkları, akvaryumlar, yemler ve ekipmanlar - tüm ürünlerimiz.",
};

const PAGE_SIZE = 24;

type SearchParams = Promise<{
  grup?: string;
  kategori?: string;
  marka?: string;
  q?: string;
  stok?: string;
  sirala?: string;
  sayfa?: string;
}>;

type Filters = {
  grup?: string;
  kategori?: number;
  marka?: string;
  q?: string;
  stok?: boolean;
  sirala?: string;
  sayfa?: number;
};

function pageUrl(f: Filters): string {
  const params = new URLSearchParams();
  if (f.grup) params.set("grup", f.grup);
  if (f.kategori) params.set("kategori", String(f.kategori));
  if (f.marka) params.set("marka", f.marka);
  if (f.q) params.set("q", f.q);
  if (f.stok) params.set("stok", "1");
  if (f.sirala && f.sirala !== "default") params.set("sirala", f.sirala);
  if (f.sayfa && f.sayfa > 1) params.set("sayfa", String(f.sayfa));
  const qs = params.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = params.kategori ? Number(params.kategori) : undefined;
  const groupKey = category ? undefined : params.grup || undefined;
  const brandSlug = params.marka || undefined;
  const search = params.q?.trim() || undefined;
  const onlyInStock = params.stok === "1";
  const sort = (
    ["price_asc", "price_desc"].includes(params.sirala ?? "")
      ? params.sirala
      : "default"
  ) as SortOption;

  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const groups = buildCategoryGroups(categories);
  const activeCategory = categories.find((c) => c.id === category);
  const activeGroup =
    findGroup(groups, groupKey) ??
    (activeCategory
      ? groups.find((g) => g.categories.some((c) => c.id === category))
      : undefined);
  const activeBrand = BRANDS.find((b) => b.slug === brandSlug);

  // Filtreleme tamamen lokal - kategori, grup, marka, arama, stok
  let filtered: EtProduct[] = allProducts;
  if (category) {
    filtered = filtered.filter((p) =>
      p.categories.some((c) => c.id === category)
    );
  } else if (activeGroup && groupKey) {
    const ids = new Set(activeGroup.categories.map((c) => c.id));
    filtered = filtered.filter((p) => p.categories.some((c) => ids.has(c.id)));
  }
  if (activeBrand) {
    filtered = filtered.filter((p) => productMatchesBrand(p, activeBrand));
  }
  if (search) {
    const q = norm(search);
    filtered = filtered.filter(
      (p) =>
        norm(p.name).includes(q) ||
        (p.sku && norm(p.sku).includes(q)) ||
        (p.barcode && norm(p.barcode).includes(q))
    );
  }

  // Marka sayıları stok filtresi hariç, diğer aktif filtrelere göre hesaplanır
  const brandCounts = new Map<string, number>();
  for (const b of BRANDS) {
    brandCounts.set(
      b.slug,
      filtered.filter((p) => productMatchesBrand(p, b)).length
    );
  }

  if (onlyInStock) {
    filtered = filtered.filter((p) => p.stock_quantity > 0);
  }

  if (sort === "price_asc") {
    filtered = [...filtered].sort((a, b) => a.price_with_tax - b.price_with_tax);
  } else if (sort === "price_desc") {
    filtered = [...filtered].sort((a, b) => b.price_with_tax - a.price_with_tax);
  }

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    lastPage,
    params.sayfa ? Math.max(1, Number(params.sayfa)) : 1
  );
  const products = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = Boolean(
    category || groupKey || brandSlug || search || onlyInStock
  );

  const base: Filters = {
    grup: groupKey,
    kategori: category,
    marka: brandSlug,
    q: search,
    stok: onlyInStock,
    sirala: sort,
  };

  const sidebar = (inputId: string) => (
    <div className="store-catalog-filters glass rounded-3xl p-5">
      {/* Arama */}
      <form action="/urunler" className="mb-5">
        {groupKey && <input type="hidden" name="grup" value={groupKey} />}
        {category && <input type="hidden" name="kategori" value={category} />}
        {sort !== "default" && (
          <input type="hidden" name="sirala" value={sort} />
        )}
        {brandSlug && <input type="hidden" name="marka" value={brandSlug} />}
        {onlyInStock && <input type="hidden" name="stok" value="1" />}
        <label htmlFor={inputId} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          {activeCategory || activeGroup ? "Bu kategoride ara" : "Ürün ara"}
        </label>
        <div className="flex gap-2">
          <input
            type="search"
            id={inputId} name="q"
            defaultValue={search ?? ""}
            placeholder="Ürün adı / kod"
            title="Ürün adı, kod veya barkod ile ara"
            className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
            aria-label="Ara"
          >
            <AppIcon name="search" size={20} />
          </button>
        </div>
      </form>

      {/* Stok filtresi */}
      <Link
        href={pageUrl({ ...base, stok: !onlyInStock })}
        className="mb-5 flex items-center gap-2.5 rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm transition-colors hover:border-cyan-400/40"
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
            onlyInStock
              ? "border-transparent bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
              : "border-cyan-400/30 text-transparent"
          }`}
        >
          <AppIcon name="check" />
        </span>
        Stokta olmayanları gizle
      </Link>

      {/* Kategoriler - ana gruplar + alt kategoriler */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Kategoriler
        </div>
        <nav aria-label="Katalog kategorileri" className="max-h-[24rem] space-y-1 overflow-y-auto pr-1 lg:max-h-[46vh]">
          <Link
            href={pageUrl({ ...base, grup: undefined, kategori: undefined, sayfa: undefined })}
            className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
              !category && !groupKey
                ? "bg-gradient-to-r from-cyan-500/25 to-teal-500/25 font-semibold text-cyan-200"
                : "text-muted hover:bg-cyan-400/10 hover:text-foreground"
            }`}
          >
            Tüm Ürünler
          </Link>

          {groups.map((group) => {
            const isActiveGroup = activeGroup?.key === group.key;
            return (
              <details
                key={group.key}
                open={isActiveGroup}
                className="group/acc rounded-lg"
              >
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActiveGroup && !category
                      ? "bg-gradient-to-r from-cyan-500/25 to-teal-500/25 font-semibold text-cyan-200"
                      : "text-foreground hover:bg-cyan-400/10"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0"><AppIcon name={group.icon ?? "book"} /></span>
                    <span className="store-category-name font-medium">{group.title}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted transition-transform group-open/acc:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-cyan-400/15 pl-2">
                  <Link
                    href={pageUrl({
                      ...base,
                      grup: group.key,
                      kategori: undefined,
                      sayfa: undefined,
                    })}
                    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      isActiveGroup && !category
                        ? "font-semibold text-cyan-200"
                        : "text-muted hover:bg-cyan-400/10 hover:text-foreground"
                    }`}
                  >
                    <span>Tümü</span>
                    <span className="shrink-0 text-xs store-count">
                      {group.total}
                    </span>
                  </Link>
                  {group.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={pageUrl({
                        ...base,
                        grup: undefined,
                        kategori: cat.id,
                        sayfa: undefined,
                      })}
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        category === cat.id
                          ? "bg-gradient-to-r from-cyan-500/25 to-teal-500/25 font-semibold text-cyan-200"
                          : "text-muted hover:bg-cyan-400/10 hover:text-foreground"
                      }`}
                    >
                      <span className="store-category-name min-w-0">{cat.name}</span>
                      <span className="shrink-0 text-xs store-count">
                        {cat.products_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>
      </div>

      {/* Markalar */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Markalar
        </div>
        <nav aria-label="Markalar" className="space-y-0.5">
          {BRANDS.filter((b) => (brandCounts.get(b.slug) ?? 0) > 0).map(
            (brand) => {
              const isActive = brandSlug === brand.slug;
              return (
                <Link
                  key={brand.slug}
                  href={pageUrl({
                    ...base,
                    marka: isActive ? undefined : brand.slug,
                    sayfa: undefined,
                  })}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/25 to-teal-500/25 font-semibold text-cyan-200"
                      : "text-muted hover:bg-cyan-400/10 hover:text-foreground"
                  }`}
                >
                  <span>{brand.label}</span>
                  <span className="shrink-0 text-xs store-count">
                    {brandCounts.get(brand.slug)}
                  </span>
                </Link>
              );
            }
          )}
        </nav>
      </div>
    </div>
  );

  const heading = activeCategory
    ? activeCategory.name
    : activeGroup && groupKey
      ? activeGroup.title
      : activeBrand?.label ?? "Tüm Ürünler";

  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container store-catalog-page min-h-svh pb-20">
        <nav aria-label="Sayfa yolu" className="store-catalog-breadcrumb text-xs text-muted">
          <Link href="/" className="hover:text-cyan-300">
            Ana Sayfa
          </Link>
          {" / "}
          <Link href="/urunler" className="hover:text-cyan-300">
            Ürünler
          </Link>
          {activeGroup && ` / ${activeGroup.title}`}
          {activeCategory && ` / ${activeCategory.name}`}
        </nav>

        <div className="store-catalog-layout lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
          {/* Kenar çubuğu - mobilde katlanabilir */}
          <details className="store-catalog-mobile-filters group lg:hidden">
            <summary className="glass flex cursor-pointer list-none items-center justify-between rounded-2xl px-5 py-3.5 font-semibold">
              <span><AppIcon name="filter" /> Filtreler &amp; Kategoriler</span>
              <span className="transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="mt-3">{sidebar("catalog-search-mobile")}</div>
          </details>
          <aside className="store-filter-sidebar hidden lg:sticky lg:top-24 lg:block">{sidebar("catalog-search-desktop")}</aside>

          {/* Ürün alanı */}
          <div className="min-w-0">
            <div className="store-catalog-toolbar glass">
              <div className="store-catalog-summary">
                <h1>
                  {heading}
                  {search && <span className="text-muted"> - &quot;{search}&quot;</span>}
                </h1>
                <div className="store-catalog-meta text-muted">
                  <span>
                    <strong className="text-foreground">
                      {total.toLocaleString("tr-TR")}
                    </strong>{" "}
                    ürün bulundu
                  </span>
                  {hasFilters && (
                    <Link
                      href="/urunler"
                      className="store-catalog-clear inline-flex items-center gap-1.5 text-accent"
                    >
                      <AppIcon name="close" /> Filtreleri Temizle
                    </Link>
                  )}
                </div>
              </div>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>

            {/* Sonuç alanı - ekrana göre sabit minimum yükseklik: 1-2 ürün
                kalsa ya da hiç sonuç olmasa bile sayfa küçülmez, hiçbir şey kaymaz */}
            <div className="flex min-h-[55vh] flex-col lg:min-h-[calc(100svh-16rem)]">
              {products.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <span className="text-6xl"><AppIcon name="search" /></span>
                  <p className="text-lg font-semibold">
                    Aramanızla eşleşen ürün bulunamadı
                  </p>
                  <p className="max-w-sm text-sm text-muted">
                    Farklı bir kategori deneyin ya da filtreleri temizleyerek
                    tüm ürünlere göz atın.
                  </p>
                  <Link
                    href="/urunler"
                    className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
                  >
                    Filtreleri Temizle
                  </Link>
                </div>
              ) : (
                <div className="store-catalog-products grid content-start">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} headingLevel={2} />
                  ))}
                </div>
              )}
            </div>

            {/* Sayfalama */}
            {lastPage > 1 && (
              <nav aria-label="Katalog sayfaları" className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {page > 1 ? (
                  <Link
                    href={pageUrl({ ...base, sayfa: page - 1 })}
                    className="glass rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:border-cyan-400/40"
                  >
                    ← Önceki
                  </Link>
                ) : (
                  <span aria-disabled="true" className="glass rounded-xl px-5 py-2.5 text-sm text-muted">
                    ← Önceki
                  </span>
                )}

                <span className="px-3 text-sm text-muted">
                  {page} / {lastPage}
                </span>

                {page < lastPage ? (
                  <Link
                    href={pageUrl({ ...base, sayfa: page + 1 })}
                    className="glass rounded-xl px-5 py-2.5 text-sm font-medium transition-colors hover:border-cyan-400/40"
                  >
                    Sonraki →
                  </Link>
                ) : (
                  <span aria-disabled="true" className="glass rounded-xl px-5 py-2.5 text-sm text-muted">
                    Sonraki →
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
