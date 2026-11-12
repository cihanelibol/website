import AppIcon from "@/components/AppIcon";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAdminUser } from "@/lib/auth";
import AdminNav from "./AdminNav";

export const metadata = {
  title: "Yönetim Paneli | Gri Akvaryum",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/hesap/guvenlik");

  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container min-h-svh pb-20 pt-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Gri Akvaryum
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
              <AppIcon name="settings" /> Yönetim Paneli
            </h1>
          </div>
          <span className="glass rounded-full px-4 py-2 text-xs text-muted">
            Yönetici: <strong className="text-foreground">{admin.email}</strong>
          </span>
        </div>
        <AdminNav />
        {children}
      </main>
      <Footer />
    </>
  );
}
