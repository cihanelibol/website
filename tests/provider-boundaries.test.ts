import { it, expect } from "vitest";
import { boundedJson } from "../lib/http";
import { orderReceipt, productsResponse } from "../lib/catalogue-schema";
const receipt = { success: true, order: { order_number: "ET-42", total_amount: "10.00", currency: "TRY" } };
it("validates external order evidence including currency and exact amount", () => {
  expect(orderReceipt({ props: { result: receipt } }, 10).reference).toBe("ET-42");
  for (const change of [{ currency: "USD" }, { total_amount: 0.01 }, { order_number: "" }, { total_amount: "1e1" }])
    expect(() => orderReceipt({ ...receipt, order: { ...receipt.order, ...change } }, 10)).toThrow();
  expect(() => orderReceipt({ ...receipt, success: false }, 10)).toThrow();
});
it("bounds streamed JSON and rejects HTML success pages", async () => {
  await expect(boundedJson(new Response("a".repeat(100), { headers: { "Content-Type": "application/json" } }), 20)).rejects.toThrow("too large");
  await expect(boundedJson(new Response("<html>ok</html>", { headers: { "Content-Type": "text/html" } }))).rejects.toThrow("content type");
});
it("rejects unsafe image URLs and malformed catalogue types", () => {
  const product = { id: 1, name: "Test", sku: null, barcode: null, description: null, stock_quantity: 1, price_with_tax: 10, has_variations: false, currency: { value: "TRY", label: "TL" }, unit: { value: "piece", label: "Adet" }, categories: [], images: [{ id: 1, url: "https://example.test/image.jpg", is_primary: true, sort_order: 0 }] };
  const payload = { data: [product], pagination: { current_page: 1, last_page: 1, per_page: 1, total: 1, from: 1, to: 1 } };
  expect(productsResponse(payload).data[0].id).toBe(1);
  for (const url of ["data:text/html,evil", "javascript:alert(1)", "https://name:password@example.test/a", "http://example.test/a"]) {
    product.images[0].url = url; expect(() => productsResponse(payload)).toThrow();
  }
});
