"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkOrderPaymentAction, retryOrderPaymentAction } from "../actions";

export default function PaymentActions({ id, access, canPay }: { id: string; access?: string; canPay: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  function run(retry: boolean) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await (retry ? retryOrderPaymentAction(id, access) : checkOrderPaymentAction(id, access));
        if (result.error) { setMessage(result.error); return; }
        if (result.paymentPageUrl) { window.location.assign(result.paymentPageUrl); return; }
        if (result.resultUrl) router.replace(result.resultUrl);
        router.refresh();
        setMessage("Sipariş durumu güncellendi.");
      } catch { setMessage("Bağlantı kurulamadı. Yeniden ödeme yapmadan durumunuzu tekrar kontrol edin."); }
    });
  }
  return <div className="receipt-actions">
    {canPay && <button className="store-button" disabled={pending} onClick={() => run(true)}>Güvenli ödemeye devam et</button>}
    <button className="receipt-secondary" disabled={pending} onClick={() => run(false)}>{pending ? "Kontrol ediliyor…" : "Sipariş durumunu güncelle"}</button>
    {message && <p role="status" className="receipt-feedback">{message}</p>}
  </div>;
}
