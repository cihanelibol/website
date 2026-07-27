"use client";

// Sağdan içeri kayarak açılan sepet çekmecesi.
// Her zaman DOM'da durur; açılış/kapanış CSS transform geçişiyle yapılır.

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/easytrade";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, setQty, remove, totalCount, totalAmount } = useCart();

  // Açıkken Esc ile kapat + arka plan kaydırmasını kilitle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Karartılmış arka plan */}
      <div
        className={`absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Çekmece paneli */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sepetim"
        className={`glass-strong absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-cyan-400/20 shadow-2xl shadow-cyan-500/10 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-cyan-400/15 px-5 py-4">
          <h2 className="font-display text-lg font-bold">
            🛒 Sepetim
            {totalCount > 0 && (
              <span className="ml-2 rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                {totalCount} ürün
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground"
            aria-label="Sepeti kapat"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        {/* İçerik */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-6xl" aria-hidden>
              🛒
            </span>
            <div className="font-display text-lg font-bold">Sepetiniz Boş</div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Sepetinize henüz ürün eklemediniz. Binlerce ürün sizi bekliyor!
            </p>
            <Link
              href="/urunler"
              onClick={onClose}
              className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <>
            {/* Ürün listesi */}
            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass flex gap-3 rounded-2xl p-3"
                >
                  <Link
                    href={`/urunler/${item.id}`}
                    onClick={onClose}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden>
                        {item.emoji}
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/urunler/${item.id}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-medium leading-snug hover:text-cyan-200"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="glass flex items-center rounded-lg">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="px-2.5 py-1 text-sm font-bold text-cyan-300 hover:text-cyan-100"
                          aria-label="Azalt"
                        >
                          −
                        </button>
                        <span className="min-w-[1.75rem] text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="px-2.5 py-1 text-sm font-bold text-cyan-300 hover:text-cyan-100"
                          aria-label="Artır"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold text-gradient">
                        {formatPrice(item.price * item.qty)}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-400/10 hover:text-red-300"
                        aria-label="Sepetten çıkar"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alt özet */}
            <div className="border-t border-cyan-400/15 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Toplam</span>
                <span className="font-display text-xl font-bold text-gradient">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <Link
                href="/sepet"
                onClick={onClose}
                className="glow block w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 text-center font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
              >
                Siparişi Tamamla
              </Link>
              <button
                onClick={onClose}
                className="mt-2.5 w-full rounded-2xl px-6 py-2.5 text-center text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
