"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/site";
export default function CatalogError({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container py-12">
        <div className="store-empty">
          <h1 className="text-2xl font-bold">Kataloğa şu anda ulaşılamıyor</h1>
          <p>
            Ürün bilgilerini yeniden yüklemeyi deneyin. Yardım için mağazamızla
            iletişime geçebilirsiniz.
          </p>
          <div className="store-actions">
            <button className="store-button" onClick={unstable_retry}>
              Yeniden dene
            </button>
            <a
              className="store-button store-button-secondary"
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mağazaya sor
            </a>
            <Link className="store-button store-button-secondary" href="/">
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
