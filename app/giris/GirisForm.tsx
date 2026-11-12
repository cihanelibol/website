"use client";

import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { CONTACT } from "@/lib/site";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/hesap/actions";

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

export default function GirisForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          E-posta
        </label>
        <input
          id="login-email"
          autoComplete="email"
          name="email"
          type="email"
          required
          placeholder="ornek@eposta.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Parola
        </label>
        <input
          id="login-password"
          autoComplete="current-password"
          name="password"
          type="password"
          maxLength={128}
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <Link href="/parola-yenile" className="inline-block py-2 text-sm text-cyan-300 underline underline-offset-2">Parolamı unuttum / hesabımı doğrula</Link>
      {state.error && <p role="alert" className="text-sm text-amber-400"><AppIcon name="warning" /> {state.error}</p>}

      <button
        disabled={pending}
        className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      <details className="store-account-help">
        <summary>Hesabınıza erişmek için destek alın</summary>
        <p>Hesabınıza erişemiyorsanız mağazamızdan hesap desteği alın. Parolanızı veya doğrulama kodunuzu paylaşmayın.</p>
        <a href={`${CONTACT.whatsappHref}?text=${encodeURIComponent("Hesabıma giriş yapamıyorum. Hesap desteği almak istiyorum.")}`} target="_blank" rel="noopener noreferrer">WhatsApp ile hesap desteği</a>
        <a href={CONTACT.phoneHref}>Mağazayı arayın: {CONTACT.phone}</a>
      </details>
      <p className="text-center text-sm text-muted">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Kayıt Olun
        </Link>
      </p>
    </form>
  );
}
