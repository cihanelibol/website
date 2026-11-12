import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getAllProducts, type EtProduct } from "@/lib/easytrade";
import { CONTACT } from "@/lib/site";
import Footer from "@/components/Footer";
import CloudBrandMarquee from "@/components/CloudBrandMarquee";
import OceanSplash from "@/components/OceanSplash";
import Header from "@/components/home/Header";
import Icon from "@/components/home/Icon";
import ProductCard from "@/components/home/ProductCard";
import { productVisual, visualTypes } from "@/components/home/product-visual";
import s from "@/components/home/home.module.css";

export const metadata: Metadata = {
  title: "Gri Akvaryum | Ana Sayfa V2",
  robots: { index: false, follow: false },
};

const collections = [
  { title: "Yeni başlıyorum", description: "İlk akvaryumunuzu birlikte kuralım.", image: "starter", href: "/rehber/ilk-akvaryum-kurulumu" },
  { title: "Canlı balıkları keşfet", description: "Akvaryumunuza yeni renkler.", image: "betta", href: "/urunler?grup=baliklar-canlilar" },
  { title: "Deniz & Resif", description: "Deniz yaşamına yakından bakın.", image: "reef", href: "/rehber#tuzlu-su" },
];

const storePhotos = [
  { src: "/images/home-v2/magaza-akvaryumlar.webp", alt: "Gri Akvaryum mağazasında renkli süs balıklarıyla dolu akvaryum duvarı", label: "Canlı balık bölümü", className: s.storeWide },
  { src: "/images/home-v2/magaza-ic.webp", alt: "Tavandan sarkan dekor kökleri, filtre ve yem rafları ile mağazanın içi", label: "Ekipman & dekor", className: s.storeTall },
  { src: "/store/magaza-2.jpg", alt: "Mağazada akvaryum su düzenleyici ve bakım ürünleri rafı", className: "" },
  { src: "/store/magaza-6.jpg", alt: "Mağazada bitkili ve dekorlu sergi akvaryumları", className: "" },
];

async function FeaturedProducts() {
  let products: EtProduct[];
  try { products = await getAllProducts(); } catch { products = []; }
  const available = products.filter((p) => p.stock_quantity > 0).sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0));
  const selected = new Map<number, (typeof available)[number]>();
  for (const visual of visualTypes) {
    const product = available.filter((p) => productVisual(p) === visual)
      .sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0) || a.price_with_tax - b.price_with_tax)[0];
    if (product) selected.set(product.id, product);
  }
  const remaining = [...available].sort((a, b) =>
    Number(b.images.length > 0) - Number(a.images.length > 0) ||
    Number(Boolean(productVisual(b))) - Number(Boolean(productVisual(a))) ||
    a.price_with_tax - b.price_with_tax,
  );
  for (const product of remaining) {
    if (selected.size >= 8) break;
    selected.set(product.id, product);
  }
  if (!selected.size) return <div className={s.empty}>
    <Icon name="fish" /><h3>Ürünler şu anda görüntülenemiyor</h3>
    <p>Güncel ürünler için kataloğa göz atabilir veya bize ulaşabilirsiniz.</p>
    <Link href="/urunler" className={s.orangeButton}>Kataloğu aç <Icon name="arrow" /></Link>
  </div>;
  return <div className={s.productGrid}>{[...selected.values()].map((p) => <ProductCard key={p.id} product={p} />)}</div>;
}

