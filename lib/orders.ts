import "server-only";
import { randomBytes } from "node:crypto";
import { readJson, updateJson } from "./storage";
import { getSessionUser, requireAdmin, requireFreshAdmin } from "./auth";
import { audit, InputError, textField } from "./security";
import { ORDER_TRANSITIONS, type OrderRecord, type OrderStatus } from "./order-types";
import type { OrderPayload } from "./easytrade";
import { queueNotification, type Notification } from "./order-outbox";
import { orderReceivedMessage, adminNewOrderMessage, orderStatusMessage } from "./email";
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderRecord, type OrderStatus } from "./order-types";
const FILE = "orders.json";
type StoredOrder = OrderRecord & { notifications?: Notification[]; requestKey?: string; fingerprint?: string; submission?: "pending" | "sent" | "unknown"; providerPayload?: OrderPayload; paymentToken?: string };
function publicOrder(record: StoredOrder): OrderRecord {
  const { paymentEvidence, reconciliation, ...order } = adminOrder(record);
  void paymentEvidence; void reconciliation;
  return order;
}
/** Yönetici görünümü: ödeme/uzlaştırma kanıtı dahil, iç anahtarlar hariç. */
function adminOrder(record: StoredOrder): OrderRecord {
  const { requestKey, fingerprint, notifications, providerPayload, paymentToken, ...order } = record;
  void requestKey; void fingerprint; void providerPayload; void paymentToken;
  void notifications;
  return order;
}
/**
 * awaitingPayment: iyzico siparişi. Ödeme doğrulanana kadar EasyTrade'e gönderilmez;
 * gönderilecek yük siparişle birlikte saklanır ve ödeme onayında aktarılır.
 */
export async function reserveOrder(input: Omit<OrderRecord, "id" | "createdAt" | "status" | "history">, requestKey: string, fingerprint: string, awaitingPayment?: OrderPayload) {
  return updateJson<StoredOrder[], { order: OrderRecord; created: boolean; submission: string }>(FILE, [], all => {
    const existing = all.find(o => o.requestKey === requestKey);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new InputError("Bu işlem kimliği farklı bir siparişte kullanıldı.");
      return { value: all, result: { order: publicOrder(existing), created: false, submission: existing.submission ?? (awaitingPaymentOrder(existing) ? "awaiting-payment" : "unknown") } };
    }
    const now = new Date().toISOString();
    const id = `GA-${randomBytes(12).toString("hex").toUpperCase()}`;
    const record: StoredOrder = { ...input, id, status: "yeni", history: [{ status: "yeni", at: now }], createdAt: now, requestKey, fingerprint, ...(awaitingPayment ? { providerPayload: { ...awaitingPayment, notes: `${awaitingPayment.notes}\n[Mağaza sipariş kimliği: ${id}]` } } : { submission: "pending" as const }) };
    all.push(record);
    return { value: all, result: { order: publicOrder(record), created: true, submission: record.submission ?? "awaiting-payment" } };
  });
}
export async function markOrderSubmission(id: string, submission: "sent" | "unknown", receipt?: { reference: string; total: number; currency: string }) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (order && order.submission === "pending") {
      const providerTotalCents = Math.round(order.total * 100) - Math.round((order.shippingFee ?? 0) * 100);
      if (submission === "sent" && (!receipt?.reference || receipt.currency !== "TRY" || Math.round(receipt.total * 100) !== providerTotalCents)) throw new Error("Verified external receipt required");
      order.submission = submission;
      if (receipt) order.providerReference = receipt.reference;
      if (submission === "sent") queueConfirmation(order);
    }
    return { value: all, result: undefined };
  });
}
export async function getOrdersByUser(userId: string): Promise<OrderRecord[]> {
  const session = await getSessionUser();
  if (!session || session.uid !== userId) throw new InputError("Yetkiniz yok.");
  return (await readJson<StoredOrder[]>(FILE, [])).filter(o => o.userId === userId && !awaitingPaymentOrder(o)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicOrder);
}
export async function getAllOrders(): Promise<OrderRecord[]> {
  await requireAdmin();
  return (await readJson<StoredOrder[]>(FILE, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(adminOrder);
}
const transitions = ORDER_TRANSITIONS;
export async function updateOrderStatus(id: string, status: OrderStatus, opts: { note?: string; cargo?: { firma: string; takipNo: string }; notify?: boolean } = {}) {
  const admin = await requireAdmin();
  const result = await updateJson<StoredOrder[], OrderRecord | undefined>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order) return { value: all, result: undefined };
    const current = order.status ?? "yeni";
    if (!transitions[current]?.includes(status)) throw new InputError("Bu durum geçişine izin verilmiyor.");
    if (order.submission && order.submission !== "sent") throw new InputError("Önce dış sipariş aktarımını uzlaştırın.");
    if (status !== "iptal" && awaitingPaymentOrder(order)) throw new InputError("Kartla ödeme tamamlanmadı; bu sipariş yalnızca iptal edilebilir.");
    order.status = status;
    if (opts.cargo) order.cargo = opts.cargo;
    // Fulfilment is not proof of payment. Never mark paid from a delivery event.
    order.history = [...(order.history ?? []), { status, at: new Date().toISOString(), note: opts.note, actor: admin.id }];
    if (opts.notify) queueNotification(order, `${order.id}/status/${order.history.length}`, orderStatusMessage(order, status, opts.note));
    return { value: all, result: publicOrder(order) };
  });
  await audit("order.status", admin.id, id);
  return result;
}

