"use client";

import AppIcon from "@/components/AppIcon";
import Image from "next/image";
import { containDialogFocus } from "@/components/dialog-focus";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/product-display";
import type {
  SearchArticleHit,
  SearchProductHit,
  SearchResponse,
} from "@/app/api/arama/route";

const EMPTY: SearchResponse = { products: [], articles: [], productTotal: 0 };

// Sorgu boşken gösterilen hızlı bağlantılar
const quickLinks = [
  {
    icon: "tank",
    label: "İlk Akvaryum Kurulumu",
    href: "/rehber/ilk-akvaryum-kurulumu",
  },
  { icon: "flask", label: "Beyaz Benek Tedavisi", href: "/rehber/beyaz-benek" },
  {
    icon: "leaf",
    label: "Haftalık Bakım Rutini",
    href: "/rehber/haftalik-bakim-rutini",
  },
  { icon: "cart", label: "Tüm Ürünler", href: "/urunler" },
];

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

// Arama pop-up'ını bileşen dışından (ör. Hero'daki uzun arama barından) açmak için.
// Modal tek bir yerde (Navbar içindeki SiteSearch) yaşar; tetikleyiciler bu fonksiyonu çağırır.
let openFn: (() => void) | null = null;

export function openSiteSearch() {
  openFn?.();
}

