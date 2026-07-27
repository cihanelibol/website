// Sipariş tip ve sabitleri — hem sunucu hem istemci bileşenlerinden
// güvenle içe aktarılabilir (fs/veritabanı bağımlılığı yoktur).

export type OrderStatus =
  | "yeni"
  | "onaylandi"
  | "hazirlaniyor"
  | "kargoda"
  | "teslim-edildi"
  | "iptal";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  yeni: "Sipariş Alındı",
  onaylandi: "Onaylandı",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoya Verildi",
  "teslim-edildi": "Teslim Edildi",
  iptal: "İptal Edildi",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "yeni",
  "onaylandi",
  "hazirlaniyor",
  "kargoda",
  "teslim-edildi",
  "iptal",
];

export type OrderRecord = {
  id: string;
  userId: string | null; // misafir siparişlerinde null
  customerName: string;
  email: string;
  phone: string;
  addressText: string;
  items: { id: number; name: string; qty: number; price: number }[];
  total: number;
  /** Ödeme yöntemi: iyzico entegrasyonu bağlanana dek "iyzico-bekliyor" */
  paymentMethod: "iyzico" | "iyzico-bekliyor";
  paymentStatus: "odendi" | "beklemede";
  /** Sipariş durumu (eski kayıtlarda olmayabilir; "yeni" varsayılır) */
  status?: OrderStatus;
  /** Kargo bilgisi — durum "kargoda" olduğunda doldurulur */
  cargo?: { firma: string; takipNo: string };
  /** Durum geçmişi (zaman damgalı) */
  history?: { status: OrderStatus; at: string; note?: string }[];
  createdAt: string;
};
