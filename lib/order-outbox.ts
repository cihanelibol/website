import "server-only";
import { randomUUID } from "node:crypto";
import { readJson, updateJson } from "./storage";
import { audit } from "./security";
import { requireAdmin } from "./auth";
import { emailConfigured, sendEmail, type EmailMessage } from "./email";
import type { OrderRecord } from "./order-types";

export type Notification = {
  id: string; message: EmailMessage; state: "pending" | "sent" | "failed";
  createdAt: number; attempts: number; nextAttempt: number;
  firstAttempt?: number; lease?: string; leaseUntil?: number; from?: string;
};
type OutboxOrder = OrderRecord & { notifications?: Notification[] };
// Appended inside the order's CAS transaction: a committed event cannot lose its notification.
export function queueNotification(order: OutboxOrder, id: string, message: EmailMessage) {
  order.notifications ??= [];
  if (!order.notifications.some(n => n.id === id)) order.notifications.push({ id, message, state: "pending", createdAt: Date.now(), attempts: 0, nextAttempt: 0 });
}

export async function dispatchOrderNotifications(orderId?: string, limit = 10) {
  const result = { sent: 0, deferred: 0, failed: 0 };
  if (!emailConfigured() || process.env.NODE_ENV === "development") return result;
  for (let i = 0; i < Math.min(20, Math.max(0, limit)); i++) {
    const now = Date.now(), lease = randomUUID();
    const claimed = await updateJson<OutboxOrder[], { orderId: string; notification: Notification } | undefined>("orders.json", [], orders => {
      for (const order of orders) {
        if (orderId && order.id !== orderId) continue;
        for (const n of order.notifications ?? []) {
          if (n.state !== "pending" || (n.leaseUntil ?? 0) > now || n.nextAttempt > now) continue;
          // Resend deduplication lasts 24h. Never replay an uncertain send beyond 23h.
          if (n.attempts >= 6 || (n.firstAttempt !== undefined && now - n.firstAttempt >= 23 * 3600_000)) { n.state = "failed"; continue; }
          n.firstAttempt ??= now; n.from ??= process.env.MAIL_FROM!;
          n.attempts++; n.lease = lease; n.leaseUntil = now + 120_000;
          return { value: orders, result: { orderId: order.id, notification: structuredClone(n) } };
        }
      }
      return { value: orders, result: undefined };
    });
    if (!claimed) break;
    const n = claimed.notification;
    let sent = false;
    try { await sendEmail(n.message, { key: n.id, from: n.from! }); sent = true; } catch { /* Stored failure below; no order resubmission. */ }
    await updateJson<OutboxOrder[], void>("orders.json", [], orders => {
      const current = orders.find(o => o.id === claimed.orderId)?.notifications?.find(item => item.id === n.id);
      if (current?.lease === lease) {
        current.state = sent ? "sent" : current.attempts >= 6 ? "failed" : "pending";
        current.nextAttempt = Date.now() + Math.min(3600_000, 60_000 * 2 ** current.attempts);
        delete current.lease; delete current.leaseUntil;
      }
      return { value: orders, result: undefined };
    });
    if (sent) result.sent++; else if (n.attempts >= 6) result.failed++; else result.deferred++;
    await audit(sent ? "mail.sent" : "mail.retry_required", undefined, n.id, sent ? "success" : "error");
  }
  return result;
}

export async function getNotificationFailures() {
  await requireAdmin();
  return (await readJson<OutboxOrder[]>("orders.json", [])).flatMap(order =>
    (order.notifications ?? []).filter(n => n.state !== "sent").map(n => ({ orderId: order.id, id: n.id, state: n.state, attempts: n.attempts, createdAt: n.createdAt }))
  ).sort((a, b) => a.createdAt - b.createdAt).slice(0, 200);
}
