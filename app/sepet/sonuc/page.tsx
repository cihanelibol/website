import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import ClearCart from "./ClearCart";

export const metadata = { robots: { index: false, follow: false }, title: "Ödeme Sonucu | Gri Akvaryum" };

const VIEWS = {
  tamam: { icon: "circle-check", title: "Ödemeniz alındı, siparişiniz oluşturuldu", text: "Teşekkür ederiz! Siparişiniz hazırlanmak üzere mağazamıza iletildi. Kargoya verildiğinde e-posta ile bilgilendireceğiz." },
  basarisiz: { icon: "warning", title: "Ödeme tamamlanmadı", text: "Kartınızdan tutar çekilmedi. Sepetiniz korunuyor; tekrar deneyebilir veya farklı bir kart kullanabilirsiniz." },
  kontrol: { icon: "clock", title: "Ödemeniz kontrol ediliyor", text: "İşleminiz alındı ancak otomatik olarak doğrulanamadı. Tekrar ödeme yapmayın; mağazamız kısa süre içinde sizinle iletişime geçecek." },
  hata: { icon: "warning", title: "Ödeme sonucu okunamadı", text: "Kartınızdan tutar çekildiyse tekrar ödeme yapmayın ve mağazamızla iletişime geçin." },
} as const;

export default async function OdemeSonucPage({ searchParams }: { searchParams: Promise<{ durum?: string; siparis?: string }> }) {
  const { durum, siparis } = await searchParams;
  const key = (durum && durum in VIEWS ? durum : "hata") as keyof typeof VIEWS;
  const view = VIEWS[key];
  const orderId = siparis && /^GA-[A-F0-9]{24}$/.test(siparis) ? siparis : undefined;
  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container min-h-svh pb-20 pt-24">
        {key === "tamam" && <ClearCart />}
        <div role="status" className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
          <span className="text-6xl"><AppIcon name={view.icon} /></span>
          <h1 className="font-display text-2xl font-bold">{view.title}</h1>
          <p className="text-sm leading-relaxed text-muted">{view.text}</p>
          {orderId && <p className="text-sm">Sipariş numaranız: <strong className="font-mono">{orderId}</strong></p>}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {key === "basarisiz"
              ? <Link href="/sepet" className="store-button">Sepete dön ve tekrar dene</Link>
              : <Link href="/urunler" className="store-button">Alışverişe devam et</Link>}
            <Link href="/hesap/siparisler" className="glass rounded-xl px-6 py-3 text-sm font-semibold">Siparişlerim</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
