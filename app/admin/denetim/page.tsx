import AppIcon from "@/components/AppIcon";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAdminMembers } from "@/lib/admin-data";
import {
  ACTIVITY_ICONS,
  ACTIVITY_LABELS,
  getActivities,
  type ActivityType,
} from "@/lib/activity";

export const metadata = { title: "Denetim Kaydı | Gri Akvaryum" };

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "urun-goruntuleme", label: "Ürün Görüntüleme" },
  { value: "sepete-ekleme", label: "Sepete Ekleme" },
  { value: "siparis", label: "Sipariş" },
  { value: "giris", label: "Giriş" },
  { value: "kayit", label: "Kayıt" },
];

type SearchParams = Promise<{ uye?: string; tur?: string }>;

export default async function AdminDenetimPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const userId = params.uye || undefined;
  const type = TYPE_OPTIONS.some((t) => t.value === params.tur)
    ? (params.tur as ActivityType)
    : undefined;

  const [events, users] = await Promise.all([
    getActivities({ userId, type, limit: 150 }),
    getAdminMembers(),
  ]);

  const activeUser = users.find((u) => u.id === userId);

  const filterUrl = (opts: { uye?: string; tur?: string }) => {
    const p = new URLSearchParams();
    if (opts.uye) p.set("uye", opts.uye);
    if (opts.tur) p.set("tur", opts.tur);
    const qs = p.toString();
    return qs ? `/admin/denetim?${qs}` : "/admin/denetim";
  };

  return (
    <div className="space-y-5">
      {/* Filtreler */}
      <div className="glass space-y-3 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Olay Türü:
          </span>
          <Link
            href={filterUrl({ uye: userId })}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              !type
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
                : "glass text-muted hover:text-foreground"
            }`}
          >
            Tümü
          </Link>
          {TYPE_OPTIONS.map((t) => (
            <Link
              key={t.value}
              href={filterUrl({ uye: userId, tur: t.value })}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                type === t.value
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
                  : "glass text-muted hover:text-foreground"
              }`}
            >
              <AppIcon name={ACTIVITY_ICONS[t.value]} /> {t.label}
            </Link>
          ))}
        </div>

        {activeUser && (
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-200">
              <AppIcon name="user" /> {activeUser.name} ({activeUser.email})
            </span>
            <Link
              href={filterUrl({ tur: type })}
              className="text-xs text-muted hover:text-foreground"
            >
              <AppIcon name="close" /> Üye filtresini kaldır
            </Link>
          </div>
        )}
      </div>

      {/* Olay akışı */}
      {events.length === 0 ? (
        <div className="glass rounded-3xl px-6 py-14 text-center text-sm text-muted">
          Bu filtreyle eşleşen aktivite kaydı yok. Üyeler sitede gezindikçe
          (ürün görüntüleme, sepete ekleme, sipariş...) kayıtlar burada birikecek.
        </div>
      ) : (
        <div className="glass divide-y divide-cyan-400/5 rounded-2xl">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3 text-sm"
            >
              <span className="text-lg"><AppIcon name={ACTIVITY_ICONS[e.type]} /></span>
              <Link
                href={`/admin/denetim?uye=${e.userId}`}
                className="font-semibold text-cyan-200 hover:text-cyan-100"
              >
                {e.userName}
              </Link>
              <span className="text-muted">{ACTIVITY_LABELS[e.type]}</span>
              {e.productName && (
                <>
                  {e.productId ? (
                    <Link
                      href={`/urunler/${e.productId}`}
                      className="font-medium hover:text-cyan-200"
                    >
                      {e.productName}
                    </Link>
                  ) : (
                    <span className="font-medium">{e.productName}</span>
                  )}
                  {e.qty && e.qty > 1 && (
                    <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-xs text-cyan-200">
                      {e.qty} adet
                    </span>
                  )}
                </>
              )}
              {e.detail && <span className="text-muted">{e.detail}</span>}
              <span className="ml-auto whitespace-nowrap text-xs text-muted">
                {new Date(e.at).toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
