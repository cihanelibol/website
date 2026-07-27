import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleButton from "@/components/GoogleButton";
import { googleConfigured } from "@/lib/auth";
import KayitForm from "./KayitForm";

export const metadata = {
  title: "Kayıt Ol | Gri Akvaryum",
  description: "Gri Akvaryum'a üye olun - siparişlerinizi kolayca takip edin.",
};

export default function KayitPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-svh w-full max-w-7xl items-center justify-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="glass w-full max-w-md rounded-3xl p-8">
          <h1 className="font-display mb-1 text-2xl font-bold tracking-tight">
            Kayıt Ol
          </h1>
          <p className="mb-6 text-sm text-muted">
            Ücretsiz hesap oluşturun. Üyelik olmadan da sipariş verebilirsiniz.
          </p>
          {googleConfigured() && <GoogleButton />}
          <KayitForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
