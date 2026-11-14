import { describe, expect, it, vi } from "vitest";
import { catalogNoindex, catalogUrl, parseCatalogParams, CATEGORY_CONTENT } from "@/lib/catalog-seo";
import { jsonLdString, productSchema, storeSchema } from "@/lib/seo";
import { getArticle } from "@/lib/rehber";
import type { EtProduct } from "@/lib/easytrade";
import { productDescription, validatedGtin } from "@/lib/product-seo";
import { SHIPPING, shippingFee, totalWithShipping } from "@/lib/shipping";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

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
  it("links the merchant's published return policy without inventing fees", () => {
    expect(storeSchema.hasMerchantReturnPolicy.merchantReturnLink).toBe("https://griakvaryum.com/sozlesme/mesafeli-satis");
    expect(storeSchema.hasMerchantReturnPolicy).not.toHaveProperty("returnFees");
  });
  it("cannot terminate an HTML script with catalogue text", () => {
    const encoded = jsonLdString({ name: "</script><script>alert(1)</script>" });
    expect(encoded).not.toContain("<");
    expect(JSON.parse(encoded).name).toBe("</script><script>alert(1)</script>");
  });
  it("uses actual price, availability and only real ratings", () => {
    const schema = productSchema(product, { count: 0, average: 0 });
    expect(schema?.offers?.price).toBe("123.45");
    expect(schema?.offers?.availability).toBe("https://schema.org/InStock");
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("gtin");
    expect(productSchema({ ...product, stock_quantity: 0 }, { count: 2, average: 4.5 })?.offers?.availability).toBe("https://schema.org/OutOfStock");
  });
  it("never invents prices for variants or unsupported currency", () => {
    expect(productSchema({ ...product, has_variations: true }, { count: 0, average: 0 })).toBeNull();
    expect(productSchema({ ...product, currency: { value: "USD", label: "Dollar" } }, { count: 0, average: 0 })).toBeNull();
  });
  it.each([0, -1, NaN, Infinity, 0.001])("omits an ineligible Product for price %s", price => {
    expect(productSchema({ ...product, price_with_tax: price }, { count: 0, average: 0 })).toBeNull();
  });
  it("uses catalogue facts as the shared visible description", () => {
    const withoutDescription = { ...product, description: null };
    const description = productDescription(withoutDescription);
    expect(description).toContain(product.name);
    expect(description).toContain(product.sku);
    expect(productSchema(withoutDescription, { count: 0, average: 0 })?.description).toBe(description);
    expect(productDescription(product)).toBe(product.description);
  });
  it.each(["96385074", "012345678905", "4011708020395", "10012345678902"])("preserves checksum-valid GTIN %s", barcode => {
    expect(validatedGtin(barcode)).toBe(barcode);
    expect(productSchema({ ...product, barcode }, { count: 0, average: 0 })?.gtin).toBe(barcode);
  });
  it.each([null, "", "00000000", "0000000000000", "4011708020396", "SKU-123", "1234567"])("omits invalid GTIN %s", barcode => {
    expect(validatedGtin(barcode)).toBeUndefined();
    expect(productSchema({ ...product, barcode }, { count: 0, average: 0 })).not.toHaveProperty("gtin");
  });
  it("publishes only approved, matching real reviews", () => {
    const review = { id: "r1", productId: product.id, name: "Müşteri", rating: 5, comment: "Kullanışlı", createdAt: "2026-11-14T09:00:00Z", moderation: "approved" as const };
    const schema = productSchema(product, { count: 1, average: 5 }, [review, { ...review, moderation: "pending" }, { ...review, productId: 999 }]);
    expect(schema?.review).toHaveLength(1);
    expect(schema?.review?.[0].reviewBody).toBe(review.comment);
    expect(schema?.aggregateRating?.reviewCount).toBe(1);
    expect(productSchema(product, { count: 0, average: 0 })).not.toHaveProperty("review");
  });
});

describe("confirmed shipping terms", () => {
  it.each([[0, 0], [2499.99, 200], [2500, 200], [2500.01, 0], [5000, 0]])("calculates shipping on %s TL", (subtotal, fee) => {
    expect(shippingFee(subtotal)).toBe(fee);
    expect(totalWithShipping(subtotal)).toBe(subtotal + fee);
    if (subtotal > 0) {
      const shipping = productSchema({ ...product, price_with_tax: subtotal }, { count: 0, average: 0 })?.offers?.shippingDetails;
      expect(shipping?.shippingRate.value).toBe(fee);
      expect(shipping?.deliveryTime.cutoffTime).toBe(SHIPPING.cutoffTime);
      expect(shipping?.deliveryTime).not.toHaveProperty("transitTime");
    }
  });
});

describe("Search Console legacy URLs", () => {
  it("rescues the old fish slug and preserves filters and attribution", () => {
    const response = proxy(new NextRequest("https://griakvaryum.com/urunler?kategori=baliklar&marka=sobo&stok=1&sayfa=2&utm_source=google"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://griakvaryum.com/kategori/baliklar-canlilar?marka=sobo&stok=1&sayfa=2&utm_source=google");
  });
  it("does not rescue malformed or ambiguous category parameters", () => {
    for (const query of ["kategori=unknown", "kategori=baliklar&kategori=42", "kategori=baliklar&sayfa=NaN"]) {
      expect(proxy(new NextRequest(`https://griakvaryum.com/urunler?${query}`)).headers.get("location")).toBeNull();
    }
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
