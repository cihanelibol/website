import AppIcon from "@/components/AppIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/site";
import IletisimForm from "./IletisimForm";

export const metadata = {
  title: "İletişim | Gri Akvaryum",
  description:
    "Gri Akvaryum & Balık Galerisi - Eminönü, Fatih/İstanbul. Adres, telefon, çalışma saatleri ve iletişim formu.",
};

const infoCards = [
  {
    icon: "pin",
    title: "Adres",
    content: CONTACT.address,
    href: CONTACT.mapsUrl,
    linkLabel: "Yol tarifi al →",
  },
  {
    icon: "phone",
    title: "Telefon",
    content: CONTACT.phone,
    href: CONTACT.phoneHref,
    linkLabel: "Hemen ara →",
  },
  {
    icon: "message",
    title: "WhatsApp",
    content: CONTACT.whatsapp,
    href: CONTACT.whatsappHref,
    linkLabel: "Mesaj gönder →",
  },
  {
    icon: "clock",
    title: "Çalışma Saatleri",
    content: CONTACT.hours,
  },
];

export default function IletisimPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container pb-20 pt-28">
        <div className="mx-auto mb-12 max-w-2xl text-center">

          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Bize Ulaşın
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Eminönü&apos;ndeki mağazamıza bekleriz - sorularınız için telefon,
            WhatsApp veya aşağıdaki formu kullanabilirsiniz.
          </p>
          <p className="mt-3 text-sm text-muted">

            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              Google Haritalar’da güncel müşteri yorumları
            </a>{" "}

          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => (
            <div key={card.title} className="glass card-hover rounded-3xl p-6">
              <span className="text-3xl"><AppIcon name={card.icon ?? "book"} /></span>
              <h2 className="font-display mt-3 text-lg font-semibold">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.content}
              </p>
              {card.href && (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="mt-3 inline-block text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  {card.linkLabel}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass overflow-hidden rounded-3xl">
            <iframe
              src={CONTACT.mapsEmbedUrl}
              title={`${CONTACT.name} - Google Haritalar`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full border-0 lg:min-h-[480px]"
            />
          </div>

          <div className="glass rounded-3xl p-8">
            <h2 className="font-display mb-1 text-2xl font-bold tracking-tight">
              İletişim Formu
            </h2>
            <p className="mb-6 text-sm text-muted">
              Formu doldurun, en kısa sürede size dönelim.
            </p>
            <IletisimForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
