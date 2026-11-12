import type { EtProduct } from "@/lib/easytrade";
import { norm } from "@/lib/catalog";

export const visualTypes = ["food", "filter", "conditioner", "light"] as const;
export type ProductVisual = (typeof visualTypes)[number];

// Unbranded illustrations describe the category, not the exact packaging.
// ProductCard discloses them and keeps them out of the actual cart data.
export function productVisual(product: EtProduct): ProductVisual | undefined {
  const name = norm(product.name);
  if (/yedek|hortum|elyaf|sunger|adaptor|lastik|lastigi|conta|pervane|musluk|vana|sepet|boru|vantuz|kapak|baglanti|malzeme|seti|akvaryum baslangic|aydinlatmali/.test(name)) return;
  if (/\bflakes\b|\bpul yem|\bsupervit\b/.test(name)) return "food";
  if (/dis filtre(?:\s*(?:\(|\d)|$)/.test(name)) return "filter";
  if (/aquasafe|su duzenleyici|su sartlandirici/.test(name)) return "conditioner";
  if (/\bled\b/.test(name) && /aydinlatma|armatur|lamba/.test(name)) return "light";
}
