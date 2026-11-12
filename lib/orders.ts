import "server-only";
import { randomBytes } from "node:crypto";
import { readJson, updateJson } from "./storage";
import { getSessionUser, requireAdmin, requireFreshAdmin } from "./auth";
import { audit, InputError, textField } from "./security";
import type { OrderRecord, OrderStatus } from "./order-types";
import { queueNotification, type Notification } from "./order-outbox";
import { orderReceivedMessage, adminNewOrderMessage, orderStatusMessage } from "./email";
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderRecord, type OrderStatus } from "./order-types";
const FILE = "orders.json";
type StoredOrder = OrderRecord & { notifications?: Notification[]; requestKey?: string; fingerprint?: string; submission?: "pending" | "sent" | "unknown" };
function publicOrder(record: StoredOrder): OrderRecord {
  const { requestKey, fingerprint, paymentEvidence, reconciliation, notifications, ...order } = record;
  void requestKey; void fingerprint; void paymentEvidence; void reconciliation; void notifications;
  return order;
}
export async function reserveOrder(input: Omit<OrderRecord, "id" | "createdAt" | "status" | "history">, requestKey: string, fingerprint: string) {
  return updateJson<StoredOrder[], { order: OrderRecord; created: boolean; submission: string }>(FILE, [], all => {
    const existing = all.find(o => o.requestKey === requestKey);
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new InputError("Bu işlem kimliği farklı bir siparişte kullanıldı.");
      return { value: all, result: { order: publicOrder(existing), created: false, submission: existing.submission ?? "unknown" } };
    }
    const now = new Date().toISOString();
    const record: StoredOrder = { ...input, id: `GA-${randomBytes(12).toString("hex").toUpperCase()}`, status: "yeni", history: [{ status: "yeni", at: now }], createdAt: now, requestKey, fingerprint, submission: "pending" };
    all.push(record);
    return { value: all, result: { order: publicOrder(record), created: true, submission: "pending" } };
  });
}
export async function markOrderSubmission(id: string, submission: "sent" | "unknown", receipt?: { reference: string; total: number; currency: string }) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (order && order.submission === "pending") {
      if (submission === "sent" && (!receipt?.reference || receipt.currency !== "TRY" || Math.round(receipt.total * 100) !== Math.round(order.total * 100))) throw new Error("Verified external receipt required");
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
  return (await readJson<StoredOrder[]>(FILE, [])).filter(o => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicOrder);
}
export async function getAllOrders(): Promise<OrderRecord[]> {
  await requireAdmin();
  return (await readJson<StoredOrder[]>(FILE, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicOrder);
}
const transitions: Record<OrderStatus, OrderStatus[]> = { yeni: ["onaylandi", "iptal"], onaylandi: ["hazirlaniyor", "iptal"], hazirlaniyor: ["kargoda", "iptal"], kargoda: ["teslim-edildi"], "teslim-edildi": [], iptal: [] };
export async function updateOrderStatus(id: string, status: OrderStatus, opts: { note?: string; cargo?: { firma: string; takipNo: string }; notify?: boolean } = {}) {
  const admin = await requireAdmin();
  const result = await updateJson<StoredOrder[], OrderRecord | undefined>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order) return { value: all, result: undefined };
    const current = order.status ?? "yeni";
    if (!transitions[current]?.includes(status)) throw new InputError("Bu durum geçişine izin verilmiyor.");
    if (order.submission && order.submission !== "sent") throw new InputError("Önce dış sipariş aktarımını uzlaştırın.");
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
