import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLegalDoc, legalDocs } from "@/lib/legal";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Sözleşme | Gri Akvaryum" };
  return {
    title: `${doc.title} | Gri Akvaryum`,
    description: doc.intro.slice(0, 155),
  };
}

export default async function LegalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-svh w-full max-w-4xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <nav className="mb-6 text-xs text-muted">
          <Link href="/" className="hover:text-cyan-300">
            Ana Sayfa
          </Link>
          {" / "}
          Sözleşmeler &amp; Politikalar
        </nav>

        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {doc.title}
        </h1>
        <p className="mt-2 text-xs text-muted">
          Son güncelleme:{" "}
          {new Date(doc.updated).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="glass mt-6 rounded-3xl p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-muted">{doc.intro}</p>

          {doc.blocks.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="font-display mt-7 text-base font-bold text-cyan-200 sm:text-lg"
                >
                  {block.title}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span className="text-cyan-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="mt-3 text-sm leading-relaxed text-muted">
                {block.text}
              </p>
            );
          })}
        </div>

        {/* Diğer sözleşmeler */}
        <div className="mt-8">
          <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Diğer Sözleşmeler &amp; Politikalar
          </h2>
          <div className="flex flex-wrap gap-2">
            {legalDocs
              .filter((d) => d.slug !== doc.slug)
              .map((d) => (
                <Link
                  key={d.slug}
                  href={`/sozlesme/${d.slug}`}
                  className="glass rounded-full px-4 py-2 text-xs font-medium transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
                >
                  {d.title}
                </Link>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
