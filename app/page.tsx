import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import SupportChat from "@/components/SupportChat";
import StorefrontHero from "@/components/StorefrontHero";
import CloudBrandMarquee from "@/components/CloudBrandMarquee";
import OceanSplash from "@/components/OceanSplash";
import ProductCard from "@/components/ProductCard";
import { getCategories, getAllProducts } from "@/lib/easytrade";
import { buildCategoryGroups } from "@/lib/catalog";
import { CONTACT } from "@/lib/site";

const trust = [
  {
    title: "Güvenli Teslimat",
    text: "Ürünleriniz için özenli paketleme ve planlı teslimat.",
    link: { href: "/sozlesme/mesafeli-satis", label: "Teslimat koşulları" },
    icon: <><path d="M3 5h11v12H3zM14 9h4l3 4v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  },
  {
    title: "Uzman Desteği",
    text: "Kurulumdan su değerlerine her konuda yanınızdayız.",
    link: { href: CONTACT.whatsappHref, label: "WhatsApp'tan sorun", external: true },
    icon: <><path d="M4 13v-1a8 8 0 0 1 16 0v1M20 17v1a3 3 0 0 1-3 3h-5" /><rect x="3" y="11" width="4" height="7" rx="2" /><rect x="17" y="11" width="4" height="7" rx="2" /></>,
  },
  {
    title: "Güncel Stok",
    text: "Mağaza stoklarıyla eş zamanlı online envanter.",
    link: { href: "/urunler", label: "Stoktakileri gör" },
    icon: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" /></>,
  },
];

export default async function Home() {
  const [catalog, categoryResult] = await Promise.allSettled([
    getAllProducts(),
    getCategories(),
  ]);
  const categories =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const featured =
    catalog.status === "fulfilled"
      ? [...catalog.value].filter((product) => product.stock_quantity > 0)
          .sort(
            (a, b) =>
              Number(b.images.length > 0) * 4 + Number(Boolean(b.description?.trim())) -
              Number(a.images.length > 0) * 4 - Number(Boolean(a.description?.trim())),
          )
          .slice(0, 8)
      : [];
  const groups = buildCategoryGroups(categories);
  const topCategories = ["baliklar-canlilar", "akvaryumlar", "yemler", "filtreler", "motorlar-hava", "su-bakimi", "isitma-aydinlatma", "aksesuar-temizlik"]
    .flatMap((key) => groups.filter((group) => group.key === key));
  return (
    <>
      <OceanSplash />
      <Navbar />
      <main id="main-content" className="store-home">
        <div className="store-container store-intro">
          <nav
            id="kategoriler"
            className="store-categories"
            aria-label="Ürün kategorileri"
          >
            <h2>Kategoriler</h2>
            {topCategories.map((c) => (
              <Link key={c.key} href={`/urunler?grup=${c.key}`}>
                <span>
                  <strong>{c.title}</strong>
                  <small>{c.categories.length} alt kategori</small>
                </span>
                <span aria-hidden="true">›</span>
              </Link>
            ))}
            {topCategories.length === 0 && (
              <Link href="/urunler">
                <strong>Ürün kategorilerini keşfedin</strong>
                <span aria-hidden="true">›</span>
              </Link>
            )}
            <Link href="/rehber#tuzlu-su">
              <span>
                <strong>Deniz &amp; Resif</strong>
                <small>Tuz, mercan bakımı, test</small>
              </span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link className="store-all-categories" href="/urunler">
              Tüm kategoriler
              {categories.length > 0 ? ` (${categories.length})` : ""}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
          <StorefrontHero />
        </div>
        <section
          id="hakkimizda"
          className="store-trust"
          aria-label="Alışveriş güvencesi"
        >
          <div className="store-container">
            {trust.map(({ title, text, icon, link }) => (
              <div key={title} className="store-trust-item">
                <span className="store-trust-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </span>
                <div className="store-trust-body">
                  <h2>{title}</h2>
                  <p>{text}</p>
                  {"external" in link ? (
                    <a className="store-trust-link" href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link className="store-trust-link" href={link.href}>
                      {link.label} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <CloudBrandMarquee />
        <section className="store-container store-featured">
          <div className="store-section-heading">
            <div>
              <h2>Akvaryumunuz için seçtiklerimiz</h2>
              <p>
                Bakımın her adımı için doğru ürünler
              </p>
            </div>
            <Link href="/urunler">
              Tüm ürünleri gör <span aria-hidden="true">→</span>
            </Link>
          </div>
          {featured.length ? (
            <div className="store-product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="store-empty">
              <h3>Ürünler şu anda yüklenemiyor</h3>
              <p>
                Kataloğu yeniden açabilir veya ürün bilgisi için bize
                ulaşabilirsiniz.
              </p>
              <Link className="store-button" href="/urunler">
                Kataloğu aç
              </Link>
            </div>
          )}
        </section>
        <section className="store-container store-support-wrap" aria-labelledby="store-support-title">
          <div className="store-support">
            <span className="store-support-bubbles" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i />
            </span>
            <div className="store-support-copy">
              <h2 id="store-support-title">Akvaryumunuz için bir uzmana danışın.</h2>
              <p>
                Balık seçimi, akvaryum kurulumu veya su değerleri hakkında
                sorularınızı birlikte yanıtlayalım.
              </p>
              <div className="store-actions">
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-button store-button-green"
                >
                  <AppIcon name="message" size={18} />
                  WhatsApp&apos;tan yazın
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="store-button store-button-outline"
                >
                  <AppIcon name="phone" size={17} />
                  Bizi arayın
                </a>
              </div>
            </div>
            <div className="store-guide-links">
              <h3><AppIcon name="book" size={18} /> Akvaryum rehberi</h3>
              {[
                ["haftalik-bakim-rutini", "Akvaryum nasıl temizlenir?"],
                ["ilk-baliklar", "İlk akvaryuma balık nasıl eklenir?"],
                ["su-parametreleri", "Su değerleri nasıl ayarlanır?"],
              ].map(([slug, title]) => (
                <Link key={slug} href={`/rehber/${slug}`}>
                  <span>{title}</span>
                  <span className="store-guide-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportChat />
    </>
  );
}
