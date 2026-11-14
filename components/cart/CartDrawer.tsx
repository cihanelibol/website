"use client";
import { SHIPPING } from "@/lib/shipping";
import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { containDialogFocus } from "@/components/dialog-focus";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import CartRail from "./CartRail";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/product-display";

const DESKTOP_QUERY = "(min-width: 1280px)";
function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function desktopSnapshot() { return window.matchMedia(DESKTOP_QUERY).matches; }
function serverDesktopSnapshot() { return false; }

export default function CartDrawer(props: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const desktop = useSyncExternalStore(subscribeToViewport, desktopSnapshot, serverDesktopSnapshot);
  return desktop ? <CartRail {...props} /> : <MobileCartDrawer open={props.open} onClose={props.onClose} />;
}

function MobileCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, setQty, remove, totalCount, totalAmount } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      onKeyDown={containDialogFocus}
      ref={dialog}
      className="store-cart"
      aria-labelledby="cart-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="store-cart-inner">
        <div className="store-dialog-heading">
          <h2 id="cart-title">
            Sepetim{" "}
            <span className="text-muted text-sm font-normal">
              ({totalCount} ürün)
            </span>
          </h2>
          <button
            className="store-close"
            onClick={onClose}
            aria-label="Sepeti kapat"
          >
            ×
          </button>
        </div>
        {items.length === 0 ? (
          <div className="store-cart-empty">
            <h3>Sepetiniz henüz boş</h3>
            <p>Akvaryumunuz için ihtiyacınız olan ürünleri keşfedin.</p>
            <Link href="/urunler" className="store-button" onClick={onClose}>
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <>
            <div className="store-cart-items">
              {items.map((item) => (
                <div key={item.id} className="store-cart-item">
                  <Link
                    className="store-cart-thumb"
                    href={`/urunler/${item.id}`}
                    onClick={onClose}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="72px"
                        unoptimized
                      />
                    ) : (
                      <ProductImagePlaceholder compact />
                    )}
                  </Link>
                  <div className="store-cart-item-info">
                    <Link href={`/urunler/${item.id}`} onClick={onClose}>
                      {item.name}
                    </Link>
                    <div>
                      <div className="store-quantity">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label={`${item.name} adedini azalt`}
                        >
                          −
                        </button>
                        <span aria-live="polite">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.maxStock}
                          aria-label={`${item.name} adedini artır`}
                        >
                          +
                        </button>
                      </div>
                      <strong className="text-sm">
                        {formatPrice(item.price * item.qty)}
                      </strong>
                    </div>
                    <button
                      className="store-cart-remove"
                      onClick={() => remove(item.id)}
                      aria-label={`${item.name} ürününü sepetten kaldır`}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="store-cart-total">
              <div>
                <span>Ürünler toplamı</span>
                <strong aria-live="polite">{formatPrice(totalAmount)}</strong>
              </div>
              <p>
                KDV dahildir. {SHIPPING.summary}
              </p>
              <Link href="/sepet" onClick={onClose} className="store-button">
                Sepeti Gör ve Devam Et
              </Link>
              <button className="store-cart-continue" onClick={onClose}>
                Alışverişe devam et
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
