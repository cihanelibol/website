import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "@/components/ImageGallery";
import ActivityPing from "@/components/ActivityPing";
import ReviewForm from "@/components/ReviewForm";
import { AddToCartDetail } from "@/components/cart/AddToCartButton";
import { IyzicoCheckoutNote } from "@/components/PaymentLogos";
import { addReviewAction } from "./actions";
import {
  formatPrice,
  type EtProduct,
} from "@/lib/easytrade";
import {
  BRANDS,
  productMatchesBrand,
  relatedArticleSlugs,
  usageSections,
} from "@/lib/catalog";
import { CONTACT } from "@/lib/site";
import { getArticle } from "@/lib/rehber";
import { getReviews, ratingSummary } from "@/lib/reviews";
import { getCatalogProducts } from "@/lib/catalog-data";
import { breadcrumbs, pageMetadata, productSchema, storeSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { productCategoryLinks } from "@/lib/guide-catalog";
import { editorialDescription, getProductEditorial } from "@/lib/product-editorial";
import { productDescription } from "@/lib/product-seo";
import { SHIPPING } from "@/lib/shipping";

type Params = Promise<{ id: string }>;

// Soğuk önbellekte katalog çekimi uzun sürebilir — Vercel süre limiti yükseltildi
export const maxDuration = 60;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const all = await getCatalogProducts();
  const product = all.find((p) => p.id === Number(id));
  if (!product) notFound();
  const editorial = getProductEditorial(product);
  return pageMetadata(`${product.name} | Gri Akvaryum`, editorial?.summary ?? productDescription(product), `/urunler/${product.id}`, product.images.find(i => i.is_primary)?.url ?? product.images[0]?.url);
}