export default function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cacheRef = useRef(new Map<string, SearchResponse>());

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    setActiveIndex(-1);
    setLoading(false);
    setSearchError(false);
  }, []);

  // Dış tetikleyicilerin (Hero arama barı) modalı açabilmesi için kaydol
  useEffect(() => {
    openFn = () => setOpen(true);
    return () => {
      openFn = null;
    };
  }, []);

  // Ctrl/Cmd+K ile aç, Esc ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Açıkken arka planın kaymasını engelle, inputa odaklan
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(t);
    };
  }, [open]);

  // Yazdıkça ara (250 ms bekleme + istek iptali + küçük önbellek)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || cacheRef.current.has(q)) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/arama?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data: SearchResponse = await res.json();
        cacheRef.current.set(q, data);
        setResults(data);
        setActiveIndex(-1);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setResults(EMPTY);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query, retry]);

  const updateQuery = (value: string) => {
    setQuery(value);
    const cached = cacheRef.current.get(value.trim());
    setResults(cached ?? EMPTY);
    setLoading(value.trim().length >= 2 && !cached);
    setActiveIndex(-1);
    setSearchError(false);
  };

  // Klavye gezinmesi için birleşik sonuç listesi
  const items = useMemo(() => {
    const productItems = results.products.map((p) => ({
      key: `p-${p.id}`,
      href: `/urunler/${p.id}`,
    }));
    const articleItems = results.articles.map((a) => ({
      key: `a-${a.slug}`,
      href: `/rehber/${a.slug}`,
    }));
    return [...productItems, ...articleItems];
  }, [results]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const focusResult = (index: number) => {
    const next = Math.min(Math.max(index, -1), items.length - 1);
    setActiveIndex(next);
    if (next < 0) inputRef.current?.focus();
    else dialogRef.current?.querySelector<HTMLButtonElement>(`[data-search-index="${next}"]`)?.focus();
  };
  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusResult(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusResult(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        go(items[activeIndex].href);
      } else if (query.trim().length >= 2) {
        go(`/urunler?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const q = query.trim();
  const hasQuery = q.length >= 2;
  const noResults =
    hasQuery &&
    !searchError &&
    !loading &&
    results.products.length === 0 &&
    results.articles.length === 0;

  return (
    <>
      {/* Navbar tetikleyicisi - sadece büyüteç ikonu */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-cyan-400/10"
        aria-label="Sitede ara (Ctrl+K)"
        title="Ara (Ctrl+K)"
      >
        <SearchIcon />
      </button>

      {/* Arama pop-up'ı */}
      {open &&
        createPortal(
          <dialog
            onKeyDown={(e) => {
              containDialogFocus(e);
              const index = (e.target as HTMLElement).dataset.searchIndex;
              if (index !== undefined && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                e.preventDefault();
                focusResult(Number(index) + (e.key === "ArrowDown" ? 1 : -1));
              }
            }}
            ref={dialogRef}
            onCancel={close}
            className="store-search-modal fixed inset-0 z-[70]"
            role="dialog"
            aria-modal="true"
            aria-label="Site araması"
          >
            {/* Blurlu arka plan */}
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
              onClick={close}
            />

            {/* Panel */}
            <div className="absolute left-1/2 top-[10vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 sm:top-[14vh]">
              <div className="glass-strong glow overflow-hidden rounded-3xl border border-cyan-400/25 shadow-2xl shadow-cyan-500/20">
                {/* Arama girişi */}
                <div className="flex items-center gap-3 border-b border-cyan-400/15 px-5 py-4">
                  <SearchIcon className="shrink-0 text-cyan-300" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder="Ürün, rehber veya konu arayın..."
                    aria-label="Ürün veya rehber arayın"
                    className="w-full bg-transparent text-base outline-none placeholder:text-muted"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {loading && (
                    <span
                      className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300"
                      aria-label="Aranıyor"
                    />
                  )}
                  <button
                    onClick={close}
                    className="shrink-0 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-xs font-semibold text-cyan-300"
                  >
                    ESC
                  </button>
                </div>

                {/* Sonuçlar */}
                <div className="max-h-[55vh] overflow-y-auto overscroll-contain p-3">
                  <p className="sr-only" role="status">
                    {loading ? "Aranıyor" : hasQuery && !searchError ? `${results.productTotal} ürün ve ${results.articles.length} rehber bulundu` : ""}
                  </p>
                  {searchError && (
                    <div className="store-search-error">
                      <p role="alert">Arama şu anda yüklenemiyor. Bağlantınızı kontrol edip yeniden deneyin.</p>
                      <button type="button" className="store-button" onClick={() => {
                        setSearchError(false);
                        setLoading(true);
                        setRetry((value) => value + 1);
                      }}>Tekrar dene</button>
                    </div>
                  )}
                  {/* Boş sorgu - hızlı bağlantılar */}
                  {!hasQuery && (
                    <div>
                      <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                        Popüler
                      </div>
                      {quickLinks.map((l) => (
                        <button
                          key={l.href}
                          onClick={() => go(l.href)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-cyan-400/10"
                        >
                          <span aria-hidden><AppIcon name={l.icon ?? "book"} /></span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {noResults && (
                    <p className="px-3 py-8 text-center text-sm text-muted">
                      &ldquo;{q}&rdquo; için sonuç bulunamadı. Farklı bir kelime
                      deneyin veya{" "}
                      <button
                        onClick={() => go("/rehber")}
                        className="font-medium text-cyan-300 hover:underline"
                      >
                        Yardım Merkezi&apos;ne
                      </button>{" "}
                      göz atın.
                    </p>
                  )}

                  {/* Ürün sonuçları */}
                  {results.products.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-3 pb-2 pt-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Ürünler
                        </span>
                        {results.productTotal > results.products.length && (
                          <button
                            onClick={() =>
                              go(`/urunler?q=${encodeURIComponent(q)}`)
                            }
                            className="text-xs font-medium text-cyan-300 hover:underline"
                          >
                            Tümünü gör ({results.productTotal}) →
                          </button>
                        )}
                      </div>
                      {results.products.map(
                        (p: SearchProductHit, i: number) => (
                          <button
                            key={p.id}
                            data-search-index={i}
                            onFocus={() => setActiveIndex(i)}
                            onClick={() => go(`/urunler/${p.id}`)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              activeIndex === i ? "bg-cyan-400/10" : ""
                            }`}
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/10">
                              {p.image ? (
                                <Image
                                  src={p.image}
                                  alt=""
                                  width={44}
                                  height={44}
                                  className="h-full w-full object-contain p-1"
                                  unoptimized
                                />
                              ) : (
                                <span className="text-xl" aria-hidden>
                                  <AppIcon name={p.icon ?? "book"} />
                                </span>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {p.name}
                              </span>
                              <span className="block text-xs text-muted">
                                {p.inStock ? "Stokta" : "Stokta yok"}
                                {p.sku ? ` · ${p.sku}` : ""}
                              </span>
                            </span>
                            <span className="shrink-0 text-sm font-bold text-accent">
                              {formatPrice(p.price)}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  )}

                  {/* İnce ayırıcı çizgi */}
                  {results.products.length > 0 &&
                    results.articles.length > 0 && (
                      <div className="mx-3 my-3 border-t border-cyan-400/15" />
                    )}

                  {/* Yardım Merkezi sonuçları */}
                  {results.articles.length > 0 && (
                    <div>
                      <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                        Yardım Merkezi
                      </div>
                      {results.articles.map(
                        (a: SearchArticleHit, i: number) => {
                          const idx = results.products.length + i;
                          return (
                            <button
                              key={a.slug}
                              data-search-index={idx}
                              onFocus={() => setActiveIndex(idx)}
                              onClick={() => go(`/rehber/${a.slug}`)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                activeIndex === idx ? "bg-cyan-400/10" : ""
                              }`}
                            >
                              <span
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/10 text-xl"
                                aria-hidden
                              >
                                <AppIcon name={a.icon ?? "book"} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">
                                  {a.title}
                                </span>
                                <span className="mt-0.5 block truncate text-xs text-muted">
                                  {a.description}
                                </span>
                              </span>
                              <span className="shrink-0 rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
                                {a.minutes} dk
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>

                {/* Alt bilgi */}
                <div className="hidden items-center gap-4 border-t border-cyan-400/15 px-5 py-2.5 text-xs text-muted sm:flex">
                  <span>
                    <kbd className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1 font-semibold">
                      ↑↓
                    </kbd>{" "}
                    gezin
                  </span>
                  <span>
                    <kbd className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1 font-semibold">
                      Enter
                    </kbd>{" "}
                    aç
                  </span>
                  <span>
                    <kbd className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1 font-semibold">
                      Esc
                    </kbd>{" "}
                    kapat
                  </span>
                </div>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
