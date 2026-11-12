import type { Metadata } from "next";
import type { EtProduct } from "./easytrade";
import { BRANDS, productMatchesBrand } from "./catalog";
import { CONTACT, SITE_URL } from "./site";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export const jsonLdString = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export function pageMetadata(title: string, description: string, path: string, image = "/images/store-hero/magaza-3.webp"): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Gri Akvaryum", locale: "tr_TR", type: "website", images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) };
}

export const storeSchema = {
  "@context": "https://schema.org", "@type": "PetStore", "@id": `${SITE_URL}/#store`,
  name: CONTACT.name, url: SITE_URL, telephone: CONTACT.phoneHref.replace("tel:", ""),
  image: absoluteUrl("/images/store-hero/magaza-3.webp"), logo: absoluteUrl("/logo-mark.png"),
  address: { "@type": "PostalAddress", streetAddress: "Rüstem Paşa Mah. Tahmis Sk. Çiçekçiler Sitesi No:2 C Blok No:13", addressLocality: "Fatih", addressRegion: "İstanbul", postalCode: "34112", addressCountry: "TR" },
  hasMap: CONTACT.mapsUrl,
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "19:00" }],
};

// Emit only verified catalogue fields. Do not infer GTINs or variant offers.
export function productSchema(product: EtProduct, rating: { count: number; average: number }) {
  const brand = BRANDS.find(b => productMatchesBrand(product, b));
  const url = absoluteUrl(`/urunler/${product.id}`);
  const currency = product.currency.value.toUpperCase();
  return {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, url,
    name: product.name, ...(product.description?.trim() ? { description: product.description.trim() } : {}),
    ...(product.images.length ? { image: product.images.map(i => absoluteUrl(i.url)) } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand.label } } : {}),
    ...(!product.has_variations && product.price_with_tax > 0 && ["TRY", "TL"].includes(currency) ? {
      offers: { "@type": "Offer", url, price: product.price_with_tax.toFixed(2), priceCurrency: "TRY", availability: `https://schema.org/${product.stock_quantity > 0 ? "InStock" : "OutOfStock"}`, seller: { "@id": `${SITE_URL}/#store` } },
    } : {}),
    ...(rating.count > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: Number(rating.average.toFixed(1)), reviewCount: rating.count, bestRating: 5, worstRating: 1 } } : {}),
  };
}
