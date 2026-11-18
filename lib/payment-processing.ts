import "server-only";
import { retrieveIyzicoCheckout } from "./payments";
import { getPaymentOrderId, markPaymentUncertain, settleIyzicoPayment } from "./orders";
import { forwardOrder } from "./order-forward";
import { audit } from "./security";

/** Shared by callback and authenticated rechecks. Settlement claims forwarding atomically. */
export async function processPaymentToken(token: string) {
  const orderId = await getPaymentOrderId(token);
  if (!orderId) return;
  try {
    const outcome = await settleIyzicoPayment(token, await retrieveIyzicoCheckout(token));
    if (outcome?.result === "paid" && outcome.payload) await forwardOrder(outcome.orderId, outcome.payload);
    await audit(`payment.${outcome?.result ?? "unknown"}`, undefined, orderId);
    return outcome;
  } catch {
    await markPaymentUncertain(orderId);
    await audit("payment.check_required", undefined, orderId, "error");
    return { orderId, result: "mismatch" as const };
  }
}
