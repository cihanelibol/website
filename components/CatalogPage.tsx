import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { getArticle } from "@/lib/rehber";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/app/urunler/SortSelect";
import JsonLd from "@/components/JsonLd";
import { BRANDS } from "@/lib/catalog";
import { catalogUrl as pageUrl, type CatalogParams } from "@/lib/catalog-seo";
import { getCatalogSelection } from "@/lib/catalog-selection";
import { breadcrumbs } from "@/lib/seo";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<CatalogParams> }) {
  const { category, groupKey, brandSlug, search, onlyInStock, sort, groups, activeCategory, activeGroup, brandCounts, products, total, lastPage, page, heading, description, content, base, hasFilters } = await getCatalogSelection(await searchParams);
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

  return (
    <>
      <Navbar />
      <JsonLd data={breadcrumbs([{ name: "Ana Sayfa", path: "/" }, { name: "Ürünler", path: "/urunler" }, ...(hasFilters ? [{ name: heading, path: pageUrl(base) }] : [])])} />
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

            {page === 1 && !search && (
              <div className="mb-6 rounded-2xl border border-cyan-400/15 p-5 text-sm leading-relaxed text-muted">
                <p>{description}</p>
                {content && <Link className="mt-2 inline-block font-semibold text-accent" href={`/rehber/${content.guide}`}>{getArticle(content.guide)?.title ?? "Seçim ve kullanım rehberi"} →</Link>}
              </div>
            )}

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
