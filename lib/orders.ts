import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { orderCookieName, validOrderAccess } from "./order-access";
import { readJson, updateJson } from "./storage";
import { getSessionUser, requireAdmin, requireFreshAdmin } from "./auth";
import { audit, InputError, textField } from "./security";
import { ORDER_TRANSITIONS, type OrderRecord, type OrderStatus } from "./order-types";
import type { OrderPayload } from "./easytrade";
import { queueNotification, type Notification } from "./order-outbox";
import { orderReceivedMessage, adminNewOrderMessage, orderStatusMessage } from "./email";
export { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, type OrderRecord, type OrderStatus } from "./order-types";
const FILE = "orders.json";
type PaymentAttempt = { state: "initializing" | "ready" | "unknown"; startedAt: number; token?: string; url?: string; expiresAt?: number };
type StoredOrder = OrderRecord & { notifications?: Notification[]; requestKey?: string; fingerprint?: string; providerPayload?: OrderPayload; paymentToken?: string; paymentTokens?: string[]; paymentAttempt?: PaymentAttempt; forwardingStarted?: boolean; paymentCheckedAt?: number };
function publicOrder(record: StoredOrder): OrderRecord {
  const { paymentEvidence, reconciliation, ...order } = adminOrder(record);
  void paymentEvidence; void reconciliation;
  return order;
}
/** Yönetici görünümü: ödeme/uzlaştırma kanıtı dahil, iç anahtarlar hariç. */
function adminOrder(record: StoredOrder): OrderRecord {
  const { requestKey, fingerprint, notifications, providerPayload, paymentToken, paymentTokens, paymentAttempt, forwardingStarted, paymentCheckedAt, ...order } = record;
  void requestKey; void fingerprint; void providerPayload; void paymentToken;
  void notifications; void paymentTokens; void paymentAttempt; void forwardingStarted; void paymentCheckedAt;
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
      if (submission === "sent") confirmPaidOrder(order);
    }
    return { value: all, result: undefined };
  });
}
export async function getOrdersByUser(userId: string): Promise<OrderRecord[]> {
  const session = await getSessionUser();
  if (!session || session.uid !== userId) throw new InputError("Yetkiniz yok.");
  return (await readJson<StoredOrder[]>(FILE, [])).filter(o => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicOrder);
}
export async function getCustomerOrder(id: string, access?: string): Promise<OrderRecord | undefined> {
  if (!/^GA-[A-F0-9]{24}$/.test(id)) return;
  const authorized = validOrderAccess(id, access) || validOrderAccess(id, (await cookies()).get(orderCookieName(id))?.value);
  const session = authorized ? undefined : await getSessionUser();
  if (!authorized && !session) return;
  const order = (await readJson<StoredOrder[]>(FILE, [])).find(o => o.id === id);
  if (!order || (!authorized && order.userId !== session?.uid)) return;
  return publicOrder(order);
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
    if (status !== "iptal" && (order.paymentStatus !== "odendi" || order.paymentSandbox)) throw new InputError("Gerçek ödeme doğrulanmadan sipariş hazırlığa alınamaz.");
    if (status === "kargoda" && (!opts.cargo?.firma?.trim() || !opts.cargo?.takipNo?.trim())) throw new InputError("Kargo firması ve takip numarası gerekli.");
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
    confirmPaidOrder(order);
    return { value: all, result: undefined };
  });
  await audit("order.reconciled", admin.id, id);
}
function queueConfirmation(order: StoredOrder) {
  if (order.paymentStatus !== "odendi" || order.submission !== "sent" || order.paymentSandbox || order.status === "iptal") return;
  queueNotification(order, `${order.id}/received`, orderReceivedMessage(order));
  queueNotification(order, `${order.id}/admin`, adminNewOrderMessage(order));
}
function confirmPaidOrder(order: StoredOrder) {
  if (order.paymentStatus !== "odendi" || order.paymentSandbox || order.status === "iptal") return;
  if (!order.status || order.status === "yeni") {
    order.status = "onaylandi";
    order.history = [...(order.history ?? []), { status: "onaylandi", at: new Date().toISOString(), note: "Ödeme doğrulandı ve sipariş aktarımı tamamlandı." }];
  }
  queueConfirmation(order);
}
export async function recordManualPayment(id: string, total: number, reference: string, note: string) {
  const admin = await requireFreshAdmin();
  reference = textField(reference, 120, 3); note = textField(note, 500, 10);
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || order.paymentMethod !== "iyzico-bekliyor" || order.status === "iptal" || order.paymentStatus !== "beklemede" || (order.submission && order.submission !== "sent")) throw new InputError("Bu siparişe tahsilat kaydedilemez.");
    if (!Number.isFinite(total) || Math.round(total * 100) !== Math.round(order.total * 100)) throw new InputError("Tahsilat tutarı siparişle eşleşmiyor.");
    order.paymentStatus = "odendi";
    order.paymentEvidence = { actor: admin.id, at: new Date().toISOString(), reference, note };
    if (order.submission === "sent") confirmPaidOrder(order);
    return { value: all, result: undefined };
  });
  await audit("order.manual_payment", admin.id, id);
}

