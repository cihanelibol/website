"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteSearch from "./SiteSearch";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { logoutAction } from "@/app/hesap/actions";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/#kategoriler", label: "Kategoriler" },
  { href: "/rehber", label: "Yardım Merkezi" },
  { href: "/iletisim", label: "İletişim" },
];

function readDisplayName(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)ga_user=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function CartButton({ onClick }: { onClick: () => void }) {
  const { totalCount } = useCart();
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-colors hover:bg-cyan-400/10"
      aria-label="Sepeti aç"
    >
      🛒
      {totalCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-1 text-[11px] font-bold text-slate-950">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setUserName(readDisplayName());
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "glass-strong" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo-mark.png"
            alt="Gri Akvaryum logosu"
            width={48}
            height={28}
            className="h-7 w-auto"
            priority
          />
          <span className="font-display text-lg font-bold tracking-tight">
            Gri<span className="text-gradient">Akvaryum</span>
          </span>
        </Link>

        {/* Masaüstü menü */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Üyelik - masaüstü */}
          <div className="hidden items-center gap-1.5 md:flex">
            {userName ? (
              <>
                <span className="max-w-[9rem] truncate px-1 text-sm text-muted">
                  Merhaba,{" "}
                  <strong className="text-foreground">{userName}</strong>
                </span>
                <form action={logoutAction}>
                  <button className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground">
                    Çıkış
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Büyüteç - sepetin hemen solunda */}
          <SiteSearch />

          <CartButton
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
          />

          {/* Mobil menü düğmesi */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={menuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="glass-strong border-t border-cyan-400/10 px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-4 py-3 text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {userName ? (
              <>
                <span className="px-4 text-sm text-muted">
                  Merhaba,{" "}
                  <strong className="text-foreground">{userName}</strong>
                </span>
                <form action={logoutAction}>
                  <button className="glass w-full rounded-xl px-5 py-3 text-center font-semibold">
                    Çıkış Yap
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="glass rounded-xl px-5 py-3 text-center font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-xl border border-cyan-400/30 px-5 py-3 text-center font-semibold text-cyan-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
            <button
              className="mt-1 block w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3 text-center font-semibold text-slate-950"
              onClick={() => {
                setMenuOpen(false);
                setCartOpen(true);
              }}
            >
              🛒 Sepetim
            </button>
          </div>
        </div>
      )}

      {/* Sağdan açılan sepet çekmecesi */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
