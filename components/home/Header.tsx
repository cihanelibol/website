"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import Icon from "./Icon";
import s from "./home.module.css";

export default function Header() {
  const { totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  useEffect(() => {
    const open = () => setCartOpen(true);
    window.addEventListener("ga:open-cart", open);
    return () => window.removeEventListener("ga:open-cart", open);
  }, []);

  return <>
    <header className={s.header}>
      <div className={`${s.container} ${s.headerMain}`}>
        <Link href="/" className={s.brand} aria-label="Gri Akvaryum ana sayfa">
          <Image src="/logo-mark.png" alt="" width={64} height={52} />
          <span>Gri<span>Akvaryum</span></span>
        </Link>
        <form action="/urunler" role="search" className={s.search}>
          <Icon name="search" />
          <input type="search" name="q" aria-label="Ürün, balık türü veya marka arayın" placeholder="Ürün, balık türü veya marka arayın" required maxLength={120} />
          <button type="submit" aria-label="Ara"><Icon name="search" /></button>
        </form>
        <div className={s.accountLinks}>
          <Link href="/hesap"><Icon name="user" /><span>Hesabım</span></Link>
          <button onClick={() => setCartOpen(true)} aria-label={`Sepetim, ${totalCount} ürün`}><Icon name="basket" /><span>Sepetim</span><b className={s.cartCount} aria-live="polite">{totalCount}</b></button>
        </div>
      </div>
      <nav className={`${s.container} ${s.nav}`} aria-label="Ana menü">
        <Link href="/urunler" className={s.allCategories}><Icon name="grid" />Tüm kategoriler</Link>
        <Link href="/urunler?grup=baliklar-canlilar">Canlı Balık</Link>
        <Link href="/urunler?grup=akvaryumlar">Akvaryumlar</Link>
        <Link href="/urunler?grup=yemler">Yemler</Link>
        <Link href="/urunler?grup=filtreler">Filtreler</Link>
        <Link href="/rehber#tuzlu-su">Deniz &amp; Resif</Link>
        <Link href="/rehber" className={s.guideLink}><Icon name="book" />Akvaryum Rehberi</Link>
      </nav>
    </header>
    <CartDrawer open={cartOpen} onOpen={openCart} onClose={closeCart} />
  </>;
}
