// Yerel sipariş kayıtları — "Siparişlerim", admin paneli ve kargo takibi için.
// Asıl sipariş EasyTrade paneline de gider; buradaki kayıt durum yönetimi içindir.
// Tip ve sabitler ./order-types içinde (istemci bileşenleri oradan alır).

import { randomBytes } from "crypto";
import { readJson, writeJson } from "./storage";
import type { OrderRecord, OrderStatus } from "./order-types";

export {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
} from "./order-types";

const FILE = "orders.json";

export async function addOrderRecord(
  input: Omit<OrderRecord, "id" | "createdAt" | "status" | "history">
): Promise<OrderRecord> {
  const now = new Date().toISOString();
  const record: OrderRecord = {
    ...input,
    id: `GA-${randomBytes(5).toString("hex").toUpperCase()}`,
    status: "yeni",
    history: [{ status: "yeni", at: now }],
    createdAt: now,
  };
  const all = await readJson<OrderRecord[]>(FILE, []);
  all.push(record);
  await writeJson(FILE, all);
  return record;
}

export async function getOrdersByUser(userId: string): Promise<OrderRecord[]> {
  const all = await readJson<OrderRecord[]>(FILE, []);
  return all
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  const all = await readJson<OrderRecord[]>(FILE, []);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string): Promise<OrderRecord | undefined> {
  const all = await readJson<OrderRecord[]>(FILE, []);
  return all.find((o) => o.id === id);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  opts: { note?: string; cargo?: { firma: string; takipNo: string } } = {}
): Promise<OrderRecord | undefined> {
  const all = await readJson<OrderRecord[]>(FILE, []);
  const order = all.find((o) => o.id === id);
  if (!order) return undefined;

  order.status = status;
  if (opts.cargo?.firma || opts.cargo?.takipNo) {
    order.cargo = opts.cargo;
  }
  if (status === "teslim-edildi") order.paymentStatus = "odendi";
  order.history = [
    ...(order.history ?? []),
    { status, at: new Date().toISOString(), note: opts.note || undefined },
  ];

  await writeJson(FILE, all);
  return order;
}
