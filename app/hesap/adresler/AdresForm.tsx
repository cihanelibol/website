"use client";

import AppIcon from "@/components/AppIcon";
import { useActionState, useEffect, useRef } from "react";
import { addAddressAction, type AuthState } from "../actions";

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

export default function AdresForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    addAddressAction,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Başarıyla eklenince formu temizle
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" placeholder="Adres başlığı (Ev, İş...)" className={inputClass} />
        <input name="fullName" required placeholder="Ad Soyad *" className={inputClass} />
      </div>
      <input
        name="phone"
        type="tel"
        required
        placeholder="Cep telefonu * (05XX XXX XX XX)"
        className={inputClass}
      />
      <textarea
        name="address"
        required
        rows={2}
        placeholder="Açık adres * (mahalle, sokak, no, daire)"
        className={inputClass}
      />
      <div className="grid grid-cols-3 gap-3">
        <input name="city" required placeholder="Şehir *" className={inputClass} />
        <input name="district" placeholder="İlçe" className={inputClass} />
        <input name="postalCode" placeholder="Posta kodu" className={inputClass} />
      </div>

      {state.error && <p className="text-sm text-red-400"><AppIcon name="warning" /> {state.error}</p>}
      {state.ok && <p className="text-sm text-teal-400"><AppIcon name="check" /> Adres eklendi.</p>}

      <button
        disabled={pending}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 disabled:opacity-50"
      >
        {pending ? "Ekleniyor..." : "+ Adresi Kaydet"}
      </button>
    </form>
  );
}
