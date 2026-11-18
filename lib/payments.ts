import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { SITE_URL } from "./site";

// Ödeme altyapısı — iyzico Checkout Form (ortak ödeme sayfası).
// Ortam değişkenleri: IYZICO_API_KEY, IYZICO_SECRET_KEY ve isteğe bağlı IYZICO_BASE_URL
// (varsayılan sandbox: https://sandbox-api.iyzipay.com; canlı: https://api.iyzipay.com).
// Anahtarlar tanımlı değilse sepet "mağaza onaylı sipariş" (ödemesiz) modunda kalır.
// Kart bilgisi hiçbir zaman bu siteye gelmez; ödeme iyzico sayfasında alınır ve
// sonuç callback'te iyzico'dan sunucu tarafında yeniden sorgulanarak doğrulanır.

export function paymentConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

export function paymentIsSandbox(): boolean {
  return !process.env.IYZICO_BASE_URL || process.env.IYZICO_BASE_URL.includes("sandbox");
}

/**
 * Bu ziyaretçi kartla ödeyebilir mi? Sandbox modunda test kartları gerçek para çekmeden
 * "ödendi" sonucu üretir; bu yüzden sandbox yalnız yöneticilere açılır, müşteriler
 * ödemesiz sipariş akışında kalır.
 */
export function cardPaymentAvailable(isAdmin: boolean): boolean {
  return paymentConfigured() && (!paymentIsSandbox() || isAdmin);
}

function baseUrl(): string {
  const url = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  if (!/^https:\/\/(sandbox-)?api\.iyzipay\.com$/.test(url)) throw new Error("IYZICO_BASE_URL geçersiz");
  return url;
}

function appOrigin(): string {
  const origin = process.env.APP_ORIGIN || SITE_URL;
  return origin.replace(/\/+$/, "");
}

/** IYZWSv2: HMAC-SHA256(secret, randomKey + uriPath + body). */
async function iyzicoRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.IYZICO_API_KEY, secret = process.env.IYZICO_SECRET_KEY;
  if (!apiKey || !secret) throw new Error("iyzico anahtarları tanımlı değil");
  const json = JSON.stringify(body);
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", secret).update(randomKey + path + json).digest("hex");
  const auth = Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`).toString("base64");
  const res = await fetch(baseUrl() + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `IYZWSv2 ${auth}`, "x-iyzi-rnd": randomKey },
    body: json,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text();
  if (text.length > 512_000) throw new Error("iyzico yanıtı çok büyük");
  try { return JSON.parse(text) as T; }
  catch { throw new Error(`iyzico yanıtı okunamadı (${res.status})`); }
}

const money = (cents: number) => (cents / 100).toFixed(2);
const cents = (value: number) => Math.round(value * 100);

function splitName(full: string): { name: string; surname: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return { name: parts[0] || "Müşteri", surname: parts[0] || "Müşteri" };
  return { name: parts.slice(0, -1).join(" "), surname: parts[parts.length - 1] };
}

function gsm(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+9${digits}`;
  if (digits.length === 10) return `+90${digits}`;
  return `+${digits}`;
}

export type CheckoutOrder = {
  orderId: string;
  userId: string | null;
  total: number;
  shippingFee: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  ip: string;
  items: { id: number; name: string; qty: number; price: number }[];
};

/** Ortak ödeme sayfasını başlatır; dönen URL'ye müşteri yönlendirilir. */
export async function initiateIyzicoCheckout(order: CheckoutOrder): Promise<{ token: string; paymentPageUrl: string }> {
  // iyzico sepetinde adet yoktur: her satır = birim fiyat × adet. Kargo ayrı satırdır.
  const basketItems = order.items.map(i => ({
    id: String(i.id),
    name: i.name.slice(0, 200),
    category1: "Akvaryum",
    itemType: "PHYSICAL",
    price: money(cents(i.price) * i.qty),
  }));
  if (order.shippingFee > 0) basketItems.push({ id: "KARGO", name: "Kargo ücreti", category1: "Kargo", itemType: "VIRTUAL", price: money(cents(order.shippingFee)) });
  const basketCents = basketItems.reduce((sum, i) => sum + Math.round(Number(i.price) * 100), 0);
  if (basketCents !== cents(order.total)) throw new Error("Sepet toplamı sipariş tutarıyla eşleşmiyor");

  const { name, surname } = splitName(order.customerName);
  const address = { contactName: order.customerName.slice(0, 100), city: order.city, country: "Turkey", address: order.address.slice(0, 500), zipCode: order.postalCode || undefined };
  const result = await iyzicoRequest<{ status: string; errorMessage?: string; token?: string; paymentPageUrl?: string }>(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    {
      locale: "tr",
      conversationId: order.orderId,
      price: money(basketCents),
      paidPrice: money(basketCents),
      currency: "TRY",
      basketId: order.orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: `${appOrigin()}/api/odeme/iyzico`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: order.userId ?? `misafir-${order.orderId}`,
        name, surname,
        gsmNumber: gsm(order.phone),
        email: order.email,
        // Checkout Form TCKN'yi ödeme sayfasında istemez; iyzico'nun belgelenen yer tutucusu.
        identityNumber: "11111111111",
        registrationAddress: address.address,
        ip: order.ip,
        city: order.city,
        country: "Turkey",
        zipCode: order.postalCode || undefined,
      },
      shippingAddress: address,
      billingAddress: address,
      basketItems,
    },
  );
  if (result.status !== "success" || !result.token || !result.paymentPageUrl) throw new Error(`iyzico ödeme başlatılamadı: ${result.errorMessage ?? "bilinmeyen hata"}`);
  if (!/^https:\/\/([a-z0-9-]+\.)*iyzipay\.com\//.test(result.paymentPageUrl)) throw new Error("iyzico ödeme adresi beklenmedik");
  return { token: result.token, paymentPageUrl: result.paymentPageUrl };
}

export type IyzicoResult = {
  status: string;
  paymentStatus?: string;
  fraudStatus?: number;
  paymentId?: string;
  paidPrice?: number;
  currency?: string;
  basketId?: string;
  conversationId?: string;
  errorMessage?: string;
};

/** Callback'ten gelen token'ı iyzico'ya sorar; tarayıcıdan gelen hiçbir alana güvenilmez. */
export async function retrieveIyzicoCheckout(token: string): Promise<IyzicoResult> {
  return iyzicoRequest<IyzicoResult>("/payment/iyzipos/checkoutform/auth/ecom/detail", { locale: "tr", token });
}
