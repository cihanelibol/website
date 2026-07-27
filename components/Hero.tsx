"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { openSiteSearch, SearchIcon } from "./SiteSearch";

const bubbles = [
  { left: "6%", size: 14, duration: 11, delay: 0 },
  { left: "16%", size: 8, duration: 14, delay: 3 },
  { left: "28%", size: 18, duration: 9, delay: 1.5 },
  { left: "44%", size: 10, duration: 13, delay: 5 },
  { left: "57%", size: 20, duration: 10, delay: 2 },
  { left: "72%", size: 9, duration: 15, delay: 6 },
  { left: "85%", size: 14, duration: 12, delay: 0.8 },
  { left: "94%", size: 11, duration: 9.5, delay: 4 },
];

// Google Maps'ten alınan GERÇEK 5 yıldızlı yorumlar (27 Temmuz 2026).
// photo: Google profil fotoğrafı; yüklenemezse isimden baş harfli avatar üretilir.
const googleReviews: { name: string; text: string; photo?: string }[] = [
  {
    name: "Arif Eraslan",
    text: "Kalitenin tek adresi diyorum mutlak gidin mutlaka tavsiye edin mutlaka uğrayın kaçırmayın derim. Bu zamanda böyle esnaflık böyle nezaket ilgi alaka muhteşem tek kelime ile muhteşem bir yer",
    photo:
      "/reviews/arif-eraslan.png",
  },
  {
    name: "Ziya Cakilci",
    text: "Ailecek akvaryum almaya gittik çok memnun kaldık her konuda yakından ilgilendiler özellikle küçük kızım çok memnun kaldı akvaryum ve balıkları alırken çok yardımcı oldular. Gönül rahatlığı ile alışveriş yapabilirsiniz.",
    photo:
      "/reviews/ziya-cakilci.png",
  },
  {
    name: "Fūsun Akgün",
    text: "Harika esnaflar! Esnaf gibi esnaflar, ilgilenip dinleyip anlayıp kafa yoran harika insanlar. Elinize bir şey verip göndermiyorlar, satmak için satmıyorlar; bu olmaz diyebiliyorlar…",
    photo:
      "/reviews/fusun-akgun.png",
  },
  {
    name: "Yiğithan SOLGUN",
    text: "Buraya bayılıyorum bir sürü balık türleri var ve hepsi gayet sağlıklı ve temiz sular içinde. Özellikle çalışan ablalar güler yüzlü ve çok bilgililer. Kesinlikle gelmenizi tavsiye ederim.",
    photo:
      "/reviews/yigithan-solgun.png",
  },
  {
    name: "Gülbahar Akyürek",
    text: "Çok güzel ve kalite ürünleri ile güzel bir işletme çalışan ablamız çok yardımcı oldu herkese tavsiye ederiz",
    photo:
      "/reviews/gulbahar-akyurek.png",
  },
  {
    name: "Zafer Menküç",
    text: "Güler yüzlü samimi bir yer. Fiyatlar çok uygun. Yardımcı oluyorlar. Her türlü balık akvaryum aksesuar mevcut.",
    photo:
      "/reviews/zafer-menkuc.png",
  },
  {
    name: "H. Murat Ayırga",
    text: "Kaliteli hizmet, güler yüz, müşteri memnuniyetini önemseyen bir bakış açısı. Teşekkürler",
    photo:
      "/reviews/murat-ayirga.png",
  },
  {
    name: "Samet Kartal",
    text: "Güzel memnunum, çeşit çok, fiyatlar gayet uygun. Müşteri ile baya iyi davranıyorlar, gayet uygun iş yeri.",
    photo:
      "/reviews/samet-kartal.png",
  },
];

// Avatar renkleri: Google'ın profil harfi renklerine benzer, isme göre sabit
const avatarGradients = [
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-indigo-600",
  "from-fuchsia-500 to-pink-600",
  "from-teal-500 to-cyan-600",
];

export type HeroTopProduct = {
  id: number;
  name: string;
  price: string;
  image: string | null;
  emoji: string;
};

