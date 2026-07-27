"use client";

// 3 adımlı sipariş akışı: Sepet → Teslimat → Ödeme (iyzico).
// iyzico API bilgileri bağlanana kadar ödeme adımı "hazırlık modu"nda çalışır.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Address } from "@/lib/addresses";
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

type Step = "sepet" | "teslimat" | "odeme";

const STEPS: { key: Step; label: string }[] = [
  { key: "sepet", label: "Sepet" },
  { key: "teslimat", label: "Teslimat" },
  { key: "odeme", label: "Ödeme" },
];

export default function SepetClient({
  addresses = [],
  profile,
  paymentReady = false,
}: {
  addresses?: Address[];
  profile?: { name: string; email: string; phone: string };
  paymentReady?: boolean;
}) {
  const { items, setQty, remove, clear, totalCount, totalAmount } = useCart();
  const [step, setStep] = useState<Step>("sepet");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    customer_name: profile?.name ?? "",
    customer_email: profile?.email ?? "",
    customer_phone: profile?.phone ?? "",
    address: "",
    city: "",
    district: "",
    postal_code: "",
    notes: "",
  });
  const [selectedAddress, setSelectedAddress] = useState<string>(
    addresses.length > 0 ? addresses[0].id : "yeni"
  );
  const [legalAccepted, setLegalAccepted] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Kayıtlı adres seçilince form alanlarına uygula
  const applyAddress = (id: string) => {
    setSelectedAddress(id);
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setForm((f) => ({
        ...f,
        customer_name: addr.fullName,
        customer_phone: addr.phone,
        address: addr.address,
        city: addr.city,
        district: addr.district,
        postal_code: addr.postalCode,
      }));
    }
  };

  const teslimatValid =
    form.customer_name.trim().length > 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim()) &&
    form.customer_phone.trim().length >= 10 &&
    form.address.trim().length >= 10 &&
    form.city.trim().length > 1;

  const goToTeslimat = () => {
    if (addresses.length > 0 && selectedAddress !== "yeni") {
      applyAddress(selectedAddress);
    }
    setStep("teslimat");
  };

  const goToOdeme = () => {
    if (!teslimatValid) {
      setError("Lütfen teslimat bilgilerini eksiksiz doldurun.");
      return;
    }
    setError(null);
    setStep("odeme");
  };

  const onPay = async () => {
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
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
    });
    setPending(false);
    if ("paymentPageUrl" in result && result.paymentPageUrl) {
      // iyzico ödeme sayfasına yönlendir
      window.location.href = result.paymentPageUrl;
      return;
    }
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
        <h2 className="font-display text-2xl font-bold">Siparişiniz Alındı!</h2>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Siparişiniz mağazamıza iletildi. En kısa sürede sizinle iletişime
          geçeceğiz. Teşekkür ederiz!
        </p>
        <div className="flex gap-3">
          <Link
            href="/urunler"
            className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
          >
            Alışverişe Devam Et
          </Link>
          {profile && (
            <Link
              href="/hesap/siparisler"
              className="glass mt-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors hover:border-cyan-400/40"
            >
              Siparişlerim
            </Link>
          )}
        </div>
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

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start">
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

      {/* Sağ panel: adımlı sipariş akışı */}
      <div className="glass rounded-3xl p-6 lg:sticky lg:top-24">
        {/* Adım göstergesi */}
        <div className="mb-6 flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center gap-1">
              <button
                onClick={() => i < stepIndex && setStep(s.key)}
                disabled={i > stepIndex}
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  i === stepIndex
                    ? "text-cyan-200"
                    : i < stepIndex
                      ? "cursor-pointer text-teal-400"
                      : "text-muted opacity-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    i === stepIndex
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
                      : i < stepIndex
                        ? "bg-teal-500/25 text-teal-300"
                        : "bg-cyan-400/10"
                  }`}
                >
                  {i < stepIndex ? "✓" : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i < stepIndex ? "bg-teal-400/50" : "bg-cyan-400/15"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ADIM 1 — Sepet özeti */}
        {step === "sepet" && (
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
              onClick={goToTeslimat}
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
            >
              Siparişi Tamamla →
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Üyelik gerekmez — misafir olarak sipariş verebilirsiniz.
            </p>
          </>
        )}

        {/* ADIM 2 — Teslimat */}
        {step === "teslimat" && (
          <div className="space-y-3">
            <h2 className="font-display font-bold">Teslimat Bilgileri</h2>

            {/* Kayıtlı adresler */}
            {addresses.length > 0 && (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm transition-colors ${
                      selectedAddress === addr.id
                        ? "border-cyan-400/50 bg-cyan-400/10"
                        : "border-cyan-400/15 hover:border-cyan-400/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="adres"
                      checked={selectedAddress === addr.id}
                      onChange={() => applyAddress(addr.id)}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span>
                      <strong className="text-cyan-200">{addr.title}</strong>{" "}
                      — {addr.fullName}
                      <span className="mt-0.5 block text-xs text-muted">
                        {addr.address}, {addr.district && `${addr.district}, `}
                        {addr.city}
                      </span>
                    </span>
                  </label>
                ))}
                <label
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-sm transition-colors ${
                    selectedAddress === "yeni"
                      ? "border-cyan-400/50 bg-cyan-400/10"
                      : "border-cyan-400/15 hover:border-cyan-400/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="adres"
                    checked={selectedAddress === "yeni"}
                    onChange={() => setSelectedAddress("yeni")}
                    className="accent-cyan-400"
                  />
                  Farklı bir adres gireceğim
                </label>
              </div>
            )}

            {(addresses.length === 0 || selectedAddress === "yeni") && (
              <>
                <input
                  required
                  placeholder="Ad Soyad *"
                  value={form.customer_name}
                  onChange={(e) => set("customer_name")(e.target.value)}
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
              </>
            )}

            <input
              required
              type="email"
              placeholder="E-posta *"
              value={form.customer_email}
              onChange={(e) => set("customer_email")(e.target.value)}
              className={inputClass}
            />
            <textarea
              rows={2}
              placeholder="Sipariş notu (isteğe bağlı)"
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              className={inputClass}
            />

            {error && <p className="text-sm text-red-400">⚠ {error}</p>}

            <button
              onClick={goToOdeme}
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
            >
              Ödemeye Geç →
            </button>
          </div>
        )}

        {/* ADIM 3 — Ödeme (iyzico) */}
        {step === "odeme" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold">Ödeme</h2>

            {/* Sipariş özeti */}
            <div className="space-y-1.5 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Ürünler ({totalCount} adet)</span>
                <span>{formatTL(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Teslimat</span>
                <span className="max-w-[12rem] truncate text-right">
                  {form.city || "—"}
                </span>
              </div>
              <div className="flex justify-between border-t border-cyan-400/10 pt-2 font-display font-bold">
                <span>Toplam</span>
                <span className="text-gradient">{formatTL(totalAmount)}</span>
              </div>
            </div>

            {/* iyzico güvenli ödeme kutusu */}
            <div className="rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="text-sm font-bold">
                    Kredi / Banka Kartı ile Ödeme
                  </div>
                  <div className="text-xs text-muted">
                    <span className="font-semibold text-cyan-300">iyzico</span>{" "}
                    güvencesiyle 256-bit SSL korumalı ödeme
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
                <span>🔒 Kart bilgileriniz sitemizde saklanmaz,</span>
                <span>iyzico güvenli ödeme sayfasında işlenir.</span>
              </div>
              {!paymentReady && (
                <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-300">
                  ⚠ Online ödeme çok yakında aktif olacak. Şimdilik siparişiniz
                  ödemesiz iletilir; mağazamız ödeme için sizinle iletişime
                  geçer.
                </div>
              )}
            </div>

            {/* Zorunlu sözleşme onayı */}
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted">
              <input
                type="checkbox"
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

            {error && <p className="text-sm text-red-400">⚠ {error}</p>}

            <button
              onClick={onPay}
              disabled={pending || !legalAccepted}
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {pending
                ? "İşleniyor..."
                : paymentReady
                  ? `🔒 ${formatTL(totalAmount)} Öde`
                  : "🛍 Siparişi Onayla"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
