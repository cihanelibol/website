import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { CartProvider } from "@/components/cart/CartProvider";
import StoreContactBar from "@/components/StoreContactBar";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { SITE_URL } from "@/lib/site";
import { OCEAN_INTRO_BOOTSTRAP } from "@/lib/ocean-intro";
import "./globals.css";
import "./storefront.css";
import "./ocean-entry.css";

// CSP nonces are request-specific; never serve a cached HTML nonce.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Gri Akvaryum | Eminönü Akvaryum Mağazası ve Balık Galerisi",
  description:
    "Eminönü Gri Akvaryum mağazasında akvaryum, süs balığı, yem ve ekipmanları keşfedin. Güncel ürünler, bakım rehberleri ve mağazadan seçim desteği.",
  keywords: [
    "akvaryum",
    "süs balığı",
    "petshop",
    "balık yemi",
    "akvaryum ekipmanları",
  ],
};

export const viewport: Viewport = {
  themeColor: "#031d3a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="tr"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: OCEAN_INTRO_BOOTSTRAP }} />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreContactBar />
        <CartProvider>{children}</CartProvider>
        <AnalyticsConsent nonce={nonce} />
      </body>
    </html>
  );
}
