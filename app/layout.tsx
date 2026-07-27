import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// smartcallcenter.com.tr'deki italik vurgu yazısıyla aynı font
const script = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin", "latin-ext"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Gri Akvaryum | Akvaryum & Balık Galerisi",
  description:
    "Gri Akvaryum - akvaryum, süs balığı, yem ve ekipmanda uzman adresiniz. Canlı balık garantisi, uzman desteği ve hızlı teslimat.",
  keywords: [
    "akvaryum",
    "süs balığı",
    "petshop",
    "balık yemi",
    "akvaryum ekipmanları",
  ],
};

export const viewport: Viewport = {
  themeColor: "#04101c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`h-full antialiased ${script.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
