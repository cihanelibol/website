import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleButton from "@/components/GoogleButton";
import { googleConfigured } from "@/lib/auth";
import GirisForm from "./GirisForm";

export const metadata = {
  title: "Giriş Yap | Gri Akvaryum",
  description: "Gri Akvaryum hesabınıza giriş yapın.",
};

const HATA_MESAJLARI: Record<string, string> = {
  "google-kapali": "Google ile giriş şu anda kullanılamıyor.",
  "google-dogrulama": "Google doğrulaması tamamlanamadı. Lütfen tekrar deneyin.",
  "google-jeton": "Google ile bağlantı kurulamadı. Lütfen tekrar deneyin.",
  "google-profil": "Google profil bilgisi alınamadı. Lütfen tekrar deneyin.",
  "google-eposta": "Google hesabınızın e-posta bilgisi alınamadı.",
  "google-genel": "Google ile giriş sırasında bir sorun oluştu.",
};

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;
  const hataMesaji = hata ? HATA_MESAJLARI[hata] : undefined;

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
          {hataMesaji && (
            <p className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-300">
              ⚠ {hataMesaji}
            </p>
          )}
          {googleConfigured() && <GoogleButton />}
          <GirisForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