export default function HomeV2() {
  return <div className={s.page}>
    <OceanSplash />
    <a href="#main-content" className={s.skipLink}>İçeriğe geç</a>
    <Header />
    <main id="main-content" className={s.container}>
      <section className={s.hero} aria-labelledby="hero-title">
        <Image src="/images/home-v2/hero.webp" alt="Yeşil bitkiler arasında neon tetra sürüsü ve turuncu discus balığı" fill sizes="(max-width: 1400px) 96vw, 1320px" preload className={s.heroImage} />
        <div className={s.heroContent}>
          <p className={s.eyebrow}>GRİ AKVARYUM <span /> EMİNÖNÜ</p>
          <h1 id="hero-title">Akvaryumunuza<br />hayat katın.</h1>
          <p className={s.heroDescription}>Canlı balıklar, doğru ekipmanlar ve uzman desteği.</p>
          <div className={s.heroActions}>
            <Link href="/urunler" className={s.orangeButton}>Ürünleri keşfet <Icon name="arrow" /></Link>
            <Link href="/rehber" className={s.heroGuide}>Akvaryum rehberi <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
      <section className={s.trust} aria-label="Alışveriş güvencesi">
        <div><Icon name="package" /><div><h2>Özenli paketleme</h2><p>Ürünleriniz güvenle ve özenle hazırlanır.</p></div></div>
        <div><Icon name="headset" /><div><h2>Uzman desteği</h2><p>Akvaryumunuzla ilgili her konuda yanınızdayız.</p></div></div>
        <div><Icon name="layers" /><div><h2>Güncel stok</h2><p>Mağazamızla eş zamanlı, güncel ürünler.</p></div></div>
      </section>
      <section className={s.collections} aria-label="Akvaryum dünyasını keşfedin">
        {collections.map((item) => <Link className={`${s.collection} ${s[item.image]}`} href={item.href} key={item.image}>
          <Image src={`/images/home-v2/${item.image}.webp`} alt="" fill sizes="(max-width: 640px) 95vw, (max-width: 1000px) 46vw, 430px" />
          <div><h2>{item.title}</h2><p>{item.description}</p><Icon name="arrow" /></div>
        </Link>)}
      </section>
      <section className={s.featured} aria-labelledby="featured-title">
        <div className={s.sectionHeading}>
          <div><h2 id="featured-title">Akvaryumunuz için seçtiklerimiz</h2><p>Bakımın her adımı için doğru ürünler</p></div>
          <Link href="/urunler">Tüm ürünler <Icon name="arrow" /></Link>
        </div>
        <Suspense fallback={<div className={s.productGrid} aria-label="Ürünler yükleniyor" aria-busy="true">{[1, 2, 3, 4].map((id) => <div key={id} className={s.skeleton}><div /><span /><span /></div>)}</div>}><FeaturedProducts /></Suspense>
      </section>
      <section id="magazamiz" className={s.store} aria-labelledby="store-title">
        <div className={s.storeInfo}>
          <p className={s.storeEyebrow}><Icon name="pin" />Mağazamız</p>
          <h2 id="store-title">Eminönü’nde, balıklarımızı yerinde görün.</h2>
          <p>Yüzlerce akvaryumu, canlı balıkları, yem ve ekipman reyonlarını bizzat gezin; akvaryumunuza uygun ürünü birlikte seçelim.</p>
          <ul className={s.storeFacts}>
            <li><Icon name="pin" /><span>{CONTACT.address}</span></li>
            <li><Icon name="clock" /><span>{CONTACT.hours}</span></li>
          </ul>
          <figure className={s.storeReview}>
            <div aria-label="Google’da 5 üzerinden 5 yıldız">{[1, 2, 3, 4, 5].map((n) => <Icon key={n} name="star" />)}</div>
            <blockquote>“Bu zamanda böyle esnaflık, böyle nezaket, ilgi alaka… Tek kelimeyle muhteşem bir yer.”</blockquote>
            <figcaption>Arif E. · Google yorumu</figcaption>
          </figure>
          <div className={s.storeActions}>
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className={s.orangeButton}>Yol tarifi al <Icon name="arrow" /></a>
            <a href={CONTACT.phoneHref} className={s.storeCall}>Hemen ara</a>
          </div>
        </div>
        <div className={s.storeGallery}>
          {storePhotos.map((photo) => <figure key={photo.src} className={photo.className}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 92vw, (max-width: 1000px) 60vw, 560px" />
            {photo.label && <figcaption>{photo.label}</figcaption>}
          </figure>)}
        </div>
      </section>
      <section className={s.support}>
        <div className={s.supportIcon}><Icon name="headset" /></div>
        <div><h2>Birlikte doğru akvaryumu kuralım.</h2><p>Balık seçiminden su bakımına, aklınıza takılan her konuda buradayız.</p></div>
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={s.orangeButton}>Uzmana danışın <Icon name="arrow" /></a>
      </section>
    </main>
    <CloudBrandMarquee />
    <Footer />
  </div>;
}
