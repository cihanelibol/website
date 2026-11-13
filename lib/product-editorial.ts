import "server-only";
import manifest from "@/config/product-editorial.json";
import type { EtProduct } from "./easytrade";

export type ProductEditorial = {
  name: string;
  sku: string | null;
  barcode: string | null;
  summary: string;
  details: string[];
  source: { title: string; url: string; checkedAt: string };
};

/** Merchant descriptions take precedence. Reused IDs must never inherit another model's advice. */
export function getProductEditorial(
  product: EtProduct,
  entries: Record<string, ProductEditorial> = manifest,
): ProductEditorial | null {
  if (product.description?.trim()) return null;
  const entry = entries[String(product.id)];
  if (!entry || entry.name !== product.name || entry.sku !== product.sku || entry.barcode !== product.barcode) return null;
  return entry;
}

export function editorialDescription(entry: ProductEditorial): string {
  return [entry.summary, ...entry.details].join("\n\n");
}
