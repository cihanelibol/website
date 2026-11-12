"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import AppIcon from "@/components/AppIcon";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { formatPrice } from "@/lib/product-display";
import { useCart } from "./CartProvider";
import styles from "./CartRail.module.css";

const MINIMIZED_KEY = "ga:cart-rail-minimized";

export default function CartRail({ open, onOpen, onClose }: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { items, totalCount, totalAmount, setQty, remove } = useCart();
  const pathname = usePathname();
  const minimized = useRef(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const hasItems = items.length > 0;
  const shopping = pathname !== "/sepet" && !pathname.startsWith("/hesap") && !pathname.startsWith("/admin");

  useEffect(() => {
    if (open || !hasItems || !shopping || minimized.current) return;
    try { if (sessionStorage.getItem(MINIMIZED_KEY)) return; } catch {}
    const timer = window.setTimeout(onOpen, 2500);
    return () => window.clearTimeout(timer);
  }, [open, hasItems, shopping, onOpen]);

  function collapse() {
    minimized.current = true;
    try { sessionStorage.setItem(MINIMIZED_KEY, "1"); } catch {}
    onClose();
    // The persistent toggle also provides a predictable keyboard focus target.
    toggle.current?.focus();
  }

  if (!open && (!hasItems || !shopping)) return null;

  return (
    <aside
      className={open ? styles.rail : styles.collapsed}
      data-cart-rail-open={open ? "true" : undefined}
      aria-label="Hızlı sepet"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          collapse();
        }
      }}
    >
      {open && <div id="cart-rail-content" className={styles.content}>
        <div className={styles.summary}>
          <h2><AppIcon name="basket" size={18} /> Sepetim</h2>
          {hasItems ? <>
            <Link className={styles.primary} href="/sepet" onClick={collapse}>
              Siparişe geç <span>({totalCount} ürün)</span>
            </Link>
            <Link className={styles.secondary} href="/sepet" onClick={collapse}>Sepete git</Link>
            <div className={styles.subtotal} aria-live="polite" aria-atomic="true">
              <span>Ara toplam</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
          </> : <p className={styles.empty}>Sepetiniz henüz boş.</p>}
        </div>
        <div className={styles.items}>
          {items.map((item) => (
            <article key={item.id} className={styles.item} aria-label={item.name}>
              <Link href={`/urunler/${item.id}`} className={styles.photo} aria-label={item.name}>
                {item.image ? <Image src={item.image} alt="" fill sizes="118px" unoptimized /> : <ProductImagePlaceholder compact />}
              </Link>
              <Link href={`/urunler/${item.id}`} className={styles.name} title={item.name}>{item.name}</Link>
              {item.maxStock <= 3 && <span className={styles.stock}>Son {item.maxStock} {item.unit.toLocaleLowerCase("tr-TR")}!</span>}
              <strong className={styles.price}>{formatPrice(item.price * item.qty)}</strong>
              <div className={styles.controls}>
                <div className={styles.quantity}>
                  <button type="button" disabled={item.qty <= 1} onClick={() => setQty(item.id, item.qty - 1)} aria-label={`${item.name} adedini azalt`}>−</button>
                  <span aria-live="polite" aria-label={`${item.qty} adet`}>{item.qty}</span>
                  <button type="button" disabled={item.qty >= item.maxStock} onClick={() => setQty(item.id, item.qty + 1)} aria-label={`${item.name} adedini artır`}>+</button>
                </div>
                <button type="button" className={styles.remove} onClick={() => remove(item.id)} aria-label={`${item.name} ürününü sepetten kaldır`} title="Sepetten kaldır">
                  <AppIcon name="trash" size={15} />
                </button>
              </div>
            </article>
          ))}
          {!hasItems && <Link href="/urunler" className={styles.secondary} onClick={collapse}>Ürünleri keşfet</Link>}
        </div>
      </div>}
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={open ? "cart-rail-content" : undefined}
        aria-label={open ? "Sepeti küçült" : `Sepeti aç, ${totalCount} ürün`}
        onClick={open ? collapse : onOpen}
      >
        {open ? <>Küçült <span aria-hidden="true">›</span></> : <><AppIcon name="basket" size={21} /><span>{totalCount}</span><span aria-hidden="true">‹</span></>}
      </button>
    </aside>
  );
}
