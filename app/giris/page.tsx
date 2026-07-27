import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GirisForm from "./GirisForm";

export const metadata = {
  title: "Giriş Yap | Gri Akvaryum",
  description: "Gri Akvaryum hesabınıza giriş yapın.",
};

export default function GirisPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-svh w-full max-w-7xl items-center justify-center px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="glass w-full max-w-md rounded-3xl p-8">
          <h1 className="font-display mb-1 text-2xl font-bold tracking-tight">
            Giriş Yap
          </h1>
          <p className="mb-6 text-sm text-muted">
            Tekrar hoş geldiniz! Hesabınıza giriş yapın.
          </p>
          <GirisForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
