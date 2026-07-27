// Yerel sipariş kayıtları — "Siparişlerim" sayfası ve ödeme takibi için.
// Asıl sipariş EasyTrade paneline gider; burası üyenin kendi geçmişini görmesi içindir.

import { randomBytes } from "crypto";
import { readJson, writeJson } from "./storage";

export type OrderRecord = {
  id: string;
  userId: string | null; // misafir siparişlerinde null
  customerName: string;
  email: string;
  phone: string;
  addressText: string;
  items: { id: number; name: string; qty: number; price: number }[];
  total: number;
  /** Ödeme yöntemi: iyzico entegrasyonu bağlanana dek "iyzico-bekliyor" */
  paymentMethod: "iyzico" | "iyzico-bekliyor";
  paymentStatus: "odendi" | "beklemede";
  createdAt: string;
};

const FILE = "orders.json";

export async function addOrderRecord(
  input: Omit<OrderRecord, "id" | "createdAt">
): Promise<OrderRecord> {
  const record: OrderRecord = {
    ...input,
    id: `GA-${randomBytes(5).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
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
