"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getAllProducts, type OrderPayload } from "@/lib/easytrade";
import { getAdminUser, getSessionUser } from "@/lib/auth";
import { attachPaymentToken, reserveOrder } from "@/lib/orders";
import { forwardOrder } from "@/lib/order-forward";
import { cardPaymentAvailable, initiateIyzicoCheckout } from "@/lib/payments";
import { priceItems } from "@/lib/checkout";
import { shippingFee, totalWithShipping } from "@/lib/shipping";
import { audit, emailField, guardRate, InputError, safeError, textField, tokenHash } from "@/lib/security";
export type OrderState = { ok?: boolean; error?: string; paymentPageUrl?: string; orderId?: string };
export type CheckoutInput = { requestId: string; customer_name: string; customer_email: string; customer_phone: string; address: string; city: string; district: string; postal_code: string; notes: string; legalAccepted: boolean; items: { id: number; qty: number; name?: string; price?: number }[] };
export async function submitOrderAction(input: CheckoutInput): Promise<OrderState> {
  let reservedId: string | undefined;
  try {
    if (process.env.NODE_ENV === "development") throw new InputError("Geliştirme ortamında gerçek sipariş gönderimi kapalı.");
    await guardRate("checkout", 5);
    if (!input || typeof input !== "object" || input.legalAccepted !== true) throw new InputError("Sipariş sözleşmesini onaylayın.");
    const requestId = textField(input.requestId, 36, 36);
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) throw new InputError("İşlem kimliği geçersiz.");
    const name = textField(input.customer_name, 60, 2), email = emailField(input.customer_email);
    const phone = textField(input.customer_phone, 32, 10);
    if (!/^\+?[\d\s()-]{10,32}$/.test(phone)) throw new InputError("Telefon numarası geçersiz.");
    const address = { address: textField(input.address, 500, 10), city: textField(input.city, 60, 2), district: textField(input.district, 80), postal_code: textField(input.postal_code, 10) };
    const notes = textField(input.notes, 1000);
    // Validate shape/count before making a catalogue request.
    if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 50 || input.items.some(i => !i || !Number.isSafeInteger(i.id) || !Number.isSafeInteger(i.qty) || i.qty < 1 || i.qty > 99)) throw new InputError("Sepet geçersiz.");
    const { items, total } = priceItems(input.items, await getAllProducts(true));
    const cargoFee = shippingFee(total);
    const grandTotal = totalWithShipping(total);
    const session = await getSessionUser();
    const addressText = `${address.address}, ${address.district}, ${address.city} ${address.postal_code}`;
    // EasyTrade's supported total is the merchandise total. Carry shipping in the
    // merchant notes, while our order/payment total includes the confirmed charge.
    const cardPayment = cardPaymentAvailable(Boolean(await getAdminUser()));
    const payload: OrderPayload = { customer_name: name, customer_email: email, customer_phone: phone, shipping_address: address, billing_address: address, notes: `${notes}\n[Kargo: ${cargoFee.toFixed(2)} TL; kargo dahil toplam: ${grandTotal.toFixed(2)} TL.]\n[Sözleşme onaylandı; ${cardPayment ? "ödeme iyzico ile kartla alındı" : "ödeme mağaza tarafından ayrıca doğrulanır"}.]`, items: items.map(i => ({ product_id: i.id, variation_id: null, quantity: i.qty, unit_price: i.price, total_price: Math.round(i.price * 100) * i.qty / 100 })), total_amount: total };
    const requestKey = tokenHash(`checkout:${session?.uid ?? "guest"}:${requestId}`);
    const fingerprint = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const orderInput = { userId: session?.uid ?? null, customerName: name, email, phone, addressText, items, total: grandTotal, shippingFee: cargoFee, paymentMethod: cardPayment ? "iyzico" as const : "iyzico-bekliyor" as const, paymentStatus: "beklemede" as const };

    if (cardPayment) {
      // Kartla ödeme: sipariş kaydedilir, EasyTrade'e ancak iyzico ödemesi doğrulanınca gider.
      const reserved = await reserveOrder(orderInput, requestKey, fingerprint, payload);
      if (reserved.submission !== "awaiting-payment") {
        return reserved.order.paymentStatus === "odendi" ? { ok: true, orderId: reserved.order.id } : { error: `Siparişiniz işleniyor veya kontrol bekliyor. Tekrar sipariş oluşturmayın; ${reserved.order.id} numarasıyla mağazayla iletişime geçin.` };
      }
      const orderId = reserved.order.id;
      const h = await headers();
      const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "85.34.78.112";
      const checkout = await initiateIyzicoCheckout({ orderId, userId: session?.uid ?? null, total: grandTotal, shippingFee: cargoFee, customerName: name, email, phone, address: `${address.address}, ${address.district}`, city: address.city, postalCode: address.postal_code, ip, items });
      await attachPaymentToken(orderId, checkout.token);
      await audit("order.payment_started", session?.uid, orderId);
      return { ok: true, orderId, paymentPageUrl: checkout.paymentPageUrl };
    }

    const reserved = await reserveOrder(orderInput, requestKey, fingerprint);
    if (!reserved.created) return reserved.submission === "sent" ? { ok: true, orderId: reserved.order.id } : { error: `Siparişiniz işleniyor veya kontrol bekliyor. Tekrar sipariş oluşturmayın; ${reserved.order.id} numarasıyla mağazayla iletişime geçin.` };
    reservedId = reserved.order.id;
    payload.notes += `\n[Mağaza sipariş kimliği: ${reservedId}]`;
    const sent = await forwardOrder(reservedId, payload, session?.uid);
    if (!sent) return { error: `Sipariş sonucu kontrol bekliyor. Yeni sipariş göndermeden ${reservedId} numarasıyla mağazayla iletişime geçin.` };
    return { ok: true, orderId: reservedId };
  } catch (error) {
    if (reservedId) return { error: `Sipariş sonucu kontrol bekliyor. Yeni sipariş göndermeden ${reservedId} numarasıyla mağazayla iletişime geçin.` };
    return { error: safeError(error) };
  }
}
