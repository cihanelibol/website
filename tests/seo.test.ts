import { describe, expect, it, vi } from "vitest";
import { catalogNoindex, catalogUrl, parseCatalogParams, CATEGORY_CONTENT } from "@/lib/catalog-seo";
import { jsonLdString, productSchema } from "@/lib/seo";
import { getArticle } from "@/lib/rehber";
import type { EtProduct } from "@/lib/easytrade";

const product: EtProduct = { id: 123, name: "Eheim filtre", description: "Model açıklaması", sku: "sku-1", barcode: "invalid", stock_quantity: 3, price_with_tax: 123.45, currency: { value: "TRY", label: "Türk lirası" }, unit: { value: "unit", label: "Adet" }, categories: [], images: [{ id: 1, url: "/images/products/example.webp", is_primary: true, sort_order: 0 }], has_variations: false };

describe("catalogue SEO URL policy", () => {
  it("preserves page two, brand, stock, search and sort when migrating a group URL", () => {
    const f = parseCatalogParams({ grup: "filtreler", marka: "eheim", stok: "1", q: "filtre", sirala: "price_asc", sayfa: "2" })!;
    expect(catalogUrl(f)).toBe("/kategori/filtreler?marka=eheim&q=filtre&stok=1&sirala=price_asc&sayfa=2");
    expect(catalogNoindex(f, 20)).toBe(true);
  });
  it("does not canonicalize page two to page one", () => {
    expect(catalogUrl({ marka: "eheim", sayfa: 2 })).toBe("/marka/eheim?sayfa=2");
    expect(catalogNoindex({ marka: "eheim", sayfa: 2 }, 40)).toBe(false);
    expect(catalogUrl({ kategori: 42, sayfa: 2 })).toBe("/urunler?kategori=42&sayfa=2");
  });
  it.each(["NaN", "0", "-1", "1.5", "1e2", "9999999999999999999"])("rejects malformed pagination %s", value => {
    expect(parseCatalogParams({ sayfa: value })).toBeNull();
  });
  it("rejects ambiguous array params and unknown sort values", () => {
    expect(parseCatalogParams({ grup: ["filtreler", "yemler"] })).toBeNull();
    expect(parseCatalogParams({ sirala: "surprise" })).toBeNull();
  });
  it("keeps search and empty collections out of the index", () => {
    expect(catalogNoindex({ q: "fish" }, 12)).toBe(true);
    expect(catalogNoindex({}, 0)).toBe(true);
    expect(catalogUrl({ grup: "constructor" })).toBe("/urunler?grup=constructor");
  });
  it("links every category to a real guide", () => {
    for (const content of Object.values(CATEGORY_CONTENT)) expect(getArticle(content.guide)).toBeDefined();
  });
});

describe("safe and accurate structured data", () => {
  it("cannot terminate an HTML script with catalogue text", () => {
    const encoded = jsonLdString({ name: "</script><script>alert(1)</script>" });
    expect(encoded).not.toContain("<");
    expect(JSON.parse(encoded).name).toBe("</script><script>alert(1)</script>");
  });
  it("uses actual price, availability and only real ratings", () => {
    const schema = productSchema(product, { count: 0, average: 0 });
    expect(schema.offers?.price).toBe("123.45");
    expect(schema.offers?.availability).toBe("https://schema.org/InStock");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("gtin");
    expect(productSchema({ ...product, stock_quantity: 0 }, { count: 2, average: 4.5 }).offers?.availability).toBe("https://schema.org/OutOfStock");
  });
  it("never invents prices for variants or unsupported currency", () => {
    expect(productSchema({ ...product, has_variations: true }, { count: 0, average: 0 })).not.toHaveProperty("offers");
    expect(productSchema({ ...product, currency: { value: "USD", label: "Dollar" } }, { count: 0, average: 0 })).not.toHaveProperty("offers");
  });
});

describe("product discovery", () => {
  it("includes real products and only durable image URLs in sitemap", async () => {
    const easytrade = await import("@/lib/easytrade");
    const products = vi.spyOn(easytrade, "getAllProducts").mockResolvedValue([product]);
    const categories = vi.spyOn(easytrade, "getCategories").mockResolvedValue([]);
    try {
      const { default: sitemap } = await import("@/app/sitemap");
      const rows = await sitemap();
      expect(rows.find(r => r.url.endsWith("/urunler/123"))?.images).toEqual(["https://griakvaryum.com/images/products/example.webp"]);
      expect(rows.some(r => r.url.endsWith("/marka/eheim"))).toBe(true);
      products.mockRejectedValueOnce(new Error("catalogue unavailable"));
      await expect(sitemap()).rejects.toThrow("catalogue unavailable");
    } finally { products.mockRestore(); categories.mockRestore(); }
  });
});
