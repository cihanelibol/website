"use client";
import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { containDialogFocus } from "@/components/dialog-focus";
import Link from "next/link";
import { useId, useRef } from "react";
import type { EtProduct } from "@/lib/easytrade";
import { formatPrice, primaryImage } from "@/lib/product-display";
import { AddToCartButton } from "./cart/AddToCartButton";

export default function ProductQuickView({ product }: { product: EtProduct }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const image = primaryImage(product);
  return (
    <>
      <button
        type="button"
        className="store-quick-trigger"
        aria-haspopup="dialog"
        aria-label={`${product.name} için hızlı bakış`}
        onClick={() => dialog.current?.showModal()}
      >
        Hızlı bak
      </button>
      <dialog
        onKeyDown={containDialogFocus}
        ref={dialog}
        className="store-dialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="store-dialog-heading">
          <h2 id={titleId}>Ürüne hızlı bakış</h2>
          <button
            type="button"
            className="store-close"
            aria-label="Hızlı bakışı kapat"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <div className="store-quick-body">
          <div className="store-quick-photo">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="340px"
                unoptimized
              />
            ) : (
              <ProductImagePlaceholder />
            )}
          </div>
          <div className="store-quick-info">
            <p>{product.categories[0]?.name}</p>
            <h3>{product.name}</h3>
            <p>
              {product.stock_quantity > 0
                ? `Stokta ${product.stock_quantity} ${product.unit.label.toLocaleLowerCase("tr-TR")}`
                : "Bu ürün şu anda stokta yok."}
            </p>
            <div>
              <div className="store-price">
                {formatPrice(product.price_with_tax)}
              </div>
              <div className="store-tax">KDV dahil / {product.unit.label}</div>
            </div>
            <AddToCartButton
              product={product}
              onAdded={() => dialog.current?.close()}
            />
            <Link
              href={`/urunler/${product.id}`}
              onClick={() => dialog.current?.close()}
            >
              Ürün detaylarını incele →
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
