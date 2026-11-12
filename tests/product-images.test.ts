import { expect, it } from "vitest";
import { withProductImages } from "../lib/product-images";
import type { EtProduct } from "../lib/easytrade";

const product: EtProduct = {
  id: 42, name: "Test filter 100", sku: "F100", barcode: "1234567890123",
  description: null, stock_quantity: 5, price_with_tax: 10, has_variations: false,
  currency: { value: "TRY", label: "TL" }, unit: { value: "piece", label: "Adet" }, categories: [], images: [],
};
const saved = { name: product.name, sku: product.sku, barcode: product.barcode,
  src: "/images/products/1234567890abcdef12345678.webp", provider: "supplier.test", sourceImage: "https://supplier.test/photo.jpg" };

it("attaches verified photographs to the shared product data", () => {
  const result = withProductImages(product, { 42: saved });
  expect(result.images[0].url).toBe(saved.src);
  expect(product.images).toEqual([]);
});
it("does not reuse a photograph after a product identity changes", () => {
  for (const change of [{ name: "Test filter 200" }, { sku: "F200" }, { barcode: "9999999999999" }])
    expect(withProductImages({ ...product, ...change }, { 42: saved }).images).toEqual([]);
  expect(withProductImages(product, { 42: { ...saved, src: "https://untrusted.test/image.jpg" } }).images).toEqual([]);
});
it("prefers new EasyTrade images over external photographs", () => {
  const live = { ...product, images: [{ id: 100, url: "https://easytrade.test/signed", is_primary: true, sort_order: 0 }] };
  expect(withProductImages(live, { 42: saved })).toBe(live);
  const snapshot = { ...saved, provider: "easytrade", imageId: 100, sourceImage: "https://easytrade.test/signed" };
  expect(withProductImages(live, { 42: snapshot }).images[0].url).toBe(saved.src);
  expect(withProductImages(live, { 42: { ...snapshot, imageId: 101 } }).images[0].url).toBe(live.images[0].url);
  expect(withProductImages(live, { 42: { ...snapshot, sourceImage: "https://easytrade.test/older-photo" } }).images[0].url).toBe(live.images[0].url);
});
