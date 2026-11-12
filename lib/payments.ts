// Ödeme altyapısı — iyzico.
// API bilgileri (.env: IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL)
// tanımlanana kadar akış "hazırlık modu"nda çalışır: sipariş ödemesiz iletilir,
// tahsilat mağaza tarafından yapılır. Bilgiler girildiğinde yalnızca bu dosyadaki
// TODO bölümü doldurulacak; sepet/ödeme arayüzü olduğu gibi kalacak.

export type PaymentInit =
  | { mode: "hazirlik" } // iyzico henüz bağlı değil
  | { mode: "iyzico"; paymentPageUrl: string };

export function paymentConfigured(): boolean {
  // API anahtarlarının varlığı, henüz uygulanmamış checkout'u hazır yapmaz.
  // Entegrasyon ve callback doğrulaması tamamlanana kadar ödemesiz sipariş kullanılır.
  return false;
}

export async function initiateIyzicoCheckout(_order: {
  orderId: string;
  total: number;
  customerName: string;
  email: string;
  phone: string;
  addressText: string;
  city: string;
  items: { id: number; name: string; qty: number; price: number }[];
}): Promise<PaymentInit> {
  void _order; // Payload sözleşmesi entegrasyon tamamlandığında kullanılacak.
  if (!paymentConfigured()) return { mode: "hazirlik" };

  // TODO (iyzico bilgileri gelince): CheckoutFormInitialize isteği at,
  // dönen paymentPageUrl'e yönlendir; callback route'unda ödemeyi doğrula.
  // https://docs.iyzico.com/ — Checkout Form (CF) akışı kullanılacak.
  throw new Error("iyzico entegrasyonu henüz tamamlanmadı");
}
