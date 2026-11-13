"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import SiteSearch from "./SiteSearch";
import AnimatedSearchInput from "./AnimatedSearchInput";
import CartDrawer from "./cart/CartDrawer";
import { useCart } from "./cart/CartProvider";
import { logoutAction } from "@/app/hesap/actions";

const links = [
  ["/urunler", "Tüm Ürünler"],
  ["/kategori/baliklar-canlilar", "Canlı Balık"],
  ["/kategori/yemler", "Balık Yemleri"],
  ["/kategori/filtreler", "Filtreler"],
  ["/kategori/su-bakimi", "Kimyasallar"],
  ["/kategori/aksesuar-temizlik", "Aksesuar"],
  ["/rehber#tuzlu-su", "Deniz & Resif"],
  ["/rehber", "Yardım Merkezi"],
  ["/iletisim", "İletişim"],
];
function CategoryLinks() {
  const path = usePathname();
  const params = useSearchParams();
  return (
    <>
      {links.map(([href, label]) => {
        const [target, query] = href.split("?");
        const active =
          !href.includes("#") &&
          path === target &&
          (query ? params.toString() === query : !params.toString());
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
function subscribeToAccount(onChange: () => void) {
  window.addEventListener("focus", onChange);
  return () => window.removeEventListener("focus", onChange);
}
function accountSnapshot() {
  return document.cookie;
}
function serverAccountSnapshot() {
  return "";
}
export default function Navbar({ seamless = false }: { seamless?: boolean }) {
  const { totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const accountCookie = useSyncExternalStore(
    subscribeToAccount,
    accountSnapshot,
    serverAccountSnapshot,
  );
  const userName = /(?:^|;\s*)ga_user=([^;]+)/.test(accountCookie);
  const isAdmin = /(?:^|;\s*)ga_role=admin(?:;|$)/.test(accountCookie);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    // Next.js and anchor links need the entire sticky header's scroll offset.
    const updateHeight = () => {
      root.style.setProperty("--store-header-height", `${header.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--store-header-height");
    };
  }, []);
  useEffect(() => {
    const open = () => setCartOpen(true);
    window.addEventListener("ga:open-cart", open);
    return () => window.removeEventListener("ga:open-cart", open);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);
  return (
    <>
      <a className="store-skip" href="#main-content">
        İçeriğe geç
      </a>
      <header ref={headerRef} className="store-header" data-seamless={seamless || undefined}>
        <div className="store-container store-header-main">
          <Link
            href="/"
            className="store-logo"
            aria-label="Gri Akvaryum ana sayfa"
          >
            <Image
              src="/logo-mark.png"
              alt=""
              width={38}
              height={38}
              priority
            />
            <span>
              Gri<b>Akvaryum</b>
            </span>
          </Link>
          <form action="/urunler" role="search" className="store-search">
            <SiteSearch />
            <label className="sr-only" htmlFor="store-search">
              Ürün, balık türü veya marka arayın
            </label>
            <AnimatedSearchInput />
            <button type="submit">Ara</button>
          </form>
          <div className="store-header-actions">
            <Link
              className="store-account"
              href={userName ? "/hesap" : "/giris"}
              aria-label={userName ? "Hesabım" : "Giriş yap"}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="7" r="3.5" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>
              <span>{userName ? "Hesabım" : "Giriş Yap"}</span>
            </Link>
            <button
              type="button"
              className="store-cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Sepetim, ${totalCount} ürün`}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m8 3-3 6m11-6 3 6M3 9h18l-1.7 10a2 2 0 0 1-2 1.7H6.7a2 2 0 0 1-2-1.7L3 9Z" />
                <path d="M10 13h4l-2 3-2-3Z" fill="currentColor" stroke="none" />
              </svg>
              <span className="store-cart-label">Sepetim</span>
              <span aria-live="polite">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="store-menu-button"
              aria-expanded={menuOpen}
              aria-controls="store-mobile-menu"
              aria-label="Menüyü aç veya kapat"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={menuOpen ? "M6 6l12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
        <nav className="store-container store-nav" aria-label="Ana menü">
          <Suspense
            fallback={links.map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          >
            <CategoryLinks />
          </Suspense>
        </nav>
        {menuOpen && (
          <nav
            ref={menuRef}
            id="store-mobile-menu"
            className="store-mobile-menu"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("a")) {
                setMenuOpen(false);
              }
            }}
            aria-label="Mobil ana menü"
          >
            <div className="store-mobile-categories">
              {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
            </div>
            <Link href="/hesap/siparisler">Siparişlerim</Link>
            {isAdmin && <Link href="/admin">Yönetim paneli</Link>}
            {userName ? (
              <form action={logoutAction}>
                <button>Çıkış yap</button>
              </form>
            ) : (
              <Link href="/kayit">Hesap oluştur</Link>
            )}
          </nav>
        )}
      </header>
      <CartDrawer open={cartOpen} onOpen={openCart} onClose={closeCart} />
    </>
  );
}
