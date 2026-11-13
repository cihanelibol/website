"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { recoveryAction, tokenAction, type AuthState } from "@/app/hesap/actions";

const inputClass = "mt-1.5 w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-3 text-sm outline-none placeholder:text-muted focus:border-cyan-400/50";

export default function AccountRecovery({ consume = false }: { consume?: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(consume ? tokenAction : recoveryAction, {});
  const [link, setLink] = useState({ purpose: "", token: "" });
  useEffect(() => {
    if (!consume) return;
    const frame = requestAnimationFrame(() => {
      const [purpose, token] = window.location.hash.slice(1).split(":");
      setLink({ purpose: purpose ?? "", token: token ?? "" });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    });
    return () => cancelAnimationFrame(frame);
  }, [consume]);
  return <form action={action} className="space-y-4">
    {consume ? <>
      <input type="hidden" name="token" value={link.token} />
      <input type="hidden" name="purpose" value={link.purpose} />
      {link.purpose === "reset" && <label className="block text-[13px] font-semibold text-muted">Yeni parola (15–128 karakter)<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={15} maxLength={128} required /></label>}
    </> : <label className="block text-[13px] font-semibold text-muted">E-posta<input className={inputClass} name="email" type="email" placeholder="ornek@eposta.com" maxLength={254} autoComplete="email" required /></label>}
    <p role="status" className="text-sm text-muted">{state.error ?? state.message}</p>
    <button disabled={pending || (consume && (!link.token || state.ok))} className="store-button w-full disabled:opacity-50">{pending ? "İşleniyor..." : consume ? "Onayla" : "Yenileme bağlantısı gönder"}</button>
    <Link href="/giris" className="block py-2 text-center text-sm font-semibold text-cyan-300 underline underline-offset-2">Giriş sayfasına dön</Link>
  </form>;
}
