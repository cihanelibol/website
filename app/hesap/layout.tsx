import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser, getUserById, isAdminEmail } from "@/lib/auth";
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

  const user = await getUserById(session.uid);
  const isAdmin = Boolean(user && isAdminEmail(user.email));

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-svh w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
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
