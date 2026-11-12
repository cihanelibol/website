import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser, getAdminUser } from "@/lib/auth";
import HesapNav from "./HesapNav";

export const metadata = {
  title: "Hesabım | Gri Akvaryum",
};

export default async function HesapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const user = await getAdminUser();
  const isAdmin = Boolean(user);

  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container min-h-svh pb-20 pt-24">
        <h1 className="font-display mb-8 text-2xl font-bold tracking-tight sm:text-4xl">
          Hesabım
        </h1>
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-8">
          <HesapNav userName={session.name} isAdmin={isAdmin} />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
