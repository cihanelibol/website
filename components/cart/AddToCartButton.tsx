"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { logActivity } from "@/components/ActivityPing";
import type { EtProduct } from "@/lib/easytrade";
import { primaryImage, productEmoji } from "@/lib/easytrade";

/** Ürün kartlarındaki küçük "Sepete Ekle" düğmesi */
export function AddToCartButton({ product }: { product: EtProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const inStock = product.stock_quantity > 0;

  const onAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price_with_tax,
      image: primaryImage(product),
      emoji: productEmoji(product),
      unit: product.unit.label,
      maxStock: product.stock_quantity,
    });
    logActivity({
      type: "sepete-ekleme",
      productId: product.id,
      productName: product.name,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      disabled={!inStock}
      onClick={onAdd}
      className="rounded-xl bg-cyan-400/15 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cyan-400/15 disabled:hover:text-cyan-200"
    >
      {!inStock ? "Tükendi" : added ? "✓ Eklendi" : "Sepete Ekle"}
    </button>
  );
}

/** Ürün detay sayfasındaki adet seçicili büyük düğme */
export function AddToCartDetail({ product }: { product: EtProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = product.stock_quantity > 0;

  const onAdd = () => {
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price_with_tax,
        image: primaryImage(product),
        emoji: productEmoji(product),
        unit: product.unit.label,
        maxStock: product.stock_quantity,
      },
      qty
    );
    logActivity({
      type: "sepete-ekleme",
      productId: product.id,
      productName: product.name,
      qty,
    });
    setAdded(true);
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
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-3.5 text-lg font-bold text-cyan-300 transition-colors hover:text-cyan-100"
          aria-label="Adet azalt"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock_quantity, q + 1))}
          className="px-4 py-3.5 text-lg font-bold text-cyan-300 transition-colors hover:text-cyan-100"
          aria-label="Adet artır"
        >
          +
        </button>
      </div>
      <button
        onClick={onAdd}
        className="glow rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-105"
      >
        {added ? "✓ Sepete Eklendi" : "🛒 Sepete Ekle"}
      </button>
    </div>
  );
}
