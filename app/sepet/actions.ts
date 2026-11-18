"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getAllProducts, type OrderPayload } from "@/lib/easytrade";
import { getAdminUser, getSessionUser } from "@/lib/auth";
import { attachPaymentToken, claimPaymentAttempt, getCustomerOrder, getPaymentCheck, getPaymentRestart, markPaymentStartRejected, markPaymentUncertain, reserveOrder } from "@/lib/orders";
import { cardPaymentAvailable, initiateIyzicoCheckout, paymentIsSandbox, PaymentStartRejected } from "@/lib/payments";
import { grantOrderAccess, orderTrackingPath } from "@/lib/order-access";
import { processPaymentToken } from "@/lib/payment-processing";
import { priceItems } from "@/lib/checkout";
import { shippingFee, totalWithShipping } from "@/lib/shipping";
import { audit, emailField, guardRate, InputError, safeError, textField, tokenHash } from "@/lib/security";

export type OrderState = { ok?: boolean; error?: string; paymentPageUrl?: string; resultUrl?: string; orderId?: string };
export type CheckoutInput = { requestId: string; customer_name: string; customer_email: string; customer_phone: string; address: string; city: string; district: string; postal_code: string; notes: string; legalAccepted: boolean; items: { id: number; qty: number; name?: string; price?: number }[] };

async function requirePaymentAvailable() {
  if (process.env.NODE_ENV === "development") throw new InputError("Geliştirme ortamında gerçek sipariş gönderimi kapalı.");
  if (!cardPaymentAvailable(Boolean(await getAdminUser()))) throw new InputError("Şu anda ödeme alınamıyor. Sipariş oluşturulmadı; sepetiniz korunuyor. Lütfen daha sonra tekrar deneyin.");
}

async function openPayment(orderId: string): Promise<OrderState> {
  const restart = await getPaymentRestart(orderId);
  if (!restart) throw new InputError("Ödeme bilgileri bulunamadı.");
  const { order, address } = restart;
  const resultUrl = orderTrackingPath(orderId);
  if (order.paymentStatus === "odendi" || order.status === "iptal") return { ok: true, orderId, resultUrl };
  if (Boolean(order.paymentSandbox) !== paymentIsSandbox()) throw new InputError("Ödeme ortamı değişti. Siparişinizin kontrolü için mağazayla iletişime geçin.");
  const attempt = await claimPaymentAttempt(orderId);
  if (attempt.url) return { ok: true, orderId, paymentPageUrl: attempt.url, resultUrl };
  try {
    const h = await headers();
    const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "127.0.0.1";
    const checkout = await initiateIyzicoCheckout({ orderId, userId: order.userId, total: order.total, shippingFee: order.shippingFee ?? 0, customerName: order.customerName, email: order.email, phone: order.phone, address: `${address.address}, ${address.district}`, city: address.city, postalCode: address.postal_code, ip, items: order.items });
    await attachPaymentToken(orderId, checkout.token, checkout.paymentPageUrl, checkout.expiresIn);
    await audit("order.payment_started", order.userId ?? undefined, orderId);
    return { ok: true, orderId, paymentPageUrl: checkout.paymentPageUrl, resultUrl };
  } catch (error) {
    if (error instanceof PaymentStartRejected) {
      await markPaymentStartRejected(orderId);
      throw new InputError(error.message);
    }
    await markPaymentUncertain(orderId);
    throw error;
  }
}

