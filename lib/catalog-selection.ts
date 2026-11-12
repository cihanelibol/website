import "server-only";
import { notFound } from "next/navigation";
import { BRANDS, buildCategoryGroups, findGroup, norm, productMatchesBrand } from "./catalog";
import { getCatalogProducts, getCatalogCategories } from "./catalog-data";
import { CATEGORY_CONTENT, catalogNoindex, catalogUrl, parseCatalogParams, type CatalogParams } from "./catalog-seo";
import { pageMetadata } from "./seo";

export const PAGE_SIZE = 24;
export async function getCatalogSelection(raw: CatalogParams) {
  const filters = parseCatalogParams(raw);
  if (!filters) notFound();
  const { kategori: category, grup: groupKey, marka: brandSlug, q: search, stok: onlyInStock, sirala: sort } = filters;
  const [allProducts, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
  const groups = buildCategoryGroups(categories);
  const activeCategory = categories.find(c => c.id === category);
  const activeGroup = findGroup(groups, groupKey) ?? (activeCategory ? groups.find(g => g.categories.some(c => c.id === category)) : undefined);
  const activeBrand = BRANDS.find(b => b.slug === brandSlug);
  if ((category && !activeCategory) || (groupKey && !activeGroup) || (brandSlug && !activeBrand)) notFound();
  let filtered = allProducts;
  if (category) filtered = filtered.filter(p => p.categories.some(c => c.id === category));
  else if (activeGroup && groupKey) {
    const ids = new Set(activeGroup.categories.map(c => c.id));
    filtered = filtered.filter(p => p.categories.some(c => ids.has(c.id)));
  }
  if (activeBrand) filtered = filtered.filter(p => productMatchesBrand(p, activeBrand));
  if (search) {
    const q = norm(search);
    filtered = filtered.filter(p => norm(p.name).includes(q) || (p.sku && norm(p.sku).includes(q)) || (p.barcode && norm(p.barcode).includes(q)));
  }
  const brandCounts = new Map(BRANDS.map(b => [b.slug, filtered.filter(p => productMatchesBrand(p, b)).length]));
  if (onlyInStock) filtered = filtered.filter(p => p.stock_quantity > 0);
  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price_with_tax - b.price_with_tax);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price_with_tax - a.price_with_tax);
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = filters.sayfa ?? 1;
  if (page > lastPage) notFound();
  const products = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const content = groupKey && Object.hasOwn(CATEGORY_CONTENT, groupKey) ? CATEGORY_CONTENT[groupKey] : undefined;
  const heading = activeCategory?.name ?? content?.title ?? (groupKey ? activeGroup?.title : activeBrand?.label) ?? "Tüm Ürünler";
  const description = content?.description ?? (activeBrand ? `${activeBrand.label} ürünlerini güncel fiyat ve stok bilgileriyle inceleyin. Model, ölçü ve kullanım ihtiyacınıza göre karşılaştırın; ürün uyumu için Gri Akvaryum mağazasından destek alın.` : "Akvaryum, balık yemi, filtre ve ekipmanları güncel fiyat ve stok bilgileriyle inceleyin. Eminönü Gri Akvaryum mağazasından ürün seçimi desteği alın.");
  return { filters, category, groupKey, brandSlug, search, onlyInStock, sort, groups, activeCategory, activeGroup, activeBrand, brandCounts, products, total, lastPage, page, heading, description, content, base: { ...filters, sayfa: undefined }, hasFilters: Boolean(category || groupKey || brandSlug || search || onlyInStock) };
}

export async function catalogMetadata(raw: CatalogParams) {
  const s = await getCatalogSelection(raw);
  const title = `${s.heading}${s.search ? ` – ${s.search}` : ""}${s.page > 1 ? ` – Sayfa ${s.page}` : ""} | Gri Akvaryum`;
  return { ...pageMetadata(title, s.description, catalogUrl(s.filters)), robots: { index: !catalogNoindex(s.filters, s.total), follow: true } };
}
