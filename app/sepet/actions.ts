"use server";

import { postOrder, type OrderPayload } from "@/lib/easytrade";

export type OrderState = { ok?: boolean; error?: string };

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
  items: { id: number; qty: number; price: number }[];
};

export async function submitOrderAction(
  input: CheckoutInput
): Promise<OrderState> {
  if (!input.customer_name.trim()) return { error: "Ad Soyad zorunludur." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customer_email.trim()))
    return { error: "Geçerli bir e-posta adresi girin." };
  if (!input.customer_phone.trim()) return { error: "Telefon numarası zorunludur." };
  if (!input.address.trim()) return { error: "Teslimat adresi zorunludur." };
  if (!input.city.trim()) return { error: "Şehir zorunludur." };
  if (input.items.length === 0) return { error: "Sepetiniz boş." };
  if (!input.legalAccepted)
    return {
      error:
        "Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi onaylanmadan sipariş verilemez.",
    };

  // İspat kaydı: onay bilgisi sipariş notuna eklenir (panelde görünür)
  const consentNote = `[Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} tarihinde elektronik ortamda onaylandı.]`;

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
    notes: [input.notes.trim(), consentNote].filter(Boolean).join("\n"),
    items: input.items.map((i) => ({
      product_id: i.id,
      variation_id: null,
      quantity: i.qty,
      unit_price: i.price,
      total_price: i.price * i.qty,
    })),
    total_amount: input.items.reduce((s, i) => s + i.price * i.qty, 0),
  };

  try {
    await postOrder(payload);
    return { ok: true };
  } catch (err) {
    console.error("Sipariş hatası:", err);
    return {
      error:
        "Sipariş gönderilirken bir sorun oluştu. Lütfen tekrar deneyin ya da bizi arayın.",
    };
  }
}
