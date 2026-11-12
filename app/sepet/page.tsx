import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSessionUser, getUserById } from "@/lib/auth";
import { getAddresses, type Address } from "@/lib/addresses";
import { paymentConfigured } from "@/lib/payments";
import SepetClient from "./SepetClient";

export const metadata = {
  title: "Sepetim | Gri Akvaryum",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
};

export default async function SepetPage() {
  const session = await getSessionUser();
  let addresses: Address[] = [];
  let profile: { name: string; email: string; phone: string } | undefined;

  if (session) {
    const [addrs, user] = await Promise.all([
      getAddresses(session.uid),
      getUserById(session.uid),
    ]);
    addresses = addrs;
    if (user) {
      profile = { name: user.name, email: user.email, phone: user.phone ?? "" };
    }
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container min-h-svh pb-20 pt-24">
        <div className="mb-8">
          <nav className="mb-1 text-xs text-muted">
            <Link href="/" className="hover:text-cyan-300">
              Ana Sayfa
            </Link>
            {" / "}
            Sepetim
          </nav>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
            Sepetim
          </h1>
        </div>
        <SepetClient
          addresses={addresses}
          profile={profile}
          paymentReady={paymentConfigured()}
        />
      </main>
      <Footer />
    </>
  );
}
