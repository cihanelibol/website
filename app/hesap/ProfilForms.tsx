"use client";

import { useActionState } from "react";
import {
  changePasswordAction,
  updateProfileAction,
  type AuthState,
} from "./actions";

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

function Feedback({ state }: { state: AuthState }) {
  if (state.error)
    return <p className="text-sm text-red-400">⚠ {state.error}</p>;
  if (state.ok)
    return <p className="text-sm text-teal-400">✓ Kaydedildi.</p>;
  return null;
}

export function ProfilForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateProfileAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Ad Soyad
          </label>
          <input name="name" defaultValue={name} required className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Cep Telefonu
          </label>
          <input
            name="phone"
            type="tel"
            defaultValue={phone}
            required
            placeholder="05XX XXX XX XX"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          E-posta (değiştirilemez)
        </label>
        <input
          value={email}
          disabled
          className={`${inputClass} cursor-not-allowed opacity-60`}
        />
      </div>
      <Feedback state={state} />
      <button
        disabled={pending}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 disabled:opacity-50"
      >
        {pending ? "Kaydediliyor..." : "Bilgileri Güncelle"}
      </button>
    </form>
  );
}

export function ParolaForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    changePasswordAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Mevcut Parola
          </label>
          <input
            name="current"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Yeni Parola
          </label>
          <input
            name="next"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="En az 6 karakter"
            className={inputClass}
          />
        </div>
      </div>
      <Feedback state={state} />
      <button
        disabled={pending}
        className="glass rounded-xl px-6 py-3 text-sm font-semibold transition-colors hover:border-cyan-400/40"
      >
        {pending ? "Güncelleniyor..." : "Parolayı Değiştir"}
      </button>
    </form>
  );
}
