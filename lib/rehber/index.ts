import type { Article, Category } from "./types";
import { baslangicArticles } from "./baslangic";
import { tatliSuArticles } from "./tatli-su";
import { tuzluSuArticles } from "./tuzlu-su";
import { suKimyasiArticles } from "./su-kimyasi";
import { saglikArticles } from "./saglik";
import { ekipmanArticles } from "./ekipman";

export type { Article, Block, Category, Faq } from "./types";

export const categories: Category[] = [
  {
    slug: "baslangic",
    title: "Başlangıç Rehberi",
    emoji: "🐟",
    description:
      "İlk akvaryumunuzu kurun: tank seçimi, döngü süreci, ekipmanlar ve ilk balıklar.",
  },
  {
    slug: "tatli-su",
    title: "Tatlı Su Akvaryumu",
    emoji: "🌿",
    description:
      "Bakım rutini, temizlik, bitkili akvaryum, yosun kontrolü ve omurgasızlar.",
  },
  {
    slug: "tuzlu-su",
    title: "Tuzlu Su & Resif",
    emoji: "🪸",
    description:
      "Deniz akvaryumu kurulumu, tuz ve yoğunluk, canlı kaya, mercanlar ve skimmer.",
  },
  {
    slug: "su-kimyasi",
    title: "Su Kimyası",
    emoji: "💧",
    description:
      "pH, sertlik, azot döngüsü, su testleri ve su katkı ürünlerinin doğru kullanımı.",
  },
  {
    slug: "saglik",
    title: "Balık Sağlığı & Yemleme",
    emoji: "🧪",
    description:
      "Hastalık teşhis ve tedavisi, karantina, stres yönetimi ve doğru beslenme.",
  },
  {
    slug: "ekipman",
    title: "Ekipman & Ürün Kullanımı",
    emoji: "⚙️",
    description:
      "Filtre, ısıtıcı, aydınlatma, hava motoru ve CO2 - seçim, kurulum ve bakım.",
  },
];

/** Kategori sırasına göre dizilmiş tüm makaleler */
export const articles: Article[] = [
  ...baslangicArticles,
  ...tatliSuArticles,
  ...tuzluSuArticles,
  ...suKimyasiArticles,
  ...saglikArticles,
  ...ekipmanArticles,
];

const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getArticle(slug: string): Article | undefined {
  return articleBySlug.get(slug);
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.category === categorySlug);
}

/** Aynı kategori içinde önceki/sonraki makale (docs gezinmesi için) */
export function getAdjacentArticles(slug: string): {
  prev?: Article;
  next?: Article;
} {
  const article = articleBySlug.get(slug);
  if (!article) return {};
  const siblings = getArticlesByCategory(article.category);
  const i = siblings.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? siblings[i - 1] : undefined,
    next: i < siblings.length - 1 ? siblings[i + 1] : undefined,
  };
}

export function getRelatedArticles(article: Article): Article[] {
  return (article.related ?? [])
    .map((slug) => articleBySlug.get(slug))
    .filter((a): a is Article => Boolean(a));
}