function awaitingPaymentOrder(order: StoredOrder) {
  return order.paymentMethod === "iyzico" && order.paymentStatus !== "odendi" && !order.submission && (order.status ?? "yeni") !== "iptal";
}
/** Atomic claim prevents two tabs/retries from opening independent payment sessions. */
export async function claimPaymentAttempt(id: string): Promise<{ url?: string }> {
  return updateJson<StoredOrder[], { url?: string }>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || !awaitingPaymentOrder(order)) throw new InputError("Sipariş ödeme beklemiyor.");
    const attempt = order.paymentAttempt;
    if (order.paymentStatus === "kontrol") throw new InputError("Ödeme sonucu kontrol bekliyor. Yeniden ödeme yapmayın; sipariş durumunu kontrol edin.");
    if (order.paymentStatus !== "basarisiz" && attempt) {
      if (attempt.state === "ready" && attempt.url && (attempt.expiresAt ?? 0) > Date.now()) return { value: all, result: { url: attempt.url } };
      throw new InputError("Ödeme işleminiz sürüyor veya kontrol bekliyor. Sipariş durumunu kontrol edin.");
    }
    // Old records with an unresolved token must be checked before another charge.
    if (order.paymentToken && !attempt && order.paymentStatus !== "basarisiz") throw new InputError("Önce mevcut ödeme sonucunu kontrol edin.");
    order.paymentAttempt = { state: "initializing", startedAt: Date.now() };
    order.paymentStatus = "beklemede";
    return { value: all, result: {} };
  });
}

export async function attachPaymentToken(id: string, token: string, url?: string, expiresIn = 1800) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || !awaitingPaymentOrder(order)) throw new InputError("Sipariş ödeme beklemiyor.");
    order.paymentTokens = [...new Set([...(order.paymentTokens ?? []), ...(order.paymentToken ? [order.paymentToken] : []), token])];
    order.paymentToken = token;
    order.paymentAttempt = { state: "ready", startedAt: Date.now(), token, url, expiresAt: Date.now() + Math.min(1800, Math.max(1, expiresIn)) * 1000 };
    return { value: all, result: undefined };
  });
}
export async function markPaymentUncertain(id: string) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (order && order.paymentStatus !== "odendi") {
      order.paymentCheckedAt = Date.now();
      order.paymentStatus = "kontrol";
      if (order.paymentAttempt?.state === "initializing") order.paymentAttempt.state = "unknown";
    }
    return { value: all, result: undefined };
  });
}
export async function markPaymentStartRejected(id: string) {
  await updateJson<StoredOrder[], void>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (order?.paymentAttempt?.state === "initializing" && order.paymentStatus !== "odendi") order.paymentStatus = "basarisiz";
    return { value: all, result: undefined };
  });
}

export async function getPaymentCheck(id: string) {
  const order = (await readJson<StoredOrder[]>(FILE, [])).find(o => o.id === id && o.paymentMethod === "iyzico");
  return order ? { token: order.paymentToken, paid: order.paymentStatus === "odendi" } : undefined;
}

export async function getPaymentOrderId(token: string) {
  return (await readJson<StoredOrder[]>(FILE, [])).find(o => o.paymentToken === token || o.paymentTokens?.includes(token))?.id;
}
export async function getPaymentRestart(id: string) {
  const order = (await readJson<StoredOrder[]>(FILE, [])).find(o => o.id === id);
  return order?.providerPayload ? { order: publicOrder(order), address: order.providerPayload.shipping_address } : undefined;
}

