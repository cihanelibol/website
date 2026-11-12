"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { EtProduct } from "@/lib/easytrade";
import { formatPrice, primaryImage } from "@/lib/product-display";
import { useCart } from "@/components/cart/CartProvider";
import { logActivity } from "@/components/ActivityPing";
import Icon from "./Icon";
import { productVisual } from "./product-visual";
import s from "./home.module.css";

const FAVORITES_KEY = "ga_favorite_products";
const FAVORITES_EVENT = "ga:favorites-change";
let favoritesMemory = "[]";
let memoryOnly = false;
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(FAVORITES_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(FAVORITES_EVENT, onChange);
  };
}
function snapshot() {
  if (memoryOnly) return favoritesMemory;
  try { return localStorage.getItem(FAVORITES_KEY) ?? "[]"; } catch { return favoritesMemory; }
}
function serverSnapshot() { return "[]"; }
function parseFavorites(raw: string): number[] {
  try {
    const values: unknown = JSON.parse(raw);
    return Array.isArray(values) ? values.filter((value): value is number => Number.isSafeInteger(value)) : [];
  } catch { return []; }
}

export default function ProductCard({ product }: { product: EtProduct }) {
  const { add, items } = useCart();
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const favorite = parseFavorites(raw).includes(product.id);
  const [imageFailed, setImageFailed] = useState(false);
  const image = primaryImage(product);
  const visual = productVisual(product);
  const representative = (!image || imageFailed) && visual;
  const quantity = items.find((item) => item.id === product.id)?.qty ?? 0;
  const canAdd = product.stock_quantity > quantity;

  function toggleFavorite() {
    const current = parseFavorites(snapshot());
    favoritesMemory = JSON.stringify(current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]);
    try { localStorage.setItem(FAVORITES_KEY, favoritesMemory); } catch { memoryOnly = true; }
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  }

  function addToCart() {
    if (!canAdd) return;
    add({ id: product.id, name: product.name, price: product.price_with_tax, image, unit: product.unit.label, maxStock: product.stock_quantity });
    logActivity({ type: "sepete-ekleme", productId: product.id, productName: product.name, qty: 1 });
    window.dispatchEvent(new Event("ga:open-cart"));
  }

  return <article className={s.product}>
    <Link href={`/urunler/${product.id}`} className={s.productImage} aria-label={product.name}>
      {image && !imageFailed ? <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 45vw, (max-width: 1000px) 30vw, 300px" unoptimized onError={() => setImageFailed(true)} /> : representative ? <Image src={`/images/home-v2/${visual}.webp`} alt="Ürün kategorisine ait temsili görsel; gerçek ambalaj farklıdır" fill sizes="(max-width: 640px) 45vw, 300px" /> : <span className={s.imageFallback}><Icon name="fish" /><span>Gri Akvaryum</span></span>}
    </Link>
    <button className={s.favorite} aria-label={`${product.name}: ${favorite ? "Favorilerden çıkar" : "Favorilere ekle"}`} aria-pressed={favorite} onClick={toggleFavorite}><Icon name="heart" fill={favorite ? "currentColor" : "none"} /></button>
    <div className={s.productBody}>
      {representative && <span className={s.representative}>Temsili görsel</span>}
      <Link href={`/urunler/${product.id}`}><h3>{product.name}</h3></Link>
      <p className={s.productUnit}>KDV dahil · {product.unit.label}</p>
      <div className={s.productBuy}>
        <strong>{formatPrice(product.price_with_tax)}</strong>
        <button className={s.addButton} disabled={!canAdd} onClick={addToCart} aria-label={`${product.name}: ${canAdd ? "Sepete ekle" : "Stok sınırına ulaşıldı"}`} title={canAdd ? "Sepete ekle" : "Stok sınırına ulaşıldı"}><Icon name={canAdd ? "basket" : "check"} /></button>
      </div>
    </div>
  </article>;
}
