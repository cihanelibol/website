import { CONTACT } from "@/lib/site";

export default function StoreContactBar() {
  return (
    <section className="store-topbar" aria-label="Mağaza iletişim bilgileri">
      <div className="store-container">
        <div>
          <strong>Gri Akvaryum güvencesiyle</strong>
          <span className="store-contact-support">Uzman desteği</span>
          <span>Mağaza: {CONTACT.hours.toLocaleLowerCase("tr-TR")}</span>
        </div>
        <div>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
