import type { EtProduct } from "./easytrade";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(price);
}

// Görseli olmayan ürünler için kategori/isim bazlı ikon seçimi
export function productIcon(product: EtProduct): string {
  const haystack = [product.name, ...product.categories.map((c) => c.name)]
    .join(" ")
    .toLocaleLowerCase("tr-TR");

  const rules: [RegExp, string][] = [
    [/yem|vitamin|besin/, "food"],
    [/filtre|motor|pompa|hava/, "settings"],
    [/ısıtıcı|termostat|termometre/, "thermometer"],
    [/led|aydınlatma|lamba|armatür/, "light"],
    [/bitki|moss|tohum/, "leaf"],
    [/dekor|taban|kum|çakıl|kaya|mercan/, "coral"],
    [/akvaryum|fanus|tank/, "tank"],
    [/kedi/, "paw"],
    [/köpek/, "paw"],
    [/kuş/, "paw"],
    [/balık|tetra|lepistes|beta|japon|moli|cichlid|ciklet/, "fish"],
    [/ilaç|bakım|su düzenleyici|şartlandırıcı/, "flask"],
    [/kescher|kepçe|sifon|hortum/, "bucket"],
  ];

  for (const [pattern, icon] of rules) {
    if (pattern.test(haystack)) return icon;
  }
  return "fish";
}

export function primaryImage(product: EtProduct): string | null {
  if (product.images.length === 0) return null;
  const primary = product.images.find((i) => i.is_primary);
  return (primary ?? product.images[0]).url;
}
