import type { EtProduct } from "./easytrade";
import { InputError } from "./security";
export function priceItems(input: unknown, products: EtProduct[]) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 50) throw new InputError("Sepet 1–50 ürün içermeli.");
  const quantities = new Map<number, number>();
  for (const item of input) {
    if (!item || !Number.isSafeInteger(item.id) || item.id <= 0 || !Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 99)
      throw new InputError("Ürün veya adet geçersiz.");
    quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.qty);
  }
  let totalCents = 0;
  const items = [...quantities].sort(([a], [b]) => a - b).map(([id, qty]) => {
    const p = products.find(product => product.id === id);
    if (!p || p.has_variations || qty > 99 || !Number.isFinite(p.stock_quantity) || p.stock_quantity < qty)
      throw new InputError("Ürün veya stok uygun değil. Sepetinizi güncelleyin.");
    if (typeof p.name !== "string" || p.name.length > 300 || !Number.isFinite(p.price_with_tax) || p.price_with_tax <= 0 || !["TRY", "TL"].includes(p.currency?.value))
      throw new InputError("Ürünün fiyatı doğrulanamadı.");
    const cents = Math.round(p.price_with_tax * 100);
    if (!Number.isSafeInteger(cents) || cents < 1 || cents > 100_000_000) throw new InputError("Ürünün fiyatı geçersiz.");
    totalCents += cents * qty;
    return { id, name: p.name, qty, price: cents / 100 };
  });
  if (!Number.isSafeInteger(totalCents) || totalCents > 100_000_000) throw new InputError("Sipariş tutarı sınırı aşıldı.");
  return { items, total: totalCents / 100 };
}
