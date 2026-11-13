import AuthShell from "@/components/AuthShell";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Kayıt Ol | Gri Akvaryum",
  description: "Gri Akvaryum'a üye olun - siparişlerinizi kolayca takip edin.",
};

export default function KayitPage() {
  return <AuthShell initialScreen="register" />;
}
