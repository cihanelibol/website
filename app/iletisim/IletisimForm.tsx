"use client";

import AppIcon from "@/components/AppIcon";
import { useActionState, useEffect, useRef } from "react";
import { contactAction, type ContactState } from "./actions";

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function IletisimForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    contactAction,
    {}
  );

  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.success) successRef.current?.focus(); }, [state.success]);

  if (state.success) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="text-5xl"><AppIcon name="mail" /></span>
        <h3 className="font-display text-xl font-semibold">
          Mesajınız bize ulaştı!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          En kısa sürede size geri döneceğiz. Acil konular için bizi telefonla
          arayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Ad Soyad *
          </label>
          <input
            id="name"
            autoComplete="name"
            name="name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            autoComplete="tel"
            name="phone"
            type="tel"
            placeholder="05xx xxx xx xx"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          E-posta
        </label>
        <input
          id="email"
          autoComplete="email"
          name="email"
          type="email"
          placeholder="ornek@eposta.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Konu
        </label>
        <select id="subject" name="subject" className={inputClass} defaultValue="">
          <option value="" disabled>
            Bir konu seçin
          </option>
          <option value="akvaryum-kurulumu">Akvaryum kurulumu</option>
          <option value="balik-secimi">Balık seçimi</option>
          <option value="su-degerleri">Su değerleri &amp; bakım</option>
          <option value="urun-siparis">Ürün / sipariş</option>
          <option value="diger">Diğer</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Mesajınız *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          placeholder="Sorunuzu veya talebinizi yazın..."
          className={`${inputClass} resize-y`}
        />
      </div>

      {state.error && <p role="alert" className="text-sm text-amber-400"><AppIcon name="warning" /> {state.error}</p>}

      <button
        disabled={pending}
        className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}
