import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articles, categories, getArticlesByCategory } from "@/lib/rehber";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yardım Merkezi | Akvaryum Rehberleri - Gri Akvaryum",
  description:
    "Akvaryum kurulumundan tuzlu su resif bakımına, balık hastalıklarından ekipman kullanımına - uzman ekibimizden kapsamlı akvaryum rehberleri.",
  keywords: [
    "akvaryum rehberi",
    "akvaryum yardım merkezi",
    "akvaryum kurulumu",
    "balık bakımı",
    "tuzlu su akvaryumu",
    "akvaryum ekipmanları",
  ],
  alternates: { canonical: "/rehber" },
  openGraph: {
    title: "Yardım Merkezi - Gri Akvaryum",
    description:
      "Sayfalarca uzman içerik: akvaryum kurulumu, su kimyası, balık sağlığı, tuzlu su ve ekipman rehberleri.",
    url: "/rehber",
    type: "website",
  },
};

// Öne çıkarılan makaleler - en çok aranan konular
const featuredSlugs = [
  "ilk-akvaryum-kurulumu",
  "akvaryum-dongusu",
  "beyaz-benek",
  "akvaryum-temizligi",
];

export default function YardimMerkeziPage() {
  const featured = featuredSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gri Akvaryum Yardım Merkezi",
    description:
      "Akvaryum hobisi için kapsamlı rehber kütüphanesi: kurulum, bakım, su kimyası, balık sağlığı, tuzlu su ve ekipman kullanımı.",
    url: `${SITE_URL}/rehber`,
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `${SITE_URL}/rehber/${a.slug}`,
    })),
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-svh w-full max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Yardım Merkezi
          </span>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Akvaryum Bilgi <span className="text-gradient">Kütüphanesi</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            İlk kurulumdan resif akvaryumuna, hastalık tedavisinden ekipman
            kullanımına - {articles.length} kapsamlı rehberle her sorunuza
            uzman cevabı.
          </p>
        </div>

        {/* Öne çıkanlar */}
        <div className="mb-16">
          <h2 className="font-display mb-5 text-lg font-semibold text-muted">
            En çok okunanlar
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a) => {
              const cat = categories.find((c) => c.slug === a.category);
              return (
                <Link
                  key={a.slug}
                  href={`/rehber/${a.slug}`}
                  className="glass card-hover group flex flex-col rounded-3xl p-6"
                >
                  <span className="text-3xl">{cat?.emoji}</span>
                  <h3 className="font-display mt-4 font-semibold leading-snug group-hover:text-cyan-200">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {a.description}
                  </p>
                  <span className="mt-auto pt-3 text-xs font-medium text-cyan-300">
                    {a.minutes} dk okuma →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Kategoriler ve makale listeleri */}
        <div className="space-y-12">
          {categories.map((cat) => {
            const catArticles = getArticlesByCategory(cat.slug);
            return (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-24">
                <div className="glass rounded-3xl p-7 sm:p-9">
                  <div className="mb-6 flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-teal-500/20 text-3xl">
                      {cat.emoji}
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-bold sm:text-2xl">
                        {cat.title}
                      </h2>
                      <p className="mt-1.5 leading-relaxed text-muted">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {catArticles.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/rehber/${a.slug}`}
                        className="group flex items-start justify-between gap-4 rounded-2xl border border-transparent bg-cyan-400/[0.04] p-4 transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/10"
                      >
                        <div>
                          <h3 className="font-medium leading-snug group-hover:text-cyan-200">
                            {a.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                            {a.description}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                          {a.minutes} dk
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="glass glow mt-16 rounded-3xl p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-bold">Sorunuz mu var?</h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
            Rehberlerde bulamadığınız her konuda uzman ekibimize
            danışabilirsiniz - balık fotoğrafınızı ve su değerlerinizi
            gönderin, birlikte çözelim.
          </p>
          <a
            href="https://wa.me/900000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-semibold text-slate-950 transition-transform hover:scale-105"
          >
            WhatsApp&apos;tan Sor
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
