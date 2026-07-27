import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="iletisim" className="glass-strong mt-auto scroll-mt-20 border-t border-cyan-400/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt="Gri Akvaryum logosu"
              width={48}
              height={28}
              className="h-7 w-auto"
            />
            <span className="font-display text-lg font-bold">
              Gri<span className="text-gradient">Akvaryum</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Akvaryum ve balık galerisi. Sualtı dünyasının tüm renkleri,
            uzman güvencesiyle kapınızda.
          </p>
        </div>

        <div>
          <h4 className="font-display mb-4 font-semibold">Hızlı Bağlantılar</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/urunler" className="transition-colors hover:text-cyan-300">Tüm Ürünler</Link></li>
            <li><Link href="/#kategoriler" className="transition-colors hover:text-cyan-300">Kategoriler</Link></li>
            <li><Link href="/rehber" className="transition-colors hover:text-cyan-300">Yardım Merkezi</Link></li>
            <li><Link href="/#hakkimizda" className="transition-colors hover:text-cyan-300">Hakkımızda</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display mb-4 font-semibold">Kategoriler</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/urunler?kategori=baliklar" className="transition-colors hover:text-cyan-300">Süs Balıkları</Link></li>
            <li><Link href="/urunler?kategori=akvaryumlar" className="transition-colors hover:text-cyan-300">Akvaryumlar</Link></li>
            <li><Link href="/urunler?kategori=yemler" className="transition-colors hover:text-cyan-300">Yem &amp; Vitamin</Link></li>
            <li><Link href="/urunler?kategori=ekipman" className="transition-colors hover:text-cyan-300">Ekipman &amp; Filtre</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display mb-4 font-semibold">İletişim</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cyan-300"
              >
                📍 {CONTACT.address}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.phoneHref}
                className="transition-colors hover:text-cyan-300"
              >
                📞 {CONTACT.phone}
              </a>
            </li>
            <li>🕐 {CONTACT.hours}</li>
            <li>
              <Link
                href="/iletisim"
                className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                İletişim sayfası →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Sözleşmeler & politikalar */}
      <div className="border-t border-cyan-400/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-4 text-xs text-muted sm:px-6 lg:px-8">
          <Link href="/sozlesme/kvkk-aydinlatma" className="transition-colors hover:text-cyan-300">
            KVKK Aydınlatma Metni
          </Link>
          <Link href="/sozlesme/uyelik-sozlesmesi" className="transition-colors hover:text-cyan-300">
            Üyelik Sözleşmesi
          </Link>
          <Link href="/sozlesme/mesafeli-satis" className="transition-colors hover:text-cyan-300">
            Mesafeli Satış Sözleşmesi
          </Link>
          <Link href="/sozlesme/on-bilgilendirme" className="transition-colors hover:text-cyan-300">
            Ön Bilgilendirme Formu
          </Link>
          <Link href="/sozlesme/ticari-ileti" className="transition-colors hover:text-cyan-300">
            Ticari Elektronik İleti
          </Link>
        </div>
      </div>

      <div className="border-t border-cyan-400/10 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Gri Akvaryum - Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
