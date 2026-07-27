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
  themeColor: "#f2f7fa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-theme="light"
      suppressHydrationWarning
      className={`h-full antialiased ${script.variable}`}
    >
      <head>
        {/* Kaydedilmiş temayı ilk boyamadan önce uygula (FOUC önlemi) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
