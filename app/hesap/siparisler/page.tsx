import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import {
  getOrdersByUser,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/orders";
import { formatPrice } from "@/lib/easytrade";

const STATUS_COLORS: Record<OrderStatus, string> = {
  yeni: "bg-cyan-500/20 text-cyan-300",
  onaylandi: "bg-blue-500/20 text-blue-300",
  hazirlaniyor: "bg-amber-500/20 text-amber-300",
  kargoda: "bg-violet-500/20 text-violet-300",
  "teslim-edildi": "bg-teal-500/20 text-teal-300",
  iptal: "bg-red-500/20 text-red-300",
};

export default async function SiparislerPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const orders = await getOrdersByUser(session.uid);

  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="font-display mb-5 text-lg font-bold">📦 Siparişlerim</h2>

      {orders.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-muted">
            Henüz siparişiniz bulunmuyor.
          </p>
          <Link
            href="/urunler"
            className="mt-4 inline-block rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-cyan-400/10 pb-3">
                <div>
                  <span className="font-display font-bold">{order.id}</span>
                  <span className="ml-3 text-xs text-muted">
                    {new Date(order.createdAt).toLocaleString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status ?? "yeni"]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status ?? "yeni"]}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.paymentStatus === "odendi"
                        ? "bg-teal-500/20 text-teal-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {order.paymentStatus === "odendi"
                      ? "Ödendi"
                      : "Ödeme Bekleniyor"}
                  </span>
                </div>
              </div>

              {order.cargo?.firma && (
                <div className="mb-3 rounded-xl border border-violet-400/25 bg-violet-400/10 px-4 py-2.5 text-sm text-violet-200">
                  🚚 {order.cargo.firma}
                  {order.cargo.takipNo && (
                    <>
                      {" — Takip No: "}
                      <strong>{order.cargo.takipNo}</strong>
                    </>
                  )}
                </div>
              )}

              <ul className="space-y-1.5 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <Link
                      href={`/urunler/${item.id}`}
                      className="min-w-0 truncate hover:text-cyan-200"
                    >
                      {item.name}
                    </Link>
                    <span className="shrink-0">
                      {item.qty} × {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-cyan-400/10 pt-3">
                <span className="text-xs text-muted">{order.addressText}</span>
                <span className="font-display font-bold text-gradient">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
