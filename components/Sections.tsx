import Link from "next/link";
import { getCategories, getProducts, type EtCategory } from "@/lib/easytrade";
import { CONTACT } from "@/lib/site";
import ProductCard from "./ProductCard";
import { assignCategoryIcons, CategoryIcon } from "./CategoryIcon";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </span>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}

const gradients = [
  "from-cyan-500/25 to-blue-600/25",
  "from-teal-500/25 to-emerald-600/25",
  "from-amber-500/25 to-orange-600/25",
  "from-violet-500/25 to-purple-600/25",
  "from-green-500/25 to-lime-600/25",
  "from-rose-500/25 to-pink-600/25",
  "from-sky-500/25 to-indigo-600/25",
  "from-fuchsia-500/25 to-purple-600/25",
];

const iconColors = [
  "text-cyan-300",
  "text-teal-300",
  "text-amber-300",
  "text-violet-300",
  "text-lime-300",
  "text-rose-300",
  "text-sky-300",
  "text-fuchsia-300",
];

export async function CategoryGrid() {
  let categories: EtCategory[] = [];
  try {
    categories = await getCategories();
  } catch {
    return null;
  }

  const top = [...categories]
    .sort((a, b) => b.products_count - a.products_count)
    .slice(0, 8);

  const icons = assignCategoryIcons(top.map((c) => c.name));

  return (
    <section
      id="kategoriler"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Kategoriler"
        title="Ne Arıyorsanız Burada"
        subtitle="Balıklardan ekipmanlara, akvaryum dünyasının tüm ihtiyaçları tek çatı altında."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {top.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/urunler?kategori=${cat.id}`}
            className={`glass card-hover group flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br p-6 text-center ${gradients[i % gradients.length]}`}
          >
            <CategoryIcon
              icon={icons[i]}
              className={`h-11 w-11 transition-transform duration-300 group-hover:scale-125 sm:h-13 sm:w-13 ${iconColors[i % iconColors.length]}`}
            />
            <div>
              <div className="font-display text-sm font-semibold sm:text-base">
                {cat.name}
              </div>
              <div className="mt-1 text-xs text-muted">
                {cat.products_count} ürün
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/urunler"
          className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          Tüm kategorileri gör ({categories.length}) →
        </Link>
      </div>
    </section>
  );
}

export async function FeaturedProducts() {
  try {
    const { data } = await getProducts({ page: 1 });
    // Önce görselli ve stokta olanlar
    const featured = [...data]
      .sort((a, b) => {
        const scoreA = (a.images.length > 0 ? 2 : 0) + (a.stock_quantity > 0 ? 1 : 0);
        const scoreB = (b.images.length > 0 ? 2 : 0) + (b.stock_quantity > 0 ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 8);

    return (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Ürünler"
          title="Mağazadan Seçtiklerimiz"
          subtitle="Stoklarımız EasyTrade ile eş zamanlı - gördüğünüz her ürün mağazamızda."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/urunler"
            className="glass inline-block rounded-2xl px-8 py-4 font-semibold transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
          >
            Tüm Ürünleri Gör →
          </Link>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

const features = [
  {
    emoji: "🚚",
    title: "Güvenli Teslimat",
    text: "Canlı balıklar özel oksijenli paketlerle, aynı gün kargoda.",
  },
  {
    emoji: "💙",
    title: "Canlı Balık Garantisi",
    text: "Teslimatta yaşanan kayıplarda koşulsuz değişim garantisi.",
  },
  {
    emoji: "🧑‍🔬",
    title: "Uzman Desteği",
    text: "Akvaryum kurulumundan su değerlerine, her konuda yanınızdayız.",
  },
  {
    emoji: "⚡",
    title: "Güncel Stok",
    text: "Mağaza stoklarıyla eş zamanlı çalışan online envanter.",
  },
];

export function Features() {
  return (
    <section
      id="hakkimizda"
      className="relative scroll-mt-20 overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Neden Gri Akvaryum?"
          title="Hobinize Değer Katıyoruz"
          subtitle="Yılların tecrübesiyle akvaryum tutkunlarının güvenilir adresi."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass card-hover animate-float rounded-3xl p-7"
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <span className="text-4xl">{f.emoji}</span>
              <h3 className="font-display mt-4 text-lg font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="glass glow relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Akvaryumunuz İçin{" "}
            <span className="text-gradient">Uzman Tavsiyesi</span> mi Lazım?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Balık seçimi, akvaryum kurulumu veya su değerleri hakkında
            sorularınız için bize ulaşın - birlikte en doğru çözümü bulalım.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/iletisim"
              className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-4 font-semibold text-slate-950 transition-transform hover:scale-105 sm:w-auto"
            >
              İletişime Geç
            </Link>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-semibold text-slate-950 transition-transform hover:scale-105 sm:w-auto"
            >
              WhatsApp&apos;tan Yaz
            </a>
            <a
              href={CONTACT.phoneHref}
              className="glass w-full rounded-2xl px-8 py-4 font-semibold transition-colors hover:border-cyan-400/40 sm:w-auto"
            >
              Hemen Ara
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
