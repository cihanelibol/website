import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CONTACT } from "@/lib/site";
import { breadcrumbs, pageMetadata, storeSchema } from "@/lib/seo";

export const metadata = pageMetadata("Eminönü Akvaryum Mağazası | Gri Akvaryum, Fatih", "Eminönü Çiçekçiler Sitesi'ndeki Gri Akvaryum & Balık Galerisi'ni ziyaret edin. Mağaza adresi, çalışma saatleri, yol tarifi, telefon ve akvaryum ürünleri.", "/magaza/eminonu");

export default function StorePage() {
  return <>
    <Navbar />
    <JsonLd data={[storeSchema, breadcrumbs([{ name: "Ana Sayfa", path: "/" }, { name: "Eminönü Mağazamız", path: "/magaza/eminonu" }])]} />
    <main id="main-content" className="store-container pb-20 pt-28">
      <nav aria-label="Sayfa yolu" className="mb-6 text-sm text-muted"><Link href="/">Ana Sayfa</Link> / Eminönü Mağazamız</nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Eminönü’nde akvaryum ve balık dünyası</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">Gri Akvaryum &amp; Balık Galerisi, İstanbul Fatih’te, Eminönü Çiçekçiler Sitesi’nde. Balıkları yerinde görün; akvaryum, yem, filtre ve bakım ürünlerini ihtiyacınıza göre birlikte değerlendirelim.</p>
          <h2 className="mt-8 text-xl font-semibold">Mağazamıza ulaşın</h2>
          <address className="mt-3 not-italic leading-relaxed">{CONTACT.address}</address>
          <p className="mt-3">Çalışma saatleri: {CONTACT.hours}</p>
          <p className="mt-2 text-sm text-muted">Özel günlerde çalışma saatlerini ve aradığınız ürünün stok durumunu ziyaretinizden önce telefonla doğrulayabilirsiniz.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="store-button store-button-cta" href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">Yol tarifi alın ↗</a>
            <a className="store-button" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a className="store-button" href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp’tan sorun</a>
          </div>
        </section>
        <Image src="/images/store-hero/magaza-3.webp" alt="Gri Akvaryum Eminönü mağazasının akvaryumlarla çevrili vitrini" width={1000} height={750} className="h-auto w-full rounded-3xl object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <section className="mt-12 rounded-3xl border border-cyan-400/15 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Ziyaret öncesi neleri hazırlayabilirsiniz?</h2>
        <p className="mt-4 leading-relaxed text-muted">Tank ölçülerinizi, mevcut canlılarınızı ve kullandığınız ekipmanın modelini paylaşmanız ürün seçiminde yardımcı olur. Yedek parça arıyorsanız model etiketi ve parçanın fotoğrafını yanınızda bulundurun. Canlıların uyumu ve teslimat koşulları için mağazamızla görüşün.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link className="font-semibold text-accent" href="/kategori/filtreler">Filtre ve ekipmanları inceleyin →</Link>
          <Link className="font-semibold text-accent" href="/kategori/yemler">Yemleri karşılaştırın →</Link>
          <Link className="font-semibold text-accent" href="/rehber/ilk-akvaryum-kurulumu">İlk akvaryum rehberini okuyun →</Link>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Haritada Gri Akvaryum</h2>
        <iframe title="Gri Akvaryum Eminönü mağazası haritası" src={CONTACT.mapsEmbedUrl} className="h-96 w-full rounded-3xl border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </section>
    </main>
    <Footer />
  </>;
}
