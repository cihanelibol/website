import type { OrderRecord } from "@/lib/order-types";

// Panelin sipariş sınıflandırması. Bir sipariş tek bir gruba düşer; sıra önceliği belirler.
export type OrderGroup = "kontrol" | "tahsilat" | "hazirlanacak" | "kargoda" | "tamamlandi" | "kart-bekliyor" | "iptal";

export const GROUP_LABELS: Record<OrderGroup, string> = {
  kontrol: "Kontrol bekliyor",
  tahsilat: "Ödeme bekleniyor",
  hazirlanacak: "Hazırlanacak",
  kargoda: "Kargoda",
  tamamlandi: "Teslim edildi",
  "kart-bekliyor": "Yarım kalan kart ödemesi",
  iptal: "İptal",
};

export const GROUP_HINTS: Record<OrderGroup, string> = {
  kontrol: "Sipariş EasyTrade'e iletilirken yanıt alınamadı. EasyTrade panelinde siparişin oluşup oluşmadığına bakıp onaylayın.",
  tahsilat: "Kart ödemesi olmadan gelen sipariş. Havale/elden ödemeyi aldığınızda kaydedin.",
  hazirlanacak: "Ödemesi tamam veya mağaza onaylı; hazırlayıp kargoya verin.",
  kargoda: "Kargoya verildi, teslim bekleniyor.",
  tamamlandi: "Teslim edilmiş siparişler.",
  "kart-bekliyor": "Müşteri iyzico ödeme sayfasını açtı ama ödemeyi bitirmedi. Para çekilmedi; işlem gerekmez.",
  iptal: "İptal edilmiş siparişler.",
};

export function orderGroup(o: OrderRecord): OrderGroup {
  const status = o.status ?? "yeni";
  if (status === "iptal") return "iptal";
  if (o.paymentMethod === "iyzico" && o.paymentStatus === "beklemede" && !o.submission) return "kart-bekliyor";
  if (o.submission && o.submission !== "sent") return "kontrol";
  if (status === "teslim-edildi") return "tamamlandi";
  if (status === "kargoda") return "kargoda";
  if (o.paymentStatus === "beklemede") return "tahsilat";
  return "hazirlanacak";
}