export default function Hero({
  totalProducts,
  totalCategories,
  storePhotos = [],
}: {
  totalProducts?: number;
  totalCategories?: number;
  storePhotos?: string[];
  topProducts?: HeroTopProduct[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Google yorumları: her 4 sn'de bir sonrakine geç, üzerine gelince dur
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPaused, setReviewsPaused] = useState(false);

  useEffect(() => {
    if (reviewsPaused) return;
    const id = setInterval(
      () => setReviewIndex((i) => (i + 1) % googleReviews.length),
      4000
    );
    return () => clearInterval(id);
  }, [reviewsPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Videoyu 0.75x hızda oynat
    video.playbackRate = 0.75;
    const onLoaded = () => {
      video.playbackRate = 0.75;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Arka plan videosu */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover saturate-[1.25] contrast-[1.08]"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Çok hafif, düz katman - genel netlik tabanı */}
      <div className="absolute inset-0 bg-background/8" />
      {/* Ortada (yazı bloğunun arkasında) en yoğun, kenarlara doğru azalan katman */}
      <div className="hero-center-scrim absolute inset-0" />

      {/* Yükselen baloncuklar */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Navbar altındaki hero tek flex kolonu. Arama barı bandı (flex-1),
          navbar'ın alt çizgisi ile başlık grid'i arasındaki TÜM esnek boşluğu
          kaplar ve barı bu boşluğun dikey ortasına oturtur. */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 pt-16 sm:px-6 lg:px-8">
        {/* Arama barı — navbar'ın ~48px altında, içerik ortalamasından bağımsız */}
        <div className="pt-12">
          <button
            onClick={openSiteSearch}
            className="glass animate-fade-up group mx-auto flex w-full max-w-2xl items-center gap-3.5 rounded-2xl px-5 py-4 text-left shadow-lg shadow-cyan-500/10 transition-all hover:border-cyan-400/50 hover:shadow-cyan-500/25"
            aria-label="Sitede ara (Ctrl+K)"
          >
            <SearchIcon className="shrink-0 text-cyan-300" />
            <span className="flex-1 truncate text-sm text-muted sm:text-base">
              Ürün, balık türü veya rehber arayın...
            </span>
            <kbd className="hidden shrink-0 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 sm:block">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* flex-1 + content-center: içerik, arama barının altında kalan tüm
            alanın dikey ortasına oturur. Bar üstte bağımsız durur. */}
        <div className="grid flex-1 grid-cols-1 content-center items-center gap-10 py-10 lg:grid-cols-[1.32fr_0.68fr] lg:gap-6">
        {/* SOL - başlık ve aksiyonlar */}
        <div className="min-w-0 text-left lg:-ml-3 lg:self-start">
          <h1 className="text-halo animate-fade-up delay-100 font-display text-5xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-7xl xl:text-[6rem]">
            Sualtı Dünyasının
            <br />
            {/* pl/pr: el yazısı fontun taşan harfleri background-clip: text dışında kalıp kesilmesin */}
            <span className="text-shine font-script pl-[0.03em] pr-[0.12em] text-[1.05em] font-semibold tracking-normal">
              Yeni Nesil Adresi
            </span>
          </h1>

          <p className="text-halo animate-fade-up delay-200 mt-6 max-w-xl text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
            Tropikal balıklardan profesyonel akvaryum sistemlerine, premium
            yemlerden canlı bitkilere - aradığınız her şey Gri Akvaryum&apos;da.
          </p>

          <div className="animate-fade-up delay-300 mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/urunler"
              className="glow rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-4 text-center font-semibold text-slate-950 transition-transform hover:scale-105"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/rehber"
              className="glass rounded-2xl px-8 py-4 text-center font-semibold text-foreground transition-colors hover:border-cyan-400/40"
            >
              Akvaryum Rehberi
            </Link>
          </div>

          {/* İstatistikler */}
          <div className="animate-fade-up delay-400 mt-16 flex max-w-lg items-center gap-8 border-t border-cyan-400/15 pt-8 sm:mt-20 sm:gap-12">
            {[
              {
                value: totalProducts
                  ? `${totalProducts.toLocaleString("tr-TR")}+`
                  : "500+",
                label: "Ürün Çeşidi",
              },
              { value: "30+", label: "Yıl Tecrübe" },
              { value: "%100", label: "Güncel Stok" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-gradient sm:text-4xl lg:text-[2.75rem]">
                  {stat.value}
                </div>
                <div className="text-halo mt-1 text-sm font-medium text-foreground/85 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ - yüzen kartlar */}
        <div className="flex min-w-0 flex-col gap-5 lg:mt-16 lg:gap-6">
          {/* Yardım Merkezi kartı */}
          <Link
            href="/rehber"
            className="glass card-hover animate-fade-up delay-200 group block rounded-3xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-2xl shadow-lg shadow-cyan-500/25">
                🎓
              </span>
              <div>
                <div className="font-display font-bold">Yardım Merkezi</div>
                <div className="text-sm text-muted">
                  Yeni başlayanlar için akvaryum rehberi
                </div>
              </div>
              <span className="ml-auto text-cyan-300 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Akvaryum nasıl
                temizlenir?
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> İlk akvaryuma balık
                nasıl eklenir?
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Su değerleri nasıl
                ayarlanır?
              </li>
            </ul>
          </Link>

          {/* Google yorumları - mağaza fotoğraflarından bir tık yavaş, sağdan sola kayar */}
          <div className="glass animate-fade-up delay-400 rounded-3xl p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-sm font-bold uppercase tracking-wider">
                Google Yorumları
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Gri+Akvaryum+Fatih+%C4%B0stanbul"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                ⭐ 4,8 · Tümü →
              </a>
            </div>
            <div
              onMouseEnter={() => setReviewsPaused(true)}
              onMouseLeave={() => setReviewsPaused(false)}
            >
              {/* key değişince kart yeniden kurulup fade-up ile girer */}
              <figure
                key={reviewIndex}
                className="animate-fade-up min-h-[17rem] rounded-2xl bg-cyan-400/5 p-5"
              >
                <figcaption className="flex items-center gap-3">
                  {/* Gerçek profil fotoğrafı varsa o, yoksa baş harfli avatar */}
                  {googleReviews[reviewIndex].photo ? (
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={googleReviews[reviewIndex].photo}
                        alt={`${googleReviews[reviewIndex].name} profil fotoğrafı`}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-white ${
                        avatarGradients[reviewIndex % avatarGradients.length]
                      }`}
                    >
                      {googleReviews[reviewIndex].name.charAt(0)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-lg font-semibold">
                    {googleReviews[reviewIndex].name}
                  </span>
                  <span
                    className="shrink-0 text-base text-amber-400"
                    aria-label="5 üzerinden 5 yıldız"
                  >
                    ★★★★★
                  </span>
                </figcaption>
                <blockquote className="mt-3 text-lg leading-relaxed text-muted">
                  {googleReviews[reviewIndex].text}
                </blockquote>
              </figure>

              {/* Yorum noktaları - tıklayınca o yoruma atlar */}
              <div className="mt-4 flex justify-center gap-1.5">
                {googleReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    aria-label={`${i + 1}. yorumu göster`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === reviewIndex
                        ? "w-5 bg-cyan-400"
                        : "w-1.5 bg-cyan-400/30 hover:bg-cyan-400/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mağazamız - kare fotoğraflar sağdan sola kesintisiz kayar */}
          {storePhotos.length > 0 && (
            <div className="glass animate-fade-up delay-400 overflow-hidden rounded-3xl p-4">
              <div className="edge-fade relative overflow-hidden rounded-2xl">
                <div className="marquee-track-rtl gap-3">
                  {[...storePhotos, ...storePhotos].map((src, i) => (
                    <a
                      key={i}
                      href="https://www.google.com/maps/dir/?api=1&destination=41.0164875,28.9711652"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Yol tarifi al - Gri Akvaryum"
                      className="group relative aspect-square w-44 shrink-0 overflow-hidden rounded-2xl sm:w-52"
                    >
                      <Image
                        src={src}
                        alt="Gri Akvaryum mağaza - yol tarifi için tıklayın"
                        fill
                        sizes="208px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/80 to-transparent pb-2.5 pt-8 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        📍 Yol Tarifi Al
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
