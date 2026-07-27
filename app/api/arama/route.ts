import { NextRequest, NextResponse } from "next/server";
import { getProducts, primaryImage, productEmoji } from "@/lib/easytrade";
import { articles, categories, type Article, type Block } from "@/lib/rehber";

export type SearchProductHit = {
  id: number;
  name: string;
  sku: string | null;
  price: number;
  image: string | null;
  emoji: string;
  inStock: boolean;
};

export type SearchArticleHit = {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  minutes: number;
};

export type SearchResponse = {
  products: SearchProductHit[];
  articles: SearchArticleHit[];
  productTotal: number;
};

const MAX_PRODUCTS = 5;
const MAX_ARTICLES = 5;

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
      return block.text;
    case "h2":
    case "h3":
      return block.title;
    case "ul":
      return block.items.join(" ");
    case "steps":
      return block.items.map((s) => `${s.title} ${s.text}`).join(" ");
    case "callout":
      return `${block.title} ${block.text}`;
    case "table":
      return [block.caption ?? "", ...block.headers, ...block.rows.flat()].join(" ");
  }
}

// Makale başına aranabilir metin - modül yüklenirken bir kez hazırlanır
const haystacks = new Map<
  string,
  { title: string; keywords: string; description: string; body: string }
>(
  articles.map((a) => [
    a.slug,
    {
      title: a.title.toLocaleLowerCase("tr-TR"),
      keywords: a.keywords.join(" ").toLocaleLowerCase("tr-TR"),
      description: a.description.toLocaleLowerCase("tr-TR"),
      body: [
        ...a.blocks.map(blockText),
        ...(a.faq ?? []).map((f) => `${f.q} ${f.a}`),
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR"),
    },
  ])
);

function searchArticles(query: string): Article[] {
  const tokens = query
    .toLocaleLowerCase("tr-TR")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (tokens.length === 0) return [];

  const scored = articles
    .map((a) => {
      const h = haystacks.get(a.slug)!;
      let score = 0;
      for (const t of tokens) {
        if (h.title.includes(t)) score += 5;
        if (h.keywords.includes(t)) score += 3;
        if (h.description.includes(t)) score += 2;
        if (h.body.includes(t)) score += 1;
      }
      return { a, score };
    })
    .filter((s) => s.score > 0);

  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, MAX_ARTICLES).map((s) => s.a);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json<SearchResponse>({
      products: [],
      articles: [],
      productTotal: 0,
    });
  }

  const categoryEmoji = new Map(categories.map((c) => [c.slug, c.emoji]));

  // Ürün araması dış API'ye gider - hata olursa rehber sonuçları yine dönsün
  const productsPromise = getProducts({ search: q })
    .then((res) => ({
      hits: res.data.slice(0, MAX_PRODUCTS).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price_with_tax,
        image: primaryImage(p),
        emoji: productEmoji(p),
        inStock: p.stock_quantity > 0,
      })),
      total: res.pagination.total,
    }))
    .catch(() => ({ hits: [] as SearchProductHit[], total: 0 }));

  const [products, articleHits] = await Promise.all([
    productsPromise,
    Promise.resolve(searchArticles(q)),
  ]);

  return NextResponse.json<SearchResponse>({
    products: products.hits,
    productTotal: products.total,
    articles: articleHits.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      emoji: categoryEmoji.get(a.category) ?? "📖",
      category: a.category,
      minutes: a.minutes,
    })),
  });
}
