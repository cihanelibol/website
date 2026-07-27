import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  formatPrice,
  primaryImage,
  productEmoji,
  type EtProduct,
} from "@/lib/easytrade";

export default function ProductCard({ product }: { product: EtProduct }) {
  const imageUrl = primaryImage(product);
  const inStock = product.stock_quantity > 0;
  const lowStock = inStock && product.stock_quantity <= 5;
  const href = `/urunler/${product.id}`;

  return (
    <article className="glass card-hover group relative flex flex-col overflow-hidden rounded-3xl">
      {lowStock && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-slate-950">
          Son {product.stock_quantity} ürün
        </span>
      )}
      {!inStock && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-500/80 px-3 py-1 text-xs font-semibold text-white">
          Stokta yok
        </span>
      )}

      <Link
        href={href}
        className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 sm:h-52"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <span className="text-6xl transition-transform duration-500 group-hover:scale-125 sm:text-7xl">
            {productEmoji(product)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Başlık ve kod satırı sabit yükseklikte - kartlar hep aynı boyda kalır */}
        <Link href={href}>
          <h3 className="line-clamp-2 h-10 font-display text-sm font-semibold leading-snug transition-colors hover:text-cyan-200 sm:h-12 sm:text-base">
            {product.name}
          </h3>
        </Link>
        <span className="h-4 text-xs text-muted">
          {product.sku ? `Kod: ${product.sku}` : ""}
        </span>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-lg font-bold text-gradient">
              {formatPrice(product.price_with_tax)}
            </div>
            <div className="text-[11px] text-muted">
              KDV dahil / {product.unit.label}
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
