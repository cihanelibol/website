import AuthShell from "@/components/AuthShell";

export const metadata = {
  robots: { index: false, follow: true },
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

  return <AuthShell error={hataMesaji} />;
}
