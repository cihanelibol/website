import type { Metadata } from "next";
import type { EtProduct } from "./easytrade";
import { BRANDS, productMatchesBrand } from "./catalog";
import { CONTACT, SITE_URL } from "./site";
import { productDescription, validatedGtin } from "./product-seo";
import { SHIPPING, shippingFee } from "./shipping";
import type { Review } from "./reviews";

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
  // Google's Organization-level "Option B" accepts a policy URL without inventing fees.
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    merchantReturnLink: absoluteUrl("/sozlesme/mesafeli-satis"),
  },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "19:00" }],
};

// Emit only verified catalogue fields and the same approved reviews shown on the page.
export function productSchema(product: EtProduct, rating: { count: number; average: number }, reviews: Review[] = []) {
  const brand = BRANDS.find(b => productMatchesBrand(product, b));
  const url = absoluteUrl(`/urunler/${product.id}`);
  const currency = product.currency.value.toUpperCase();
  const hasOffer = !product.has_variations && Number.isFinite(product.price_with_tax) && Math.round(product.price_with_tax * 100) > 0 && ["TRY", "TL"].includes(currency);
  const hasRating = Number.isInteger(rating.count) && rating.count > 0 && Number.isFinite(rating.average) && rating.average >= 1 && rating.average <= 5;
  // A Product without offers, review or aggregateRating fails Google's required fields.
  if (!hasOffer && !hasRating) return null;
  const gtin = validatedGtin(product.barcode);
  const publishedReviews = reviews.filter(r => r.productId === product.id && r.moderation === "approved" && r.name.trim() && r.comment.trim() && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 && Number.isFinite(Date.parse(r.createdAt)));
  return {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, url,
    name: product.name, description: productDescription(product),
    ...(product.images.length ? { image: product.images.map(i => absoluteUrl(i.url)) } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(gtin ? { gtin } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand.label } } : {}),
    ...(hasOffer ? {
      offers: {
        "@type": "Offer", url, price: product.price_with_tax.toFixed(2), priceCurrency: "TRY", availability: `https://schema.org/${product.stock_quantity > 0 ? "InStock" : "OutOfStock"}`, seller: { "@id": `${SITE_URL}/#store` },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: { "@type": "DefinedRegion", addressCountry: SHIPPING.country },
          shippingRate: { "@type": "MonetaryAmount", value: shippingFee(product.price_with_tax), currency: "TRY" },
          shippingSettingsLink: absoluteUrl(SHIPPING.policyPath),
          deliveryTime: {
            "@type": "ShippingDeliveryTime", cutoffTime: SHIPPING.cutoffTime,
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
          },
        },
      },
    } : {}),
    ...(hasRating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: Number(rating.average.toFixed(1)), reviewCount: rating.count, bestRating: 5, worstRating: 1 } } : {}),
    ...(publishedReviews.length ? { review: publishedReviews.map(r => ({
      "@type": "Review", author: { "@type": "Person", name: r.name }, reviewBody: r.comment,
      datePublished: new Date(r.createdAt).toISOString(),
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    })) } : {}),
  };
}
