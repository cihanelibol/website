import AppIcon from "@/components/AppIcon";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAddresses } from "@/lib/addresses";
import { deleteAddressAction } from "../actions";
import AdresForm from "./AdresForm";

export default async function AdreslerPage() {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const addresses = await getAddresses(session.uid);

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6">
        <h2 className="font-display mb-5 text-lg font-bold">
          <AppIcon name="pin" /> Kayıtlı Adreslerim
        </h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-muted">
            Henüz kayıtlı adresiniz yok. Aşağıdan ilk adresinizi ekleyin —
            siparişlerinizde otomatik kullanabilirsiniz.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="glass rounded-2xl p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-cyan-200">
                    {addr.title}
                  </span>
                  <form action={deleteAddressAction.bind(null, addr.id)}>
                    <button
                      className="rounded-lg p-1.5 text-xs text-muted transition-colors hover:bg-red-400/10 hover:text-red-300"
                      aria-label="Adresi sil"
                    >
                      <AppIcon name="trash" /> Sil
                    </button>
                  </form>
                </div>
                <div className="text-sm font-medium">{addr.fullName}</div>
                <div className="mt-1 text-sm leading-relaxed text-muted">
                  {addr.address}
                  <br />
                  {addr.district && `${addr.district}, `}
                  {addr.city} {addr.postalCode}
                  <br />
                  {addr.phone}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-display mb-5 text-lg font-bold">
          <AppIcon name="plus" /> Yeni Adres Ekle
        </h2>
        <AdresForm />
      </section>
    </div>
  );
}
