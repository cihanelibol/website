"use client";

import AppIcon from "@/components/AppIcon";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { logActivity } from "@/components/ActivityPing";
import type { EtProduct } from "@/lib/easytrade";
import { primaryImage } from "@/lib/product-display";

/** Ürün kartlarındaki küçük "Sepete Ekle" düğmesi */
export function AddToCartButton({
  product,
  onAdded,
  iconOnly = false,
}: {
  product: EtProduct;
  onAdded?: () => void;
  iconOnly?: boolean;
}) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inStock = product.stock_quantity > 0;
  const inCart = items.find((item) => item.id === product.id)?.qty ?? 0;
  const remaining = Math.max(0, product.stock_quantity - inCart);
  const label = !inStock ? "Tükendi" : added ? "Sepete eklendi" : remaining <= 0 ? "Stok sınırına ulaşıldı" : "Sepete ekle";

  const onAdd = () => {
    if (remaining <= 0) return;
    add({
      id: product.id,
      name: product.name,
      price: product.price_with_tax,
      image: primaryImage(product),      unit: product.unit.label,
      maxStock: product.stock_quantity,
    });
    logActivity({
      type: "sepete-ekleme",
      productId: product.id,
      productName: product.name,
      qty: 1,
    });
    setAdded(true);
    window.dispatchEvent(new Event("ga:open-cart"));
    onAdded?.();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      disabled={!inStock || remaining <= 0}
      onClick={onAdd}
      className={iconOnly ? "store-add store-add-icon" : "store-add"}
      data-added={added}
      aria-label={`${product.name}: ${label}`}
      title={label}
      aria-live="polite"
    >
      {iconOnly ? <>
        <span className="store-add-label">{!inStock ? "Tükendi" : added ? "Eklendi" : remaining <= 0 ? "Sepetinizde" : "Sepete ekle"}</span>
        <AppIcon name={added || (inStock && remaining <= 0) ? "check" : "basket"} size={22} />
      </> : !inStock
        ? "Tükendi"
        : added
          ? <><AppIcon name="check" /> Eklendi</>
          : remaining <= 0
            ? "Sepetinizde"
            : "Sepete Ekle"}
    </button>
  );
}

/** Ürün detay sayfasındaki adet seçicili büyük düğme */
export function AddToCartDetail({ product }: { product: EtProduct }) {
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = product.stock_quantity > 0;
  const inCart = items.find((item) => item.id === product.id)?.qty ?? 0;
  const remaining = Math.max(0, product.stock_quantity - inCart);

  const onAdd = () => {
    if (remaining <= 0) return;
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price_with_tax,
        image: primaryImage(product),        unit: product.unit.label,
        maxStock: product.stock_quantity,
      },
      Math.min(qty, remaining),
    );
    logActivity({
      type: "sepete-ekleme",
      productId: product.id,
      productName: product.name,
      qty: Math.min(qty, remaining),
    });
    setAdded(true);
    window.dispatchEvent(new Event("ga:open-cart"));
    setTimeout(() => setAdded(false), 1800);
  };

  if (!inStock) {
    return (
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-slate-500/20 px-6 py-3.5 font-semibold text-slate-300">
          Stokta Yok
        </span>
        <span className="text-sm text-muted">
          Bu ürün için mağazamızı arayabilirsiniz.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="glass flex items-center rounded-2xl">
        <button
          disabled={qty <= 1 || remaining <= 0}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-3.5 text-lg font-bold text-cyan-300 transition-colors hover:text-cyan-100"
          aria-label="Adet azalt"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center font-semibold" aria-live="polite">{Math.min(qty, Math.max(1, remaining))}</span>
        <button
          disabled={qty >= remaining}
          onClick={() => setQty((q) => Math.min(Math.max(1, remaining), q + 1))}
          className="px-4 py-3.5 text-lg font-bold text-cyan-300 transition-colors hover:text-cyan-100"
          aria-label="Adet artır"
        >
          +
        </button>
      </div>
      <button
        onClick={onAdd}
        disabled={remaining <= 0}
        aria-live="polite"
        className="disabled:opacity-50 glow rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-105"
      >
        {added
          ? <><AppIcon name="check" /> Sepete Eklendi</>
          : remaining <= 0
            ? "Stok sınırına ulaşıldı"
            : "Sepete Ekle"}
      </button>
    </div>
  );
}
