import { NextResponse } from "next/server";
import { retrieveIyzicoCheckout } from "@/lib/payments";
import { settleIyzicoPayment } from "@/lib/orders";
import { forwardOrder } from "@/lib/order-forward";
import { audit } from "@/lib/security";
import { SITE_URL } from "@/lib/site";

// iyzico, ödeme sayfası bitince müşterinin tarayıcısıyla buraya form POST eder (yalnız `token`).
// Token iyzico'ya sunucudan yeniden sorulur; sonuç, sakladığımız token/tutar/sepet ile eşleşmeli.
export const dynamic = "force-dynamic";

function back(params: Record<string, string>) {
  const origin = (process.env.APP_ORIGIN || SITE_URL).replace(/\/+$/, "");
  return NextResponse.redirect(`${origin}/sepet/sonuc?${new URLSearchParams(params)}`, 303);
}

export async function POST(request: Request) {
  let token = "";
  try {
    const form = await request.formData();
    token = String(form.get("token") ?? "");
  } catch { /* boş gövde */ }
  if (!/^[A-Za-z0-9-]{10,100}$/.test(token)) return back({ durum: "hata" });

  try {
    const verified = await retrieveIyzicoCheckout(token);
    const outcome = await settleIyzicoPayment(token, verified);
    if (!outcome) {
      await audit("payment.unknown_token", undefined, token.slice(0, 12), "error");
      return back({ durum: "hata" });
    }
    if (outcome.result === "already-paid") return back({ durum: "tamam", siparis: outcome.orderId });
    if (outcome.result === "failed") {
      await audit("payment.failed", undefined, outcome.orderId);
      return back({ durum: "basarisiz", siparis: outcome.orderId });
    }
    if (outcome.result === "mismatch") {
      await audit("payment.mismatch", undefined, outcome.orderId, "error");
      return back({ durum: "kontrol", siparis: outcome.orderId });
    }
    await audit("payment.captured", undefined, outcome.orderId);
    // Ödeme alındı; şimdi siparişi EasyTrade'e ilet. Başarısızsa panelde "Kontrol bekliyor" görünür.
    if (outcome.payload) await forwardOrder(outcome.orderId, outcome.payload);
    return back({ durum: "tamam", siparis: outcome.orderId });
  } catch {
    await audit("payment.callback_error", undefined, token.slice(0, 12), "error");
    return back({ durum: "kontrol" });
  }
}

export function GET() {
  return back({ durum: "hata" });
}
