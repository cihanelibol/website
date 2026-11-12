// Yardım Merkezi içerik modeli.
// Her makale blok listesinden oluşur; bloklar makale sayfasında
// zengin tipografiyle (başlık, adım listesi, uyarı kutusu, tablo...) render edilir.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; title: string }
  | { type: "h3"; title: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | {
      type: "callout";
      variant: "tip" | "warning" | "info";
      title: string;
      text: string;
    }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] };

export type Faq = { q: string; a: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** Bağlı olduğu kategori slug'ı */
  category: string;
  keywords: string[];
  /** Son güncelleme - ISO tarih (SEO / yapılandırılmış veri) */
  updated: string;
  /** Tahmini okuma süresi (dakika) */
  minutes: number;
  blocks: Block[];
  faq?: Faq[];
  /** İlgili makale slug'ları */
  related?: string[];
};

export type Category = {
  slug: string;
  title: string;
  icon: string;
  description: string;
};
