import AppIcon from "@/components/AppIcon";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleBlocks from "@/components/ArticleBlocks";
import {
  articles,
  categories,
  getAdjacentArticles,
  getArticle,
  getArticlesByCategory,
  getCategory,
  getRelatedArticles,
} from "@/lib/rehber";
import { CONTACT, SITE_URL } from "@/lib/site";
import { jsonLdString } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Gri Akvaryum Yardım Merkezi`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/rehber/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/rehber/${article.slug}`,
      type: "article",
      modifiedTime: article.updated,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function RehberMakalePage({
  params,
}: {
  params: Params;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const { prev, next } = getAdjacentArticles(slug);
  const related = getRelatedArticles(article);
  const toc = article.blocks.filter((b) => b.type === "h2");

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      dateModified: article.updated,
      inLanguage: "tr",
      author: { "@type": "Organization", name: "Gri Akvaryum" },
      publisher: { "@type": "Organization", name: "Gri Akvaryum" },
      mainEntityOfPage: `${SITE_URL}/rehber/${article.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Yardım Merkezi",
          item: `${SITE_URL}/rehber`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `${SITE_URL}/rehber/${article.slug}`,
        },
      ],
    },
  ];

  if (article.faq && article.faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container min-h-svh pb-20 pt-24">
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav aria-label="Sayfa yolu" className="mb-8 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-cyan-300">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href="/rehber"
                className="transition-colors hover:text-cyan-300"
              >
                Yardım Merkezi
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/rehber#${category.slug}`}
                    className="transition-colors hover:text-cyan-300"
                  >
                    {category.title}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_220px]">
          {/* Sol kenar çubuğu - tüm rehber navigasyonu */}
          <aside aria-label="Rehber kütüphanesi" className="hidden lg:block">
            <nav
              aria-label="Rehber menüsü"
              className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto pr-2"
            >
              {categories.map((cat) => (
                <div key={cat.slug}>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span aria-hidden><AppIcon name={cat.icon ?? "book"} /></span>
                    {cat.title}
                  </div>
                  <ul className="space-y-0.5 border-l border-cyan-400/15">
                    {getArticlesByCategory(cat.slug).map((a) => {
                      const active = a.slug === article.slug;
                      return (
                        <li key={a.slug}>
                          <Link
                            href={`/rehber/${a.slug}`}
                            aria-current={active ? "page" : undefined}
                            className={`-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${
                              active
                                ? "border-cyan-400 font-medium text-cyan-300"
                                : "border-transparent text-muted hover:border-cyan-400/40 hover:text-foreground"
                            }`}
                          >
                            {a.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Makale */}
          <article className="min-w-0">
            <header className="mb-8">
              {category && (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  {category.title}
                </span>
              )}
              <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {article.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {article.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 font-medium text-cyan-300">
                  {article.minutes} dk okuma
                </span>
                <span>
                  Son güncelleme:{" "}
                  {new Date(article.updated).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </header>

            {/* Mobil içindekiler */}
            {toc.length > 0 && (
              <details className="glass mb-8 rounded-2xl p-5 xl:hidden">
                <summary className="cursor-pointer list-none font-semibold">
                  Bu sayfada ▾
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-muted transition-colors hover:text-cyan-300"
                      >
                        {h.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="space-y-6">
              <ArticleBlocks blocks={article.blocks} />
            </div>

            {/* SSS */}
            {article.faq && article.faq.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display mb-5 text-xl font-bold sm:text-2xl">
                  Sık Sorulan Sorular
                </h2>
                <div className="space-y-3">
                  {article.faq.map((f, i) => (
                    <details key={i} className="glass group rounded-2xl p-5">
                      <summary className="cursor-pointer list-none font-semibold transition-colors group-open:text-cyan-300">
                        {f.q}
                      </summary>
                      <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Önceki / Sonraki */}
            {(prev || next) && (
              <nav
                aria-label="Makale gezinmesi"
                className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/rehber/${prev.slug}`}
                    className="glass card-hover rounded-2xl p-5"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      ← Önceki
                    </span>
                    <div className="mt-1.5 font-semibold leading-snug">
                      {prev.title}
                    </div>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={`/rehber/${next.slug}`}
                    className="glass card-hover rounded-2xl p-5 text-right"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      Sonraki →
                    </span>
                    <div className="mt-1.5 font-semibold leading-snug">
                      {next.title}
                    </div>
                  </Link>
                )}
              </nav>
            )}

            {/* İlgili makaleler */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="font-display mb-5 text-xl font-bold">
                  İlgili Rehberler
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/rehber/${r.slug}`}
                      className="group rounded-2xl border border-transparent bg-cyan-400/[0.04] p-4 transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/10"
                    >
                      <div className="font-medium leading-snug group-hover:text-cyan-200">
                        {r.title}
                      </div>
                      <span className="mt-1.5 inline-block text-xs font-medium text-cyan-300">
                        {r.minutes} dk okuma →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="glass mt-12 rounded-3xl p-7 text-center">
              <h2 className="font-display text-xl font-bold">
                Aradığınızı bulamadınız mı?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                Uzman ekibimiz her sorunuza yanıt vermeye hazır - fotoğraf ve
                su değerlerinizle birlikte yazın.
              </p>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3 font-semibold text-slate-950 transition-transform hover:scale-105"
              >
                WhatsApp&apos;tan Sor
              </a>
            </div>
          </article>

          {/* Sağ kenar - içindekiler (masaüstü) */}
          {toc.length > 0 && (
            <aside aria-label="Bu yazının bölümleri" className="hidden xl:block">
              <nav
                aria-label="Bu sayfada"
                className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
              >
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Bu sayfada
                </div>
                <ul className="space-y-2 border-l border-cyan-400/15 text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="-ml-px block border-l border-transparent py-0.5 pl-4 leading-snug text-muted transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                      >
                        {h.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
