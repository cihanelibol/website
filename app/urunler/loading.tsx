import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function Loading() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="store-container py-8" aria-busy="true">
        <p role="status" className="mb-6 font-semibold">
          Ürünler yükleniyor…
        </p>
        <div className="store-product-grid" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="store-product">
              <div className="aspect-square bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-slate-100" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
                <div className="h-10 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