export async function submitOrderAction(input: CheckoutInput): Promise<OrderState> {
  let orderId: string | undefined;
  try {
    await requirePaymentAvailable();
    await guardRate("checkout", 5);
    if (!input || typeof input !== "object" || input.legalAccepted !== true) throw new InputError("Sipariş sözleşmesini onaylayın.");
    const requestId = textField(input.requestId, 36, 36);
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) throw new InputError("İşlem kimliği geçersiz.");
    const name = textField(input.customer_name, 60, 2), email = emailField(input.customer_email);
    const phone = textField(input.customer_phone, 32, 10);
    if (!/^\+?[\d\s()-]{10,32}$/.test(phone)) throw new InputError("Telefon numarası geçersiz.");
    const address = { address: textField(input.address, 500, 10), city: textField(input.city, 60, 2), district: textField(input.district, 80), postal_code: textField(input.postal_code, 10) };
    const notes = textField(input.notes, 1000);
    if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 50 || input.items.some(i => !i || !Number.isSafeInteger(i.id) || !Number.isSafeInteger(i.qty) || i.qty < 1 || i.qty > 99)) throw new InputError("Sepet geçersiz.");
    const { items, total } = priceItems(input.items, await getAllProducts(true));
    const cargoFee = shippingFee(total), grandTotal = totalWithShipping(total);
    const session = await getSessionUser();
    const payload: OrderPayload = { customer_name: name, customer_email: email, customer_phone: phone, shipping_address: address, billing_address: address, notes: `${notes}\n[Kargo: ${cargoFee.toFixed(2)} TL; kargo dahil toplam: ${grandTotal.toFixed(2)} TL.]\n[Sözleşme onaylandı; ödeme iyzico ile sunucuda doğrulandıktan sonra aktarılır.]`, items: items.map(i => ({ product_id: i.id, variation_id: null, quantity: i.qty, unit_price: i.price, total_price: Math.round(i.price * 100) * i.qty / 100 })), total_amount: total };
    const requestKey = tokenHash(`checkout:${session?.uid ?? "guest"}:${requestId}`);
    const fingerprint = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const reserved = await reserveOrder({ userId: session?.uid ?? null, customerName: name, email, phone, addressText: `${address.address}, ${address.district}, ${address.city} ${address.postal_code}`, items, total: grandTotal, shippingFee: cargoFee, paymentMethod: "iyzico", paymentStatus: "beklemede", paymentSandbox: paymentIsSandbox() }, requestKey, fingerprint, payload);
    orderId = reserved.order.id;
    await grantOrderAccess(orderId);
    return await openPayment(orderId);
  } catch (error) {
    return { error: error instanceof InputError ? error.message : "Ödeme başlatılamadı. Yeniden ödeme yapmadan sipariş durumunu kontrol edin.", ...(orderId ? { orderId, resultUrl: orderTrackingPath(orderId) } : {}) };
  }
}

export async function checkOrderPaymentAction(id: string, access?: string): Promise<OrderState> {
  try {
    if (!await getCustomerOrder(id, access)) throw new InputError("Siparişe erişilemiyor.");
    await guardRate("payment-check", 10, 60, id);
    const check = await getPaymentCheck(id);
    if (check?.token && !check.paid) await processPaymentToken(check.token);
    await grantOrderAccess(id);
    return { ok: true, orderId: id, resultUrl: orderTrackingPath(id) };
  } catch (error) { return { error: safeError(error) }; }
}

export async function retryOrderPaymentAction(id: string, access?: string): Promise<OrderState> {
  try {
    const order = await getCustomerOrder(id, access);
    if (!order) throw new InputError("Siparişe erişilemiyor.");
    await requirePaymentAvailable();
    await guardRate("payment-retry", 5, 60, id);
    if (order.paymentMethod !== "iyzico") throw new InputError("Bu sipariş için mağazayla iletişime geçin.");
    const check = await getPaymentCheck(id);
    if (check?.token && !check.paid && order.paymentStatus !== "beklemede") await processPaymentToken(check.token);
    const fresh = await getCustomerOrder(id, access);
    if (fresh?.paymentStatus === "basarisiz") {
      const priced = priceItems(fresh.items, await getAllProducts(true));
      if (totalWithShipping(priced.total) !== fresh.total || priced.items.some((i, index) => i.price !== fresh.items[index]?.price)) throw new InputError("Ürün fiyatı veya stok değişti. Siparişinizi güncellemek için mağazayla iletişime geçin.");
    }
    await grantOrderAccess(id);
    return await openPayment(id);
  } catch (error) { return { error: safeError(error) }; }
}
