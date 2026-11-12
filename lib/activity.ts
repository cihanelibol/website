import { requireAdmin } from "./auth";
import "server-only";
// Üye denetim kaydı (aktivite izleme): ürün görüntüleme, sepete ekleme vb.
// Yalnızca giriş yapmış üyeler için tutulur; misafir hareketleri kaydedilmez.

import { randomBytes } from "crypto";
import { readJson, updateJson } from "./storage";

export type ActivityType =
  | "urun-goruntuleme"
  | "sepete-ekleme"
  | "siparis"
  | "giris"
  | "kayit";

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  "urun-goruntuleme": "Ürün görüntüledi",
  "sepete-ekleme": "Sepete ekledi",
  siparis: "Sipariş verdi",
  giris: "Giriş yaptı",
  kayit: "Üye oldu",
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  "urun-goruntuleme": "eye",
  "sepete-ekleme": "cart",
  siparis: "package",
  giris: "key",
  kayit: "user",
};

export type ActivityEvent = {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  /** Ürünle ilgili olaylarda dolu */
  productId?: number;
  productName?: string;
  qty?: number;
  /** Sipariş olaylarında sipariş no / tutar gibi ek bilgi */
  detail?: string;
  at: string; // ISO
};

const FILE = "activity.json";
// Kayıt sınırı: en yeni N olay tutulur, eskiler otomatik düşer
const MAX_EVENTS = 2000;

export async function addActivity(
  input: Omit<ActivityEvent, "id" | "at">
): Promise<void> {
  const event: ActivityEvent = {
    ...input,
    id: randomBytes(6).toString("hex"),
    at: new Date().toISOString(),
  };
  await updateJson<ActivityEvent[], void>(FILE, [], all => ({ value: [...all.filter(e => Date.parse(e.at) > Date.now() - 30 * 86400_000), event].slice(-MAX_EVENTS), result: undefined }));
}

export async function getActivities(filter: {
  userId?: string;
  type?: ActivityType;
  limit?: number;
} = {}): Promise<ActivityEvent[]> {
  await requireAdmin();
  const all = await readJson<ActivityEvent[]>(FILE, []);
  let list = all;
  if (filter.userId) list = list.filter((e) => e.userId === filter.userId);
  if (filter.type) list = list.filter((e) => e.type === filter.type);
  return list
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, filter.limit ?? 200);
}

/** Üye başına son aktivite (üye yönetimi tablosu için) */
export async function getLastActivityByUser(): Promise<
  Map<string, ActivityEvent>
> {
  await requireAdmin();
  const all = await readJson<ActivityEvent[]>(FILE, []);
  const map = new Map<string, ActivityEvent>();
  for (const e of all) {
    const current = map.get(e.userId);
    if (!current || e.at > current.at) map.set(e.userId, e);
  }
  return map;
}
