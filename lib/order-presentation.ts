import { ORDER_STATUS_LABELS, type OrderRecord } from "./order-types";

export function orderView(order: OrderRecord) {
  if (order.paymentSandbox) return { tone: "pending", icon: "info", title: "Test ödemesi", text: "Bu işlem test ortamına aittir. Gerçek tahsilat ve mağazaya sipariş aktarımı yapılmaz." } as const;
  if (order.status === "iptal") return { tone: "pending", icon: "info", title: "Sipariş iptal edildi", text: order.paymentStatus === "odendi" ? "Ödeme kaydınız mevcut. İade durumu için mağazamızla iletişime geçebilirsiniz." : "Bu sipariş hazırlığa alınmayacak. Ödeme durumuyla ilgili sorularınız için bize ulaşabilirsiniz." } as const;
  if (order.paymentStatus === "odendi") {
    if (order.submission !== "sent") return { tone: "pending", icon: "clock", title: "Ödemeniz alındı, siparişiniz işleniyor", text: "Ödemeniz doğrulandı. Sipariş kaydınızın tamamlanmasını bekliyoruz; tekrar ödeme yapmayın. Durumu bu sayfadan takip edebilirsiniz." } as const;
    return { tone: "success", icon: "circle-check", title: "Ödemeniz alındı, siparişiniz onaylandı", text: "Teşekkür ederiz. Siparişinizin hazırlık ve kargo durumunu bu sayfadan takip edebilirsiniz." } as const;
  }
  if (order.paymentStatus === "basarisiz") return { tone: "error", icon: "warning", title: "Ödeme tamamlanamadı", text: "Ödemeniz onaylanmadı. Bilgileriniz korundu; ödeme adımını tekrar deneyebilirsiniz." } as const;
  if (order.paymentStatus === "kontrol") return { tone: "pending", icon: "clock", title: "Ödemeniz kontrol ediliyor", text: "Ödeme sonucu henüz kesinleşmedi. Tekrar ödeme yapmayın; sonucu kontrol edebilir veya sipariş numaranızla bize ulaşabilirsiniz." } as const;
  if (order.paymentMethod === "iyzico-bekliyor") return { tone: "pending", icon: "clock", title: "Ödeme doğrulaması bekleniyor", text: "Bu sipariş önceki sipariş akışıyla kaydedildi. Ödeme durumunu doğrulamak için mağazamızla iletişime geçin; ödeme doğrulanmadan hazırlık başlamaz." } as const;
  return { tone: "pending", icon: "clock", title: "Ödeme bekleniyor", text: "Siparişiniz henüz onaylanmadı. Ödemenizi tamamladığınızda hazırlık süreci başlayacak." } as const;
}

export function customerOrderLabel(order: OrderRecord) {
  if (order.status === "iptal") return "İptal edildi";
  if (order.paymentSandbox) return "Test işlemi";
  if (order.paymentStatus !== "odendi") return orderView(order).title;
  if (order.submission !== "sent") return "Sipariş işleniyor";
  return ORDER_STATUS_LABELS[order.status ?? "onaylandi"];
}
