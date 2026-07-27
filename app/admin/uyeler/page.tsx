import Link from "next/link";
import { readJson } from "@/lib/storage";
import type { User } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import {
  ACTIVITY_EMOJIS,
  ACTIVITY_LABELS,
  getLastActivityByUser,
} from "@/lib/activity";
import { formatPrice } from "@/lib/easytrade";

export const metadata = { title: "Üye Yönetimi | Gri Akvaryum" };

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export default async function AdminUyelerPage() {
  const [users, orders, lastActivity] = await Promise.all([
    readJson<User[]>("users.json", []),
    getAllOrders(),
    getLastActivityByUser(),
  ]);

  const sorted = [...users].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const orderStats = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    if (!o.userId) continue;
    const s = orderStats.get(o.userId) ?? { count: 0, total: 0 };
    s.count += 1;
    s.total += o.total;
    orderStats.set(o.userId, s);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display mb-4 text-lg font-bold">
          Üyeler{" "}
          <span className="text-sm font-normal text-muted">
            ({users.length})
          </span>
        </h2>

        {users.length === 0 ? (
          <div className="glass rounded-3xl px-6 py-14 text-center text-sm text-muted">
            Henüz üye yok.
          </div>
        ) : (
          <div className="glass overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead>
                <tr className="border-b border-cyan-400/10 text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-3">Üye</th>
                  <th className="px-5 py-3">İletişim</th>
                  <th className="px-5 py-3">Kayıt</th>
                  <th className="px-5 py-3">Sipariş</th>
                  <th className="px-5 py-3">Toplam Harcama</th>
                  <th className="px-5 py-3">Son Aktivite</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((u) => {
                  const stats = orderStats.get(u.id);
                  const last = lastActivity.get(u.id);
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-cyan-400/5 align-top"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted">
                          {u.marketingConsent
                            ? "✓ Pazarlama onayı var"
                            : "Pazarlama onayı yok"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted">
                        <div>{u.email}</div>
                        <div className="text-xs">{u.phone ?? "—"}</div>
                      </td>
                      <td className="px-5 py-3.5 text-muted">
                        {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-5 py-3.5">
                        {stats ? (
                          <span className="font-semibold text-cyan-200">
                            {stats.count}
                          </span>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {stats ? (
                          <span className="font-semibold text-gradient">
                            {formatPrice(stats.total)}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-muted">
                        {last ? (
                          <div>
                            <div className="text-foreground">
                              {ACTIVITY_EMOJIS[last.type]}{" "}
                              {ACTIVITY_LABELS[last.type]}
                              {last.productName && (
                                <span className="text-muted">
                                  {" "}
                                  · {last.productName.slice(0, 28)}
                                  {last.productName.length > 28 && "..."}
                                </span>
                              )}
                            </div>
                            <div className="text-xs">{timeAgo(last.at)}</div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/denetim?uye=${u.id}`}
                          className="whitespace-nowrap rounded-lg border border-cyan-400/25 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/10"
                        >
                          🕵️ Denetim
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
