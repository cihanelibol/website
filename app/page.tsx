import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Hero, { type HeroTopProduct } from "@/components/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import Footer from "@/components/Footer";
import {
  CategoryGrid,
  FeaturedProducts,
  Features,
  CTA,
} from "@/components/Sections";
import {
  formatPrice,
  getCategories,
  getProducts,
  primaryImage,
  productEmoji,
} from "@/lib/easytrade";

function readStorePhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "store");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/store/${f}`);
  } catch {
    return [];
  }
}

export default async function Home() {
  let totalProducts: number | undefined;
  let totalCategories: number | undefined;
  let topProducts: HeroTopProduct[] = [];

  try {
    const [result, categories] = await Promise.all([
      getProducts({ page: 1 }),
      getCategories(),
    ]);
    totalProducts = result.pagination.total;
    totalCategories = categories.length;
    topProducts = [...result.data]
      .sort((a, b) => {
        const scoreA =
          (a.images.length > 0 ? 2 : 0) + (a.stock_quantity > 0 ? 1 : 0);
        const scoreB =
          (b.images.length > 0 ? 2 : 0) + (b.stock_quantity > 0 ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: formatPrice(p.price_with_tax),
        image: primaryImage(p),
        emoji: productEmoji(p),
      }));
  } catch {
    // Katalog erişilemezse hero varsayılan değerlerle gösterilir
  }

  const storePhotos = readStorePhotos();

  return (
    <>
      <Navbar />
      <main>
        <Hero
          totalProducts={totalProducts}
          totalCategories={totalCategories}
          storePhotos={storePhotos}
          topProducts={topProducts}
        />
        <BrandMarquee />
        <CategoryGrid />
        <FeaturedProducts />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
