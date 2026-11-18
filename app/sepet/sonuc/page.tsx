import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import { getCustomerOrder } from "@/lib/orders";
import { customerOrderLabel, orderView } from "@/lib/order-presentation";
import { formatPrice } from "@/lib/product-display";
import { ORDER_STATUS_LABELS } from "@/lib/order-types";
import ClearCart from "./ClearCart";
import PaymentActions from "./PaymentActions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const, title: "Sipariş ve ödeme durumu | Gri Akvaryum" };

export default async function OdemeSonucPage({ searchParams }: { searchParams: Promise<{ siparis?: string; access?: string; durum?: string }> }) {
  const params = await searchParams;
  const id = typeof params.siparis === "string" ? params.siparis : "";
  const access = typeof params.access === "string" ? params.access : undefined;
  const { order, unavailable } = await getCustomerOrder(id, access).then(order => ({ order, unavailable: false }), () => ({ order: undefined, unavailable: true }));
  const view = order ? orderView(order) : { tone: "pending", icon: "info", title: unavailable ? "Sipariş durumu şu anda okunamıyor" : "Sipariş durumuna erişilemiyor", text: unavailable ? "Geçici bir bağlantı sorunu var. Yeniden ödeme yapmadan bu sayfayı yenileyin veya mağazamızla iletişime geçin." : "Sipariş e-postanızdaki güvenli bağlantıyı kullanın veya siparişi verdiğiniz hesaba giriş yapın. Bu ekran ödeme onayı değildir." };
  const paid = order?.paymentStatus === "odendi" && !order.paymentSandbox;
  const subtotal = order?.items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0) ?? 0;
  return <>
    <Navbar />
    <main id="main-content" className="store-container receipt-page">
      {order && (paid || order.status === "iptal") && <ClearCart orderId={order.id} items={order.items} cancelled={order.status === "iptal"} />}
      <div className="receipt-layout">
        <section className={`receipt-status receipt-${view.tone}`} aria-labelledby="receipt-title">
          <div className="receipt-icon" aria-hidden="true"><AppIcon name={view.icon} /></div>
          <h1 id="receipt-title">{view.title}</h1>
          <p className="receipt-description">{view.text}</p>
          {order && <>
            <dl className="receipt-reference"><div><dt>Sipariş numarası</dt><dd>{order.id}</dd></div><div><dt>Sipariş durumu</dt><dd>{customerOrderLabel(order)}</dd></div></dl>
            {order.status !== "iptal" && paid && order.submission === "sent" && <ol className="receipt-progress" aria-label="Sipariş aşamaları">
              {(["onaylandi", "hazirlaniyor", "kargoda", "teslim-edildi"] as const).map((status, index, steps) => {
                const current = steps.indexOf(order.status as typeof status);
                return <li key={status} data-complete={index <= current} aria-current={status === order.status ? "step" : undefined}><span>{index + 1}</span>{ORDER_STATUS_LABELS[status]}</li>;
              })}
            </ol>}
            <PaymentActions id={order.id} access={access} canPay={order.paymentMethod === "iyzico" && order.status !== "iptal" && !order.paymentSandbox && (order.paymentStatus === "beklemede" || order.paymentStatus === "basarisiz")} />
          </>}
          <div className="receipt-links"><Link href="/hesap/siparisler">Siparişlerim</Link><Link href="/iletisim">Mağazayla iletişim</Link><Link href="/urunler">Alışverişe devam et</Link></div>
        </section>
        {order && <aside className="receipt-summary" aria-label="Sipariş özeti">
          <div className="receipt-summary-heading"><h2>Sipariş özeti</h2><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" })}</time></div>
          <ul className="receipt-items">{order.items.map(item => <li key={item.id}><div><Link href={`/urunler/${item.id}`}>{item.name}</Link><span>{item.qty} adet × {formatPrice(item.price)}</span></div><strong>{formatPrice(item.price * item.qty)}</strong></li>)}</ul>
          <dl className="receipt-totals"><div><dt>Ürünler</dt><dd>{formatPrice(subtotal / 100)}</dd></div><div><dt>Kargo</dt><dd>{order.shippingFee === 0 ? "Ücretsiz" : order.shippingFee === undefined ? "Sipariş toplamına dahil" : formatPrice(order.shippingFee)}</dd></div><div className="receipt-total"><dt>{paid ? "Ödenen toplam" : "Toplam tutar"}</dt><dd>{formatPrice(order.total)}</dd></div></dl>
          <div className="receipt-delivery"><h3>Teslimat adresi</h3><p><strong>{order.customerName}</strong><br />{order.addressText}</p></div>
          {order.cargo && <div className="receipt-delivery"><h3>Kargo takibi</h3><p>{order.cargo.firma}<br />Takip numarası: <strong>{order.cargo.takipNo}</strong></p></div>}
          <p className="receipt-footnote"><AppIcon name="lock" /> Kart bilgileriniz mağazamızda saklanmaz.</p>
        </aside>}
      </div>
    </main>
    <Footer />
  </>;
}
