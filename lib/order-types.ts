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

/** İzin verilen durum geçişleri — sunucu bunu zorlar, panel yalnız bunları önerir. */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  yeni: ["onaylandi", "iptal"],
  onaylandi: ["hazirlaniyor", "iptal"],
  hazirlaniyor: ["kargoda", "iptal"],
  kargoda: ["teslim-edildi"],
  "teslim-edildi": [],
  iptal: [],
};

export type OrderRecord = {
  id: string;
  userId: string | null; // misafir siparişlerinde null
  customerName: string;
  email: string;
  phone: string;
  addressText: string;
  items: { id: number; name: string; qty: number; price: number }[];
  total: number;
  /** Included in total. Absent on orders created before shipping was priced here. */
  shippingFee?: number;
  /** "iyzico": kartla ödeme (ödeme sayfası); "iyzico-bekliyor": ödemesiz mağaza onaylı sipariş (havale/elden) */
  paymentMethod: "iyzico" | "iyzico-bekliyor";
  paymentStatus: "odendi" | "beklemede";
  submission?: "pending" | "sent" | "unknown";
  providerReference?: string;
  paymentEvidence?: { actor: string; at: string; reference: string; note: string };
  reconciliation?: { actor: string; at: string; reference: string; note: string };
  /** Sipariş durumu (eski kayıtlarda olmayabilir; "yeni" varsayılır) */
  status?: OrderStatus;
  /** Kargo bilgisi — durum "kargoda" olduğunda doldurulur */
  cargo?: { firma: string; takipNo: string };
  /** Durum geçmişi (zaman damgalı) */
  history?: { status: OrderStatus; at: string; note?: string; actor?: string }[];
  createdAt: string;
};
