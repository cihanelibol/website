import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SepetClient from "./SepetClient";

export const metadata = {
  title: "Sepetim | Gri Akvaryum",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
};

export default function SepetPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-svh w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="mb-1 text-xs text-muted">
            <Link href="/" className="hover:text-cyan-300">
              Ana Sayfa
            </Link>
            {" / "}
            Sepetim
          </nav>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
            🛒 Sepetim
          </h1>
        </div>
        <SepetClient />
      </main>
      <Footer />
    </>
  );
}
