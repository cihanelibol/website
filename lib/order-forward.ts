import "server-only";
import { postOrder, type OrderPayload } from "./easytrade";
import { claimOrderForward, markOrderSubmission } from "./orders";
import { dispatchOrderNotifications } from "./order-outbox";
import { audit } from "./security";

/**
 * Siparişi EasyTrade'e iletir. Sonuç belirsizse (zaman aşımı, ret) sipariş
 * "unknown" işaretlenir ve yönetim panelinde "Kontrol bekliyor" olarak görünür;
 * tekrar gönderim YAPILMAZ (çift sipariş riski).
 */
export async function forwardOrder(orderId: string, payload: OrderPayload, actor?: string): Promise<boolean> {
  if (!await claimOrderForward(orderId)) return false;
  try {
    const receipt = await postOrder(payload);
    await markOrderSubmission(orderId, "sent", receipt);
    await audit("order.submitted", actor, orderId);
    await dispatchOrderNotifications(orderId, 2).catch(() => audit("mail.dispatch_failed", undefined, orderId, "error"));
    return true;
  } catch {
    await markOrderSubmission(orderId, "unknown").catch(() => undefined);
    await audit("order.reconcile_required", undefined, orderId, "error");
    return false;
  }
}
