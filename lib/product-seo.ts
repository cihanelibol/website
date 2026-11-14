import type { EtProduct } from "./easytrade";

/** Use only catalogue facts; never infer specifications from a product category. */
export function productDescription(product: EtProduct): string {
  if (product.description?.trim()) return product.description.trim();
  const category = product.categories.at(-1)?.name;
  return [
    product.name.trim() + ".",
    category ? `Kategori: ${category}.` : "",
    product.sku ? `Ürün kodu: ${product.sku}.` : "",
    product.unit.label ? `Satış birimi: ${product.unit.label}.` : "",
    "Ölçü, içerik ve uyumluluk bilgileri için ürün koduyla Gri Akvaryum mağazasından bilgi alabilirsiniz.",
  ].filter(Boolean).join(" ");
}

/** GTIN-8/12/13/14, including the GS1 check digit. Preserve leading zeroes. */
export function validatedGtin(barcode: string | null): string | undefined {
  const value = barcode?.trim();
  if (!value || !/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/.test(value) || /^0+$/.test(value)) return;
  const digits = [...value].map(Number);
  const check = digits.pop()!;
  const sum = digits.reverse().reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - sum % 10) % 10 === check ? value : undefined;
}
