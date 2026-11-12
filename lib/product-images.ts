import "server-only";
import manifest from "@/config/product-images.json";
import type { EtProduct } from "./easytrade";

type SavedImage = {
  name: string;
  sku: string | null;
  barcode: string | null;
  src: string;
  provider: string;
  sourceImage: string;
  imageId?: number;
};

/** Resolve on the server so the full catalogue manifest never reaches the client. */
export function withProductImages(
  product: EtProduct,
  images: Record<string, SavedImage> = manifest,
): EtProduct {
  const saved = images[String(product.id)];
  if (!saved || saved.name !== product.name || saved.sku !== product.sku || saved.barcode !== product.barcode) return product;
  if (!/^\/images\/products\/[a-f0-9]{24}\.webp$/.test(saved.src)) return product;

  // EasyTrade remains authoritative whenever a merchant adds a photograph.
  if (product.images.length) {
    if (saved.provider !== "easytrade") return product;
    return { ...product, images: product.images.map(image => {
      const source = new URL(image.url);
      return image.id === saved.imageId && source.origin + source.pathname === saved.sourceImage
        ? { ...image, url: saved.src } : image;
    }) };
  }
  return { ...product, images: [{ id: product.id, url: saved.src, is_primary: true, sort_order: 0 }] };
}
