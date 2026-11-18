import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

// Ödeme altyapısı — iyzico Checkout Form (ortak ödeme sayfası).
// Ortam değişkenleri: IYZICO_API_KEY, IYZICO_SECRET_KEY ve isteğe bağlı IYZICO_BASE_URL.
// Ortam anahtarın kendisinden çıkarılır: iyzico sandbox anahtarları "sandbox-" önekiyle
// başlar (→ https://sandbox-api.iyzipay.com), canlı anahtarlar başlamaz (→ https://api.iyzipay.com).
// IYZICO_BASE_URL verilirse anahtarla uyuşmak zorundadır; uyuşmazsa ödeme kapalı kalır
// (aksi halde iyzico "api bilgileri bulunamadı" / 1001 döner).
// Anahtarlar tanımlı değilse sipariş gönderimi kapalıdır.
// Kart bilgisi hiçbir zaman bu siteye gelmez; ödeme iyzico sayfasında alınır ve
// sonuç callback'te iyzico'dan sunucu tarafında yeniden sorgulanarak doğrulanır.

const SANDBOX_URL = "https://sandbox-api.iyzipay.com";
const LIVE_URL = "https://api.iyzipay.com";
export class PaymentStartRejected extends Error {}

/** Vercel'e yapıştırırken gelen boşluk / satır sonu da 1001 hatası üretir; kırpılır. */
function keys(): { apiKey: string; secret: string } | null {
  const apiKey = process.env.IYZICO_API_KEY?.trim(), secret = process.env.IYZICO_SECRET_KEY?.trim();
  return apiKey && secret ? { apiKey, secret } : null;
}

type IyzicoEnv = { ok: true; url: string; sandbox: boolean } | { ok: false; error: string };

function resolveEnv(): IyzicoEnv {
  const k = keys();
  if (!k) return { ok: false, error: "iyzico anahtarları tanımlı değil" };
  const keySandbox = k.apiKey.startsWith("sandbox-");
  const explicit = process.env.IYZICO_BASE_URL?.trim().replace(/\/+$/, "");
  if (!explicit) return { ok: true, url: keySandbox ? SANDBOX_URL : LIVE_URL, sandbox: keySandbox };
  if (explicit !== SANDBOX_URL && explicit !== LIVE_URL) return { ok: false, error: "IYZICO_BASE_URL geçersiz" };
  const urlSandbox = explicit === SANDBOX_URL;
  if (urlSandbox !== keySandbox) {
    return { ok: false, error: `iyzico anahtarı (${keySandbox ? "sandbox" : "canlı"}) IYZICO_BASE_URL (${urlSandbox ? "sandbox" : "canlı"}) ile uyuşmuyor` };
  }
  return { ok: true, url: explicit, sandbox: urlSandbox };
}

export function paymentConfigured(): boolean {
  return keys() !== null;
}

export function paymentIsSandbox(): boolean {
  const env = resolveEnv();
  return env.ok ? env.sandbox : true;
}

/**
 * Bu ziyaretçi kartla ödeyebilir mi? Sandbox modunda test kartları gerçek para çekmeden
 * "ödendi" sonucu üretir; bu yüzden sandbox yalnız yöneticilere açılır, müşteriler
 * ödeme yapamaz. Üretimde sandbox kapalıdır. Ortam çözümlenemiyorsa kapalıdır.
 */
export function cardPaymentAvailable(isAdmin: boolean): boolean {
  const env = resolveEnv();
  return env.ok && (!env.sandbox || (isAdmin && process.env.VERCEL_ENV !== "production"));
}

/** Yönetici paneli için: yapılandırma hatası varsa açıklaması, yoksa null. */
export function paymentConfigError(): string | null {
  const env = resolveEnv();
  return paymentConfigured() && !env.ok ? env.error : null;
}

function baseUrl(): string {
  const env = resolveEnv();
  if (!env.ok) throw new Error(env.error);
  return env.url;
}

function appOrigin(): string {
  const origin = process.env.APP_ORIGIN || SITE_URL;
  return origin.replace(/\/+$/, "");
}

/** IYZWSv2: HMAC-SHA256(secret, randomKey + uriPath + body). */
async function iyzicoRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const k = keys();
  if (!k) throw new Error("iyzico anahtarları tanımlı değil");
  const { apiKey, secret } = k;
  const url = baseUrl() + path;
  const json = JSON.stringify(body);
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", secret).update(randomKey + path + json).digest("hex");
  const auth = Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`).toString("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `IYZWSv2 ${auth}`, "x-iyzi-rnd": randomKey },
    body: json,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`iyzico HTTP ${res.status}`);
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
export async function initiateIyzicoCheckout(order: CheckoutOrder): Promise<{ token: string; paymentPageUrl: string; expiresIn: number }> {
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
  const result = await iyzicoRequest<{ status: string; errorMessage?: string; token?: string; paymentPageUrl?: string; tokenExpireTime?: number; conversationId?: string; signature?: string }>(
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
      enabledInstallments: [1],
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
  if (result.status === "failure") throw new PaymentStartRejected("Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.");
  if (result.status !== "success" || !result.token || !result.paymentPageUrl) throw new Error("iyzico ödeme başlatma yanıtı eksik");
  if (result.conversationId !== order.orderId) throw new Error("iyzico işlem kimliği eşleşmedi");
  verifyResponseSignature([result.conversationId, result.token], result.signature);
  if (!/^https:\/\/([a-z0-9-]+\.)*iyzipay\.com\//.test(result.paymentPageUrl)) throw new Error("iyzico ödeme adresi beklenmedik");
  return { token: result.token, paymentPageUrl: result.paymentPageUrl, expiresIn: result.tokenExpireTime ?? 1800 };
}

export type IyzicoResult = {
  status: string;
  paymentStatus?: string;
  fraudStatus?: number;
  paymentId?: string;
  paidPrice?: number;
  price?: number;
  token?: string;
  signature?: string;
  currency?: string;
  basketId?: string;
  conversationId?: string;
  errorMessage?: string;
};

/** Callback'ten gelen token'ı iyzico'ya sorar; tarayıcıdan gelen hiçbir alana güvenilmez. */
export async function retrieveIyzicoCheckout(token: string): Promise<IyzicoResult> {
  const result = await iyzicoRequest<IyzicoResult>("/payment/iyzipos/checkoutform/auth/ecom/detail", { locale: "tr", token });
  if (result.status === "success") {
    if (result.token !== token) throw new Error("iyzico token eşleşmedi");
    verifyResponseSignature([result.paymentStatus, result.paymentId, result.currency, result.basketId, result.conversationId, result.paidPrice === undefined ? undefined : Number(result.paidPrice), result.price === undefined ? undefined : Number(result.price), result.token], result.signature);
  }
  return result;
}

function verifyResponseSignature(parts: (string | number | undefined)[], signature?: string) {
  if (!signature || !/^[a-f0-9]{64}$/i.test(signature)) throw new Error("iyzico yanıt imzası eksik");
  const expected = createHmac("sha256", keys()!.secret).update(parts.map(p => p ?? "").join(":" )).digest();
  if (!timingSafeEqual(Buffer.from(signature, "hex"), expected)) throw new Error("iyzico yanıt imzası geçersiz");
}
