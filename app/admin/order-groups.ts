import type { OrderRecord } from "@/lib/order-types";

// Panelin sipariş sınıflandırması. Bir sipariş tek bir gruba düşer; sıra önceliği belirler.
export type OrderGroup = "kontrol" | "tahsilat" | "hazirlanacak" | "kargoda" | "tamamlandi" | "kart-bekliyor" | "iptal";

export const GROUP_LABELS: Record<OrderGroup, string> = {
  kontrol: "Kontrol bekliyor",
  tahsilat: "Eski ödemesiz sipariş",
  hazirlanacak: "Hazırlanacak",
  kargoda: "Kargoda",
  tamamlandi: "Teslim edildi",
  "kart-bekliyor": "Yarım kalan kart ödemesi",
  iptal: "İptal",
};

export const GROUP_HINTS: Record<OrderGroup, string> = {
  kontrol: "Ödeme veya sipariş aktarımı doğrulama bekliyor. Önce iyzico ödeme kaydını, ardından EasyTrade sipariş kaydını kontrol edin. Belirsiz işlemi yeniden göndermeyin.",
  tahsilat: "Kart ödemesi olmadan gelen sipariş. Havale/elden ödemeyi aldığınızda kaydedin.",
  hazirlanacak: "Ödemesi doğrulandı ve sipariş aktarımı tamamlandı; hazırlığa alınabilir.",
  kargoda: "Kargoya verildi, teslim bekleniyor.",
  tamamlandi: "Teslim edilmiş siparişler.",
  "kart-bekliyor": "Kart ödemesi henüz doğrulanmadı. Hazırlığa almayın; tahsilat durumunu iyzico kaydından kontrol edin.",
  iptal: "İptal edilmiş siparişler.",
};

export function orderGroup(o: OrderRecord): OrderGroup {
  const status = o.status ?? "yeni";
  if (status === "iptal") return "iptal";
  if (o.paymentSandbox || o.paymentStatus === "kontrol") return "kontrol";
  if (o.paymentMethod === "iyzico" && o.paymentStatus !== "odendi" && !o.submission) return "kart-bekliyor";
  if (o.submission && o.submission !== "sent") return "kontrol";
  if (o.paymentStatus !== "odendi") return "tahsilat";
  if (status === "teslim-edildi") return "tamamlandi";
  if (status === "kargoda") return "kargoda";
  return "hazirlanacak";
}
