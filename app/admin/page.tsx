import { getAllOrders } from "@/lib/orders";
import { readJson } from "@/lib/storage";
import type { User } from "@/lib/auth";
import { emailConfigured } from "@/lib/email";
import OrderCard from "./OrderCard";

export default async function AdminSiparislerPage() {
  const [orders, users] = await Promise.all([
    getAllOrders(),
    readJson<User[]>("users.json", []),
  ]);

  const active = orders.filter(
    (o) =>
      (o.status ?? "yeni") !== "teslim-edildi" &&
      (o.status ?? "yeni") !== "iptal"
  );
  const shipped = orders.filter((o) => o.status === "kargoda");

  const stats = [
    { label: "Toplam Sipariş", value: orders.length, emoji: "📦" },
    { label: "Aktif Sipariş", value: active.length, emoji: "⏳" },
    { label: "Kargoda", value: shipped.length, emoji: "🚚" },
    { label: "Üye Sayısı", value: users.length, emoji: "👥" },
  ];

  return (
    <div className="space-y-6">
      {/* Özet kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-2xl">{s.emoji}</div>
            <div className="font-display mt-1 text-2xl font-bold text-gradient">
              {s.value}
            </div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {!emailConfigured() && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-3.5 text-sm leading-relaxed text-amber-300">
          ⚠ <strong>E-posta gönderimi kapalı.</strong> resend.com'dan alacağınız
          API anahtarını <code>RESEND_API_KEY</code> olarak tanımlayınca hoş
          geldin ve sipariş bildirimleri otomatik gönderilmeye başlar.
        </div>
      )}

      {/* Siparişler */}
      <section>
        <h2 className="font-display mb-4 text-lg font-bold">
          Siparişler{" "}
          <span className="text-sm font-normal text-muted">
            ({orders.length})
          </span>
        </h2>
        {orders.length === 0 ? (
          <div className="glass rounded-3xl px-6 py-14 text-center text-sm text-muted">
            Henüz sipariş yok.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
