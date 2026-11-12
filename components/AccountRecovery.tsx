"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { recoveryAction, tokenAction, type AuthState } from "@/app/hesap/actions";

export default function AccountRecovery({ consume = false }: { consume?: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(consume ? tokenAction : recoveryAction, {});
  const [link, setLink] = useState({ purpose: "", token: "" });
  useEffect(() => {
    if (!consume) return;
    const frame = requestAnimationFrame(() => {
      const [purpose, token] = window.location.hash.slice(1).split(":");
      setLink({ purpose: purpose ?? "", token: token ?? "" });
      window.history.replaceState(null, "", window.location.pathname);
    });
    return () => cancelAnimationFrame(frame);
  }, [consume]);
  return <form action={action} className="mx-auto mt-24 max-w-md space-y-4 rounded-2xl border border-cyan-400/20 p-6">
    <h1 className="text-2xl font-bold">{consume ? "Hesap doğrulama" : "Parola yenileme"}</h1>
    {consume ? <>
      <input type="hidden" name="token" value={link.token} />
      <input type="hidden" name="purpose" value={link.purpose} />
      {link.purpose === "reset" && <label className="block">Yeni parola (15–128 karakter)<input className="mt-2 w-full rounded border p-3 text-black" name="password" type="password" autoComplete="new-password" minLength={15} maxLength={128} required /></label>}
    </> : <label className="block">E-posta<input className="mt-2 w-full rounded border p-3 text-black" name="email" type="email" maxLength={254} autoComplete="email" required /></label>}
    <p role="status">{state.error ?? state.message}</p>
    <button disabled={pending || (consume && (!link.token || state.ok))} className="store-button">{pending ? "İşleniyor..." : consume ? "Onayla" : "Yenileme bağlantısı gönder"}</button>
    <Link href="/giris" className="block text-cyan-300">Giriş sayfasına dön</Link>
  </form>;
}