export async function claimOrderForward(id: string) {
  return updateJson<StoredOrder[], boolean>(FILE, [], all => {
    const order = all.find(o => o.id === id);
    if (!order || order.paymentStatus !== "odendi" || order.paymentSandbox || order.status === "iptal" || order.submission !== "pending" || order.forwardingStarted) return { value: all, result: false };
    order.forwardingStarted = true;
    return { value: all, result: true };
  });
}

export async function paymentCheckCandidates(limit = 5) {
  return (await readJson<StoredOrder[]>(FILE, [])).filter(o => o.paymentMethod === "iyzico" && o.paymentStatus !== "odendi" && o.paymentStatus !== "basarisiz" && o.paymentToken && (o.paymentStatus === "kontrol" || (o.paymentAttempt?.expiresAt ?? 0) <= Date.now())).sort((a, b) => (a.paymentCheckedAt ?? 0) - (b.paymentCheckedAt ?? 0)).slice(0, limit).map(o => ({ id: o.id, token: o.paymentToken! }));
}
export type PaymentOutcome = { orderId: string; result: "paid" | "already-paid" | "failed" | "mismatch"; payload?: OrderPayload };
/**
 * iyzico sonucu sunucu tarafında sorgulandıktan sonra çağrılır. Tutar, para birimi,
 * sepet kimliği ve token siparişle birebir eşleşmeden ödendi işaretlenmez.
 */
export async function settleIyzicoPayment(token: string, verified: { status: string; paymentStatus?: string; fraudStatus?: number; paymentId?: string; paidPrice?: number; currency?: string; basketId?: string }): Promise<PaymentOutcome | undefined> {
  return updateJson<StoredOrder[], PaymentOutcome | undefined>(FILE, [], all => {
    const order = all.find(o => (o.paymentToken === token || o.paymentTokens?.includes(token)) && o.paymentMethod === "iyzico");
    if (!order) return { value: all, result: undefined };
    if (order.paymentStatus === "odendi") return { value: all, result: { orderId: order.id, result: "already-paid" } };
    order.paymentCheckedAt = Date.now();
    const now = new Date().toISOString();
    const success = verified.status === "success" && verified.paymentStatus === "SUCCESS" && verified.fraudStatus === 1;
    if (!success) {
      if (verified.status !== "success" || verified.paymentStatus !== "FAILURE") {
        // iyzico incelemesinde: para çekildi ama onay bekliyor. Siparişi açık bırak, operatör kontrol etsin.
        order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: `iyzico ödeme incelemede (${verified.paymentId ?? "?"})`, actor: "iyzico" }];
        if (order.paymentToken === token) order.paymentStatus = "kontrol";
        return { value: all, result: { orderId: order.id, result: "mismatch" } };
      }
      if (order.paymentToken === token) order.paymentStatus = "basarisiz";
      return { value: all, result: { orderId: order.id, result: "failed" } };
    }
    const matches = verified.basketId === order.id && verified.currency === "TRY" && Math.round((verified.paidPrice ?? -1) * 100) === Math.round(order.total * 100) && Boolean(verified.paymentId);
    if (!matches) {
      order.paymentStatus = "kontrol";
      order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: `iyzico tutar/sepet eşleşmedi — elle kontrol edin (${verified.paymentId ?? "?"})`, actor: "iyzico" }];
      return { value: all, result: { orderId: order.id, result: "mismatch" } };
    }
    order.paymentStatus = "odendi";
    order.paymentEvidence = { actor: "iyzico", at: now, reference: verified.paymentId!, note: "iyzico ortak ödeme sayfası, sunucu tarafında doğrulandı" };
    order.history = [...(order.history ?? []), { status: order.status ?? "yeni", at: now, note: "Kartla ödeme alındı (iyzico)", actor: "iyzico" }];
    // A late capture on a cancelled order requires operator/refund review, never fulfilment.
    if (order.status === "iptal" || order.paymentSandbox) return { value: all, result: { orderId: order.id, result: "paid" } };
    order.submission = "pending";
    return { value: all, result: { orderId: order.id, result: "paid", payload: order.providerPayload } };
  });
}
