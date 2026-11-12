"use client";
import { useActionState } from "react";
import { reconcileAction } from "./actions";
export default function OperationsForm() {
  const [state, action, pending] = useActionState(reconcileAction, {});
  return <form action={action} className="glass space-y-4 rounded-xl p-5">
    <h2 className="text-xl font-semibold">Sipariş uzlaştırma ve tahsilat</h2>
    <p>Önce EasyTrade veya banka kaydını kontrol edin. Bu işlem para çekmez ve yeni sipariş göndermez. Son 5 dakika içinde MFA doğrulaması gerekir.</p>
    <label className="block">İşlem<select name="kind" className="block w-full rounded border p-3"><option value="submission">EasyTrade siparişini doğrula</option><option value="payment">Manuel tahsilatı kaydet</option></select></label>
    <label className="block">Mağaza sipariş numarası<input name="id" required maxLength={40} className="block w-full rounded border p-3" /></label>
    <label className="block">Tahsil edilen tutar (TL, yalnız tahsilat için)<input name="total" type="number" min="0.01" step="0.01" className="block w-full rounded border p-3" /></label>
    <label className="block">Harici sipariş / banka işlem numarası<input name="reference" required minLength={3} maxLength={120} className="block w-full rounded border p-3" /></label>
    <label className="block">Kontrol gerekçesi<textarea name="note" required minLength={10} maxLength={500} className="block w-full rounded border p-3" /></label>
    <label className="flex gap-2"><input name="confirmed" type="checkbox" required />Harici kaydı ve sipariş eşleşmesini kontrol ettim.</label>
    {state.error && <p role="alert">{state.error}</p>}{state.ok && <p role="status">Kayıt güncellendi.</p>}
    <button className="store-button" disabled={pending}>{pending ? "Kaydediliyor…" : "Doğrulanmış kaydı işle"}</button>
  </form>;
}
