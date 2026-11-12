import "server-only";
import { object, boundedString, finiteNumber } from "./http";
import type { EtProduct, ProductsResponse, EtCategory } from "./easytrade";

function integer(value: unknown, min = 0) {
  const n = finiteNumber(value); if (!Number.isSafeInteger(n) || n < min) throw new Error("Invalid catalogue integer"); return n;
}
function list(value: unknown, max: number) {
  if (!Array.isArray(value) || value.length > max) throw new Error("Invalid catalogue array"); return value;
}
function label(value: unknown) { const v = object(value); return { value: boundedString(v.value, 32)!, label: boundedString(v.label, 120)! }; }
function product(value: unknown): EtProduct {
  const p = object(value);
  if (typeof p.has_variations !== "boolean") throw new Error("Invalid variation flag");
  return {
    id: integer(p.id, 1), name: boundedString(p.name, 300)!, sku: boundedString(p.sku, 150, true),
    barcode: boundedString(p.barcode, 150, true), description: boundedString(p.description, 50_000, true),
    stock_quantity: finiteNumber(p.stock_quantity), price_with_tax: finiteNumber(p.price_with_tax),
    currency: label(p.currency), unit: label(p.unit), has_variations: p.has_variations,
    categories: list(p.categories, 100).map(value => { const c = object(value); return { id: integer(c.id, 1), name: boundedString(c.name, 300)! }; }),
    images: list(p.images, 100).map(value => {
      const i = object(value); const url = new URL(boundedString(i.url, 8192)!);
      if (url.protocol !== "https:" || url.username || url.password || typeof i.is_primary !== "boolean") throw new Error("Invalid catalogue image");
      return { id: integer(i.id, 1), url: url.href, is_primary: i.is_primary, sort_order: integer(i.sort_order) };
    }),
  };
}
export function productsResponse(value: unknown): ProductsResponse {
  const response = object(value), p = object(response.pagination);
  return { data: list(response.data, 200).map(product), pagination: {
    current_page: integer(p.current_page, 1), last_page: integer(p.last_page, 1), per_page: integer(p.per_page, 1), total: integer(p.total),
    from: p.from === null ? null : integer(p.from), to: p.to === null ? null : integer(p.to),
  } };
}
export function categoriesResponse(value: unknown): EtCategory[] {
  return list(object(value).data, 2000).map(value => { const c = object(value); return { id: integer(c.id, 1), name: boundedString(c.name, 300)!, products_count: integer(c.products_count) }; });
}
export function orderReceipt(value: unknown, expectedTotal: number) {
  const root = object(value);
  const body = root.props ? object(object(root.props).result ?? root.props) : root;
  const order = object(body.order);
  const reference = boundedString(order.order_number, 120);
  const total = typeof order.total_amount === "string" && /^\d+(\.\d{1,2})?$/.test(order.total_amount) ? Number(order.total_amount) : finiteNumber(order.total_amount);
  if (body.success !== true || !reference || !["TRY", "TL"].includes(String(order.currency)) || Math.round(total * 100) !== Math.round(expectedTotal * 100))
    throw new Error("Order acknowledgement mismatch");
  return { reference, total, currency: "TRY" as const };
}
