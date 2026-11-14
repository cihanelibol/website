import { expect, it } from "vitest";
import manifest from "../config/product-editorial.json";
import { editorialDescription, getProductEditorial } from "../lib/product-editorial";
import { productSchema } from "../lib/seo";
import type { EtProduct } from "../lib/easytrade";

const saved = manifest["3751779"];
const product: EtProduct = {
  id: 3751779, name: saved.name, sku: saved.sku, barcode: saved.barcode,
  description: null, stock_quantity: 5, price_with_tax: 100, has_variations: false,
  currency: { value: "TRY", label: "TL" }, unit: { value: "piece", label: "Adet" }, categories: [], images: [],
};

it("fails closed when any product identity changes", () => {
  expect(getProductEditorial(product)).toEqual(saved);
  for (const change of [{ id: 1 }, { name: "Other model" }, { sku: null }, { barcode: null }]) {
    expect(getProductEditorial({ ...product, ...change })).toBeNull();
  }
});

it("preserves merchant content and never mutates stock or cart data", () => {
  expect(getProductEditorial({ ...product, description: "Merchant description" })).toBeNull();
  expect(getProductEditorial({ ...product, description: "  " })).toEqual(saved);
  getProductEditorial(product);
  expect(product.description).toBeNull();
  expect(product.stock_quantity).toBe(5);
});

it("uses the same description in visible text and product schema without inventing offers", () => {
  const description = editorialDescription(saved);
  const schema = productSchema({ ...product, description }, { count: 0, average: 0 });
  expect(schema?.description).toBe(description);
  expect(schema?.offers?.price).toBe("100.00");
  expect(schema).not.toHaveProperty("gtin13");
  expect(productSchema({ ...product, description, has_variations: true }, { count: 0, average: 0 })).toBeNull();
});

it("has traceable, identity-bound content for all 158 selected stock items", () => {
  expect(Object.keys(manifest)).toHaveLength(158);
  const summaries = new Set<string>();
  for (const [id, entry] of Object.entries(manifest)) {
    expect(entry.sku).toBeTruthy();
    expect(entry.barcode).toBeTruthy();
    expect(entry.summary.length).toBeGreaterThan(60);
    expect(entry.details.length).toBeGreaterThanOrEqual(2);
    const source = new URL(entry.source.url);
    expect(source.protocol).toBe("https:");
    expect(["eheim.com", "www.eheim.de", "www.sera.de"]).toContain(source.hostname);
    expect(entry.source.checkedAt).toBe("2026-11-13");
    expect(getProductEditorial({ ...product, id: Number(id), name: entry.name, sku: entry.sku, barcode: entry.barcode })).toEqual(entry);
    summaries.add(entry.summary);
  }
  expect(summaries.size).toBe(158);
});
