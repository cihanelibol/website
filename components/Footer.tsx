import Image from "next/image";
import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import { PaymentLogoBand } from "@/components/PaymentLogos";
import { CONTACT } from "@/lib/site";

const categories = [
  ["/urunler?grup=baliklar-canlilar", "Süs balıkları"],
  ["/urunler?grup=akvaryumlar", "Akvaryumlar"],
  ["/urunler?grup=yemler", "Yem & vitamin"],
  ["/urunler?grup=filtreler", "Ekipman & filtre"],
  ["/urunler?grup=su-bakimi", "Su bakımı"],
  ["/urunler", "Tüm ürünler"],
];

const help = [
  ["/rehber", "Akvaryum rehberi"],
  ["/hesap/siparisler", "Siparişlerim"],
  ["/sozlesme/on-bilgilendirme", "Kargo ve teslimat"],
  ["/sozlesme/mesafeli-satis", "Mesafeli satış sözleşmesi"],
  ["/sozlesme/uyelik-sozlesmesi", "Üyelik sözleşmesi"],
  ["/iletisim", "Bize ulaşın"],
];

export default function Footer() {
  return (
    <footer id="iletisim" className="store-footer">
      <div className="store-container">
        <div className="store-footer-grid">
          <div className="store-footer-info">
            <nav className="store-footer-nav" aria-label="Alt menü ürün kategorileri">
              <h2>Keşfedin</h2>
              <ul>
                {categories.map(([href, label]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav className="store-footer-nav" aria-label="Yardım ve alışveriş bilgileri">
              <h2>Yardım & alışveriş</h2>
              <ul>
                {help.map(([href, label]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </nav>
            <section className="store-footer-visit" aria-labelledby="footer-visit-title">
              <h2 id="footer-visit-title">Eminönü’nde buluşalım</h2>
              <p>Su altı dünyasını mağazamızda keşfedin. Akvaryumunuz için birlikte seçim yapalım.</p>
              <address><AppIcon name="pin" size={19} /><span>{CONTACT.address}</span></address>
              <p className="store-footer-hours"><AppIcon name="clock" size={17} />{CONTACT.hours}</p>
              <a className="store-footer-map" href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
                Yol tarifi alın <span aria-hidden="true">↗</span>
              </a>
            </section>
          </div>
          <section className="store-footer-contact" aria-labelledby="footer-contact-title">
            <span className="store-footer-contact-icon"><AppIcon name="message" size={24} /></span>
            <h2 id="footer-contact-title">Aklınıza takılan<br />bir şey mi var?</h2>
            <p>Ekibimiz yardımcı olsun.</p>
            <a className="store-footer-phone" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <span className="store-footer-contact-hours">{CONTACT.hours}</span>
            <a className="store-footer-whatsapp" href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
              <AppIcon name="message" size={19} /> WhatsApp destek
            </a>
          </section>
        </div>
        <div className="store-footer-bottom">
          <Link href="/" className="store-footer-brand" aria-label="Gri Akvaryum ana sayfa">
            <Image src="/logo-mark.png" alt="" width={48} height={48} />
            <span><strong>Gri Akvaryum</strong><small>Akvaryum & balık galerisi</small></span>
          </Link>
          <div className="store-footer-center">
            <PaymentLogoBand tone="white" className="store-footer-payment" />
            <p>© {new Date().getFullYear()} Gri Akvaryum. Tüm hakları saklıdır.</p>
          </div>
          <nav className="store-footer-legal" aria-label="Gizlilik ve yasal bilgiler">
            <Link href="/sozlesme/kvkk-aydinlatma">KVKK aydınlatma metni</Link>
            <Link href="/sozlesme/on-bilgilendirme">Ön bilgilendirme</Link>
            <Link href="/sozlesme/ticari-ileti">Ticari elektronik ileti</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
