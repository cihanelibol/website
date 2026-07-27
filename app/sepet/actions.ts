"use server";

import { postOrder, type OrderPayload } from "@/lib/easytrade";
import { getSessionUser } from "@/lib/auth";
import { addOrderRecord } from "@/lib/orders";
import { initiateIyzicoCheckout, paymentConfigured } from "@/lib/payments";
import {
  sendAdminNewOrderEmail,
  sendOrderReceivedEmail,
} from "@/lib/email";
import { addActivity } from "@/lib/activity";

export type OrderState = {
  ok?: boolean;
  error?: string;
  /** iyzico aktifleşince: müşterinin yönlendirileceği güvenli ödeme sayfası */
  paymentPageUrl?: string;
};

export type CheckoutInput = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
  notes: string;
  legalAccepted: boolean;
  items: { id: number; name: string; qty: number; price: number }[];
};

export async function submitOrderAction(
  input: CheckoutInput
): Promise<OrderState> {
  if (!input.customer_name.trim()) return { error: "Ad Soyad zorunludur." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customer_email.trim()))
    return { error: "Geçerli bir e-posta adresi girin." };
  if (!input.customer_phone.trim())
    return { error: "Telefon numarası zorunludur." };
  if (!input.address.trim()) return { error: "Teslimat adresi zorunludur." };
  if (!input.city.trim()) return { error: "Şehir zorunludur." };
  if (input.items.length === 0) return { error: "Sepetiniz boş." };
  if (!input.legalAccepted)
    return {
      error:
        "Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylanmadan sipariş verilemez.",
    };

  const session = await getSessionUser();
  const total = input.items.reduce((s, i) => s + i.price * i.qty, 0);
  const addressText = `${input.address.trim()}, ${
    input.district.trim() ? input.district.trim() + ", " : ""
  }${input.city.trim()} ${input.postal_code.trim()}`.trim();

  // İspat kaydı: onay bilgisi sipariş notuna eklenir (panelde görünür)
  const consentNote = `[Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} tarihinde elektronik ortamda onaylandı.]`;
  const paymentNote = paymentConfigured()
    ? "[Ödeme: iyzico - Kredi/Banka Kartı]"
    : "[Ödeme: iyzico entegrasyonu beklemede - mağaza müşteriyle ödeme için iletişime geçecek]";

  const address = {
    address: input.address.trim(),
    city: input.city.trim(),
    district: input.district.trim(),
    postal_code: input.postal_code.trim(),
  };

  const payload: OrderPayload = {
    customer_name: input.customer_name.trim(),
    customer_email: input.customer_email.trim(),
    customer_phone: input.customer_phone.trim(),
    shipping_address: address,
    billing_address: address,
    notes: [input.notes.trim(), consentNote, paymentNote]
      .filter(Boolean)
      .join("\n"),
    items: input.items.map((i) => ({
      product_id: i.id,
      variation_id: null,
      quantity: i.qty,
      unit_price: i.price,
      total_price: i.price * i.qty,
    })),
    total_amount: total,
  };

  try {
    // iyzico bağlıysa önce ödeme başlatılır; müşteri ödeme sayfasına yönlendirilir.
    // (Ödeme onayı callback'te doğrulanıp sipariş o zaman EasyTrade'e iletilecek.)
    const payment = await initiateIyzicoCheckout({
      orderId: "",
      total,
      customerName: payload.customer_name,
      email: payload.customer_email,
      phone: payload.customer_phone,
      addressText,
      city: address.city,
      items: input.items,
    });

    if (payment.mode === "iyzico") {
      return { paymentPageUrl: payment.paymentPageUrl };
    }

    // Hazırlık modu: sipariş ödemesiz olarak EasyTrade'e iletilir
    await postOrder(payload);
    try {
      // Yerel geçmiş kaydı — Vercel'de dosya sistemi salt-okunur olduğundan
      // başarısız olabilir; asıl sipariş EasyTrade'e gittiği için ölümcül değil.
      // (Neon Postgres'e geçince bu kayıt kalıcı hale gelecek.)
      const record = await addOrderRecord({
        userId: session?.uid ?? null,
        customerName: payload.customer_name,
        email: payload.customer_email,
        phone: payload.customer_phone,
        addressText,
        items: input.items,
        total,
        paymentMethod: "iyzico-bekliyor",
        paymentStatus: "beklemede",
      });
      // Sipariş e-postaları: müşteriye onay + yöneticiye bildirim (akışı kırmaz)
      sendOrderReceivedEmail(record).catch(() => {});
      sendAdminNewOrderEmail(record).catch(() => {});
      if (session) {
        addActivity({
          userId: session.uid,
          userName: session.name,
          type: "siparis",
          detail: `${record.id} — ${total.toLocaleString("tr-TR")} TL`,
        }).catch(() => {});
      }
    } catch (recordErr) {
      console.error("Sipariş geçmişi kaydedilemedi:", recordErr);
    }
    return { ok: true };
  } catch (err) {
    console.error("Sipariş hatası:", err);
    return {
      error:
        "Sipariş gönderilirken bir sorun oluştu. Lütfen tekrar deneyin ya da bizi arayın.",
    };
  }
}
