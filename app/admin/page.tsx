import { Suspense } from "react";
import AppIcon from "@/components/AppIcon";
import { requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import { getAdminMembers } from "@/lib/admin-data";
import { emailConfigured } from "@/lib/email";
import { paymentConfigError, paymentConfigured, paymentIsSandbox } from "@/lib/payments";
import OrdersBoard from "./OrdersBoard";
import { orderGroup } from "./order-groups";

function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);
}

export default async function AdminSiparislerPage() {
  await requireAdmin();
  const [orders, users] = await Promise.all([getAllOrders(), getAdminMembers()]);

  const groups = orders.map(orderGroup);
  const count = (...g: string[]) => groups.filter((x) => g.includes(x)).length;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const paidThisMonth = orders
    .filter((o) => o.paymentStatus === "odendi" && o.status !== "iptal" && new Date(o.createdAt) >= monthStart)
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "İşlem bekleyen", value: String(count("kontrol", "tahsilat", "hazirlanacak")), icon: "clock", hint: "Sizden aksiyon bekleyen siparişler" },
    { label: "Kargoda", value: String(count("kargoda")), icon: "truck", hint: "Teslim bekleniyor" },
    { label: "Bu ay tahsil edilen", value: formatTL(paidThisMonth), icon: "check", hint: "Ödendi işaretli, iptal hariç" },
    { label: "Üye", value: String(users.length), icon: "users", hint: `${orders.length} sipariş toplam` },
  ];

  const card = paymentConfigured();
  const cardError = paymentConfigError();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5" title={s.hint}>
            <div className="flex items-center gap-2 text-xs text-muted">
              <AppIcon name={s.icon} /> {s.label}
            </div>
            <div className="font-display mt-2 text-2xl font-bold text-accent">{s.value}</div>
            <div className="mt-0.5 text-xs text-muted">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className={`rounded-2xl border px-5 py-3 text-sm leading-relaxed ${card && !cardError && !paymentIsSandbox() ? "border-teal-400/30 bg-teal-400/10 text-teal-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
          <AppIcon name="lock" />{" "}
          {cardError ? (
            <><strong>Kartla ödeme kapalı: yapılandırma hatası.</strong> {cardError}. Canlı anahtarlarla <code>IYZICO_BASE_URL</code>&apos;i silin ya da <code>https://api.iyzipay.com</code> yapın; sandbox anahtarlarıyla <code>https://sandbox-api.iyzipay.com</code> kullanın.</>
          ) : !card ? (
            <><strong>Kartla ödeme kapalı.</strong> Siparişler ödemesiz gelir; tahsilatı siz yapar, panelden &quot;Ödemeyi aldım&quot; ile kaydedersiniz. iyzico&apos;yu açmak için Vercel&apos;e <code>IYZICO_API_KEY</code>, <code>IYZICO_SECRET_KEY</code> ekleyin; canlı/sandbox ortamı anahtardan otomatik seçilir.</>
          ) : paymentIsSandbox() ? (
            <><strong>iyzico test (sandbox) modunda.</strong> Kartla ödeme yalnız yönetici hesabına görünür; müşteriler ödemesiz sipariş verir. Gerçek para çekilmez. Canlıya geçmek için merchant panelindeki canlı anahtarları girin (<code>sandbox-</code> öneki olmayan).</>
          ) : (
            <><strong>iyzico ile kartla ödeme açık.</strong> Ödenen siparişler EasyTrade&apos;e otomatik iletilir.</>
          )}
        </div>
        {!emailConfigured() && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm leading-relaxed text-amber-300">
            <AppIcon name="mail" /> <strong>E-posta gönderimi kapalı.</strong> resend.com&apos;dan alacağınız API anahtarını <code>RESEND_API_KEY</code> olarak tanımlayınca hoş geldin ve sipariş bildirimleri otomatik gönderilir.
          </div>
        )}
      </div>

      <Suspense>
        <OrdersBoard orders={orders} />
      </Suspense>
    </div>
  );
}
