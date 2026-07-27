"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { submitOrderAction } from "./actions";

function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

export default function SepetClient() {
  const { items, setQty, remove, clear, totalCount, totalAmount } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    city: "",
    district: "",
    postal_code: "",
    notes: "",
  });
  const [legalAccepted, setLegalAccepted] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalAccepted) {
      setError(
        "Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylanmadan sipariş verilemez."
      );
      return;
    }
    setPending(true);
    setError(null);
    const result = await submitOrderAction({
      ...form,
      legalAccepted,
      items: items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
    });
    setPending(false);
    if (result.ok) {
      clear();
      setDone(true);
    } else {
      setError(result.error ?? "Bir sorun oluştu.");
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
        <span className="text-6xl">🎉</span>
        <h2 className="font-display text-2xl font-bold">
          Siparişiniz Alındı!
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Siparişiniz mağazamıza iletildi. En kısa sürede sizinle iletişime
          geçeceğiz. Teşekkür ederiz!
        </p>
        <Link
          href="/urunler"
          className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display text-2xl font-bold">Sepetiniz Boş</h2>
        <p className="max-w-sm text-sm text-muted">
          Sepetinize henüz ürün eklemediniz. Binlerce ürün sizi bekliyor!
        </p>
        <Link
          href="/urunler"
          className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
        >
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-start">
      {/* Sepet kalemleri */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="glass flex items-center gap-4 rounded-2xl p-4">
            <Link
              href={`/urunler/${item.id}`}
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <span className="text-3xl">{item.emoji}</span>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/urunler/${item.id}`}
                className="line-clamp-2 text-sm font-semibold leading-snug hover:text-cyan-200"
              >
                {item.name}
              </Link>
              <div className="mt-1 text-xs text-muted">
                {formatTL(item.price)} / {item.unit}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="glass flex items-center rounded-xl">
                <button
                  onClick={() => setQty(item.id, item.qty - 1)}
                  className="px-3 py-2 font-bold text-cyan-300 hover:text-cyan-100"
                  aria-label="Azalt"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">
                  {item.qty}
                </span>
                <button
                  onClick={() => setQty(item.id, item.qty + 1)}
                  className="px-3 py-2 font-bold text-cyan-300 hover:text-cyan-100"
                  aria-label="Artır"
                >
                  +
                </button>
              </div>
              <div className="hidden min-w-[6rem] text-right font-display font-bold text-gradient sm:block">
                {formatTL(item.price * item.qty)}
              </div>
              <button
                onClick={() => remove(item.id)}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-red-400/10 hover:text-red-300"
                aria-label="Sepetten çıkar"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Özet + sipariş formu */}
      <div className="glass rounded-3xl p-6 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-bold">
            {checkout ? "Teslimat Bilgileri" : "Sipariş Özeti"}
          </h2>
          {checkout && (
            <button
              onClick={() => setCheckout(false)}
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              ← Sepete Dön
            </button>
          )}
        </div>

        {!checkout ? (
          <>
            <div className="space-y-2 border-b border-cyan-400/10 pb-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Ürünler ({totalCount} adet)</span>
                <span>{formatTL(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Kargo</span>
                <span>Sipariş sonrası bilgilendirilir</span>
              </div>
            </div>
            <div className="flex justify-between py-4 font-display text-lg font-bold">
              <span>Toplam</span>
              <span className="text-gradient">{formatTL(totalAmount)}</span>
            </div>
            <button
              onClick={() => setCheckout(true)}
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
            >
              Siparişi Tamamla
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Üyelik gerekmez - misafir olarak sipariş verebilirsiniz.
            </p>
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              required
              placeholder="Ad Soyad *"
              value={form.customer_name}
              onChange={(e) => set("customer_name")(e.target.value)}
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="E-posta *"
              value={form.customer_email}
              onChange={(e) => set("customer_email")(e.target.value)}
              className={inputClass}
            />
            <input
              required
              type="tel"
              placeholder="Telefon *"
              value={form.customer_phone}
              onChange={(e) => set("customer_phone")(e.target.value)}
              className={inputClass}
            />
            <textarea
              required
              rows={2}
              placeholder="Teslimat adresi *"
              value={form.address}
              onChange={(e) => set("address")(e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Şehir *"
                value={form.city}
                onChange={(e) => set("city")(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="İlçe"
                value={form.district}
                onChange={(e) => set("district")(e.target.value)}
                className={inputClass}
              />
            </div>
            <input
              placeholder="Posta kodu"
              value={form.postal_code}
              onChange={(e) => set("postal_code")(e.target.value)}
              className={inputClass}
            />
            <textarea
              rows={2}
              placeholder="Sipariş notu (isteğe bağlı)"
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              className={inputClass}
            />

            {/* Zorunlu sözleşme onayı */}
            <label className="flex cursor-pointer items-start gap-2.5 border-t border-cyan-400/10 pt-3 text-xs leading-relaxed text-muted">
              <input
                type="checkbox"
                required
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400"
              />
              <span>
                <Link
                  href="/sozlesme/on-bilgilendirme"
                  target="_blank"
                  className="font-semibold text-cyan-300 underline-offset-2 hover:underline"
                >
                  Ön Bilgilendirme Formu
                </Link>
                &apos;nu ve{" "}
                <Link
                  href="/sozlesme/mesafeli-satis"
                  target="_blank"
                  className="font-semibold text-cyan-300 underline-offset-2 hover:underline"
                >
                  Mesafeli Satış Sözleşmesi
                </Link>
                &apos;ni okudum, onaylıyorum.{" "}
                <span className="text-amber-400">*</span>
              </span>
            </label>

            {error && <p className="text-sm text-amber-400">⚠ {error}</p>}

            <div className="flex justify-between border-t border-cyan-400/10 pt-3 font-display font-bold">
              <span>Toplam</span>
              <span className="text-gradient">{formatTL(totalAmount)}</span>
            </div>

            <button
              disabled={pending || !legalAccepted}
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {pending ? "Gönderiliyor..." : "🛍 Siparişi Onayla"}
            </button>
            <p className="text-center text-xs text-muted">
              Ödeme mağazamız sizinle iletişime geçtikten sonra yapılır.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