function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  return (
    <span className={`inline-flex ${size}`} aria-label={`${value.toFixed(1)} yıldız`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(value) ? "" : "opacity-25 grayscale"}>
          <AppIcon name="star" fill="currentColor" />
        </span>
      ))}
    </span>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(productId)) notFound();

  const all = await getCatalogProducts();
  const product = all.find((p) => p.id === productId);
  if (!product) notFound();

  const editorial = getProductEditorial(product);
  const description = editorial ? editorialDescription(editorial) : productDescription(product);
  const categoryLinks = productCategoryLinks(product);
  const inStock = product.stock_quantity > 0;
  const lowStock = inStock && product.stock_quantity <= 5;
  const brand = BRANDS.find((b) => productMatchesBrand(product, b));
  const images = [...product.images]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
    .map((i) => i.url);

  const usage = usageSections(product);
  const articles = relatedArticleSlugs(product)
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const reviews = await getReviews(productId);
  const { count: reviewCount, average } = ratingSummary(reviews);

  // Benzer ürünler: ortak kategorilere göre puanlanır - küçük (spesifik) kategori
  // eşleşmesi, "Balık" gibi dev genel kategorilerden çok daha değerlidir.
  const catSize = new Map<number, number>();
  for (const p of all)
    for (const c of p.categories)
      catSize.set(c.id, (catSize.get(c.id) ?? 0) + 1);
  const catIds = new Set(product.categories.map((c) => c.id));
  const scoreOf = (p: EtProduct) =>
    p.categories.reduce(
      (s, c) => (catIds.has(c.id) ? s + 1 / (catSize.get(c.id) ?? 1) : s),
      0
    ) + Number(p.stock_quantity > 0) * 0.001;
  const similar: EtProduct[] = all
    .filter((p) => p.id !== product.id && p.categories.some((c) => catIds.has(c.id)))
    .sort((a, b) => scoreOf(b) - scoreOf(a))
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <JsonLd data={[
        storeSchema,
        productSchema({ ...product, description }, { count: reviewCount, average }, reviews),
        breadcrumbs([{ name: "Ana Sayfa", path: "/" }, { name: "Ürünler", path: "/urunler" }, { name: product.name, path: `/urunler/${product.id}` }]),
      ].filter(Boolean)} />
      {/* Üye denetim kaydı: ürün görüntüleme olayı */}
      <ActivityPing productId={product.id} productName={product.name} price={product.price_with_tax} />
      <main id="main-content" className="store-container store-product-detail min-h-svh pb-20 pt-24">
        {/* Kırıntı */}
        <nav aria-label="Sayfa yolu" className="mb-6 text-xs text-muted">
          <Link href="/" className="hover:text-cyan-300">
            Ana Sayfa
          </Link>
          {" / "}
          <Link href="/urunler" className="hover:text-cyan-300">
            Ürünler
          </Link>
          {product.categories[0] && (
            <>
              {" / "}
              <Link
                href={`/urunler?kategori=${product.categories[0].id}`}
                className="hover:text-cyan-300"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        {categoryLinks.length > 0 && (
          <nav aria-label="İlgili ürün kategorileri" className="mb-6 flex flex-wrap gap-2">
            {categoryLinks.map(link => (
              <Link key={link.href} href={link.href} className="rounded-full border border-cyan-400/20 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10">{link.title}</Link>
            ))}
          </nav>
        )}

        {/* Üst bölüm: galeri + bilgi */}
        <div className={`store-detail-grid grid gap-8 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-12${images.length ? "" : " store-detail-no-image"}`}>
          <ImageGallery
            images={images}
            alt={product.name}
          />

          <div className="min-w-0">
            {brand && (
              <Link href={`/marka/${brand.slug}`} className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-cyan-300 hover:underline">
                {brand.label}
              </Link>
            )}
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {reviewCount > 0 ? (
                <a href="#yorumlar" className="flex items-center gap-1.5 hover:text-cyan-200">
                  <Stars value={average} />
                  <span className="text-muted">
                    {average.toFixed(1)} ({reviewCount} yorum)
                  </span>
                </a>
              ) : (
                <a href="#yorumlar" className="text-muted hover:text-cyan-200">
                  Henüz yorum yok - ilk yorumu siz yazın
                </a>
              )}
              {product.sku && (
                <span className="text-muted">Kod: {product.sku}</span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-4">
              <div className="font-display text-4xl font-bold text-accent">
                {formatPrice(product.price_with_tax)}
              </div>
              <div className="pb-1 text-sm text-muted">
                KDV dahil / {product.unit.label}
              </div>
            </div>

            <div className="mt-3">
              {!inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/20 px-3 py-1 text-xs font-semibold text-slate-300">
                  ● Stokta yok
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                  ● Son {product.stock_quantity} ürün
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300">
                  ● Stokta var
                </span>
              )}
            </div>

            <div className="store-detail-purchase mt-7">
              <AddToCartDetail product={product} />
              <a className="store-product-help" href={`${CONTACT.whatsappHref}?text=${encodeURIComponent(`${product.name} (${product.sku ?? product.id}) hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noopener noreferrer">Bu ürünü uzmana sor (WhatsApp)</a>
              <IyzicoCheckoutNote className="mt-4" />
              <p className="mt-3 text-xs leading-relaxed text-muted">{SHIPPING.summary} {SHIPPING.dispatch} <Link href={SHIPPING.policyPath} className="underline">Kargo ve teslimat koşulları</Link>{" · "}<Link href="/sozlesme/mesafeli-satis" className="underline">İade koşulları</Link></p>
            </div>

            {!description?.trim() && <p className="store-product-data-note">Bu ürünün ölçü ve uyumluluk bilgileri katalogda yer almıyor. Sipariş vermeden önce ürün kodunu belirterek mağazamızdan bilgi alın.</p>}
            {description && (
              <p className="mt-7 whitespace-pre-line text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}

            {editorial && (
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Kaynak: <a href={editorial.source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{editorial.source.title}</a>
              </p>
            )}
            {/* Özellikler */}
            <div className="mt-8">
              <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider">
                Ürün Özellikleri
              </h2>
              <dl className="glass divide-y divide-cyan-400/10 rounded-2xl text-sm">
                {[
                  ["Ürün Kodu", product.sku],
                  ["Barkod", product.barcode],
                  ["Birim", product.unit.label],
                  [
                    "Stok Durumu",
                    inStock ? `${product.stock_quantity} ${product.unit.label}` : "Tükendi",
                  ],
                  ...(brand ? [["Marka", brand.label] as [string, string]] : []),
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 px-5 py-3">
                      <dt className="text-muted">{label}</dt>
                      <dd className="text-right font-medium">{value}</dd>
                    </div>
                  ))}
                <div className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-muted">Kategoriler</dt>
                  <dd className="flex flex-wrap justify-end gap-1.5">
                    {product.categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/urunler?kategori=${c.id}`}
                        className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs text-cyan-200 transition-colors hover:bg-cyan-400/25"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Kullanım önerileri */}
        {usage.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display mb-5 text-xl font-bold tracking-tight sm:text-2xl">
              Nasıl Kullanılır?
            </h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {usage.map((section) => (
                <div key={section.title} className="glass rounded-3xl p-6">
                  <h3 className="font-display mb-3 font-bold text-cyan-200">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="text-cyan-400"><AppIcon name="check" /></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* İlgili rehber makaleleri */}
        {articles.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                <AppIcon name="book" /> İlgili Rehberler
              </h2>
              <Link
                href="/rehber"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Yardım Merkezi →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/rehber/${article.slug}`}
                  className="glass card-hover group rounded-2xl p-5"
                >
                  <div className="font-display text-sm font-semibold leading-snug transition-colors group-hover:text-cyan-200">
                    {article.title}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {article.description}
                  </p>
                  <div className="mt-3 text-xs text-cyan-300">
                    {article.minutes} dk okuma →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Yorumlar */}
        <section id="yorumlar" className="mt-14 scroll-mt-24">
          <h2 className="font-display mb-5 text-xl font-bold tracking-tight sm:text-2xl">
            Değerlendirmeler{" "}
            {reviewCount > 0 && (
              <span className="text-base font-normal text-muted">
                - {average.toFixed(1)}/5 ({reviewCount})
              </span>
            )}
          </h2>

          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="glass rounded-3xl px-6 py-10 text-center text-lg text-muted">
                  Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yazın!
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="glass rounded-2xl p-5">
                    <div className="mb-1.5 flex flex-wrap items-center gap-3">
                      <strong className="text-sm">{review.name}</strong>
                      <Stars value={review.rating} size="text-xs" />
                      <span className="text-xs text-muted">
                        {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <p className="text-lg leading-relaxed text-muted">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="glass h-fit rounded-3xl p-6">
              <h3 className="font-display mb-4 font-bold">Yorum Yazın</h3>
              <ReviewForm action={addReviewAction.bind(null, productId)} />
            </div>
          </div>
        </section>

        {/* Benzer ürünler */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display mb-5 text-xl font-bold tracking-tight sm:text-2xl">
              Benzer Ürünler
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