/** Operator must independently check the provider/bank; this never retries an external order. */
export async function reconcileOrder(id: string, reference: string, note: string) {
  const admin = await requireFreshAdmin();
  reference = textField(reference, 120, 3); note = textField(note, 500, 10);
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || !order.submission || order.submission === "sent") throw new InputError("Sipariş uzlaştırma beklemiyor.");
    order.submission = "sent";
    order.reconciliation = { actor: admin.id, at: new Date().toISOString(), reference, note };
    order.providerReference = reference;
    queueConfirmation(order);
    return { value: all, result: undefined };
  });
  await audit("order.reconciled", admin.id, id);
}
function queueConfirmation(order: StoredOrder) {
  queueNotification(order, `${order.id}/received`, orderReceivedMessage(order));
  queueNotification(order, `${order.id}/admin`, adminNewOrderMessage(order));
}
export async function recordManualPayment(id: string, total: number, reference: string, note: string) {
  const admin = await requireFreshAdmin();
  reference = textField(reference, 120, 3); note = textField(note, 500, 10);
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || order.status === "iptal" || order.paymentStatus !== "beklemede" || (order.submission && order.submission !== "sent")) throw new InputError("Bu siparişe tahsilat kaydedilemez.");
    if (!Number.isFinite(total) || Math.round(total * 100) !== Math.round(order.total * 100)) throw new InputError("Tahsilat tutarı siparişle eşleşmiyor.");
    order.paymentStatus = "odendi";
    order.paymentEvidence = { actor: admin.id, at: new Date().toISOString(), reference, note };
    return { value: all, result: undefined };
  });
  await audit("order.manual_payment", admin.id, id);
}

function awaitingPaymentOrder(order: StoredOrder) {
  return order.paymentMethod === "iyzico" && order.paymentStatus === "beklemede" && !order.submission && (order.status ?? "yeni") !== "iptal";
}
/** Ödeme sayfası her başlatıldığında yeni token saklanır; callback yalnızca bu token'ı kabul eder. */
export async function attachPaymentToken(id: string, token: string) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || !awaitingPaymentOrder(order)) throw new InputError("Sipariş ödeme beklemiyor.");
    order.paymentToken = token;
    return { value: all, result: undefined };
  });
}
export type PaymentOutcome = { orderId: string; result: "paid" | "already-paid" | "failed" | "mismatch"; payload?: OrderPayload };
/**
 * iyzico sonucu sunucu tarafında sorgulandıktan sonra çağrılır. Tutar, para birimi,
 * sepet kimliği ve token siparişle birebir eşleşmeden ödendi işaretlenmez.
 */
export async function settleIyzicoPayment(token: string, verified: { paymentStatus?: string; fraudStatus?: number; paymentId?: string; paidPrice?: number; currency?: string; basketId?: string }): Promise<PaymentOutcome | undefined> {
  return updateJson<StoredOrder[], PaymentOutcome | undefined>(FILE, [], all => {
    const order = all.find(o => o.paymentToken === token && o.paymentMethod === "iyzico");
    if (!order) return { value: all, result: undefined };
    if (order.paymentStatus === "odendi") return { value: all, result: { orderId: order.id, result: "already-paid" } };
    const now = new Date().toISOString();
    const success = verified.paymentStatus === "SUCCESS" && verified.fraudStatus === 1;
    if (!success) {
      if (verified.fraudStatus === 0 && verified.paymentStatus === "SUCCESS") {
        // iyzico incelemesinde: para çekildi ama onay bekliyor. Siparişi açık bırak, operatör kontrol etsin.
        order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: `iyzico ödeme incelemede (${verified.paymentId ?? "?"})`, actor: "iyzico" }];
        return { value: all, result: { orderId: order.id, result: "mismatch" } };
      }
      return { value: all, result: { orderId: order.id, result: "failed" } };
    }
    const matches = verified.basketId === order.id && verified.currency === "TRY" && Math.round((verified.paidPrice ?? -1) * 100) === Math.round(order.total * 100) && Boolean(verified.paymentId);
    if (!matches) {
      order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: `iyzico tutar/sepet eşleşmedi — elle kontrol edin (${verified.paymentId ?? "?"})`, actor: "iyzico" }];
      return { value: all, result: { orderId: order.id, result: "mismatch" } };
    }
    order.paymentStatus = "odendi";
    order.paymentEvidence = { actor: "iyzico", at: now, reference: verified.paymentId!, note: "iyzico ortak ödeme sayfası, sunucu tarafında doğrulandı" };
    order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: "Kartla ödeme alındı (iyzico)", actor: "iyzico" }];
    order.submission = "pending";
    return { value: all, result: { orderId: order.id, result: "paid", payload: order.providerPayload } };
  });
}
