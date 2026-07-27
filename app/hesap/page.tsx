import { redirect } from "next/navigation";
import { getProfile } from "./actions";
import { ParolaForm, ProfilForm } from "./ProfilForms";

export default async function ProfilPage() {
  const user = await getProfile();
  if (!user) redirect("/giris");

  return (
    <div className="space-y-6">
      <section className="glass rounded-3xl p-6">
        <h2 className="font-display mb-5 text-lg font-bold">
          👤 Profil Bilgilerim
        </h2>
        <ProfilForm
          name={user.name}
          email={user.email}
          phone={user.phone ?? ""}
        />
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="font-display mb-5 text-lg font-bold">
          🔒 Parola Değiştir
        </h2>
        <ParolaForm />
      </section>

      <section className="glass rounded-3xl p-6 text-sm text-muted">
        <h2 className="font-display mb-3 text-lg font-bold text-foreground">
          📄 Üyelik Bilgileri
        </h2>
        <p>
          Üyelik tarihi:{" "}
          {new Date(user.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="mt-1">
          Ticari ileti onayı:{" "}
          {user.marketingConsent ? (
            <span className="text-teal-400">Verildi</span>
          ) : (
            <span>Verilmedi</span>
          )}
        </p>
      </section>
    </div>
  );
}
