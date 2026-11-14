import type { MetadataRoute } from "next";
import { articles } from "@/lib/rehber";
import { SITE_URL as BASE_URL } from "@/lib/site";
import { getAllProducts, getCategories } from "@/lib/easytrade";
import { BRANDS, buildCategoryGroups, productMatchesBrand } from "@/lib/catalog";
import { CATEGORY_CONTENT } from "@/lib/catalog-seo";
import { SHIPPING } from "@/lib/shipping";

// Keep the sitemap fresh without generating it against an unavailable API at build time.
// Errors propagate as 5xx instead of publishing an empty product sitemap.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}${SHIPPING.policyPath}`, lastModified: new Date("2026-11-14"), changeFrequency: "monthly" },
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/urunler`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rehber`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/iletisim`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/rehber/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE_URL}/urunler/${p.id}`,
    // Signed supplier URLs expire; include only durable local images in the sitemap.
    images: p.images.filter(i => i.url.startsWith("/images/")).map(i => `${BASE_URL}${i.url}`),
  }));
  const categoryPages = buildCategoryGroups(categories)
    .filter(g => Object.hasOwn(CATEGORY_CONTENT, g.key) && products.some(p => p.categories.some(c => g.categories.some(gc => gc.id === c.id))))
    .map(g => ({ url: `${BASE_URL}/kategori/${g.key}` }));
  const brandPages = BRANDS.filter(b => products.some(p => productMatchesBrand(p, b))).map(b => ({ url: `${BASE_URL}/marka/${b.slug}` }));
  return [...staticPages, { url: `${BASE_URL}/magaza/eminonu` }, ...categoryPages, ...brandPages, ...productPages, ...articlePages];
}
