"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { beginMfaAction, mfaAction, type AuthState } from "../actions";
export default function MfaForm({ enabled }: { enabled: boolean }) {
  const [setup, setSetup] = useState<AuthState>({});
  const [state, action, pending] = useActionState<AuthState, FormData>(mfaAction, {});
  return <div className="max-w-lg space-y-4 rounded-2xl border p-5">
    <h2 className="text-lg font-bold">Yönetici doğrulaması</h2>
    {!enabled && !state.ok && <>
      <p>Doğrulayıcı uygulamanıza yeni hesap ekleyin. Kurulum anahtarını kimseyle paylaşmayın.</p>
      <button className="rounded border px-4 py-2" onClick={async () => setSetup(await beginMfaAction())}>Kurulum anahtarı oluştur</button>
      {setup.secret && <p className="break-all font-mono" aria-label="Kurulum anahtarı">{setup.secret}</p>}
      {setup.error && <p role="alert">{setup.error}</p>}
    </>}
    <form action={action} className="space-y-3">
      <label className="block">Doğrulama veya kurtarma kodu<input name="code" autoComplete="one-time-code" minLength={6} maxLength={24} required className="mt-2 w-full rounded border p-3 text-black" /></label>
      <button disabled={pending} className="rounded bg-cyan-400 px-4 py-2 text-black">Doğrula</button>
      <p role="status">{state.error ?? (state.ok ? "Doğrulandı." : "")}</p>
    </form>
    {state.recovery && <div><p>Bu kurtarma kodları yalnızca bir kez gösterilir. Güvenli bir yerde saklayın; her kod tek kullanımlıktır.</p><pre className="mt-3 whitespace-pre-wrap">{state.recovery.join("\n")}</pre></div>}
    {state.ok && <Link className="block text-cyan-300" href="/admin">Yönetim paneline git</Link>}
  </div>;
}
