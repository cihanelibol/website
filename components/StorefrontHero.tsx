"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppIcon from "@/components/AppIcon";
import { CONTACT } from "@/lib/site";
import { storeGoogleReviews, storeMottos } from "@/lib/store-google-reviews";
import styles from "./StorefrontHero.module.css";

const shortcuts = [
  { href: "/rehber/ilk-akvaryum-kurulumu", title: "Yeni başlıyorum", text: "İlk akvaryum rehberi ve uzman desteği", image: "starter" },
  { href: "/urunler?grup=baliklar-canlilar", title: "Canlı balık", text: "Akvaryumunuza uygun türleri keşfedin", image: "betta" },
  { href: "/rehber#tuzlu-su", title: "Deniz & Resif", text: "Tuz, mercan bakımı ve test kitleri", image: "reef" },
];

export default function StorefrontHero() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [mottoIndex, setMottoIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const review = storeGoogleReviews[reviewIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || !visible) return;
    const reviewsTimer = window.setInterval(() => setReviewIndex((index) => (index + 1) % storeGoogleReviews.length), 6500);
    const mottosTimer = window.setInterval(() => setMottoIndex((index) => (index + 1) % storeMottos.length), 10000);
    return () => {
      window.clearInterval(reviewsTimer);
      window.clearInterval(mottosTimer);
    };
  }, [paused, hovered, focused, reducedMotion, visible]);

  return (
    <div className="store-hero-column">
      <section
        className={styles.hero}
        aria-label="Gri Akvaryum mağazası"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <div className={styles.photos}>
          <Image
            src="/images/store-hero/magaza-3.webp"
            alt="Akşam ışığında akvaryumlarla çevrili mağaza vitrini"
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1000px) 60vw, 850px"
            className={styles.photo}
            loading="eager"
            fetchPriority="high"
          />
          <Link
            href="/iletisim"
            className={`store-button store-button-cta ${styles.contactTrigger}`}
            aria-label="İletişime geç"
          >
            <AppIcon name="message" />
            <span className={styles.contactLabel} aria-hidden="true"><span>İletişime geç</span></span>
          </Link>
        </div>
        <div className={styles.content}>
          <div>
            <h1 className={styles.motto}>
              {storeMottos.map((motto, index) => (
                <span key={motto} aria-hidden={index !== mottoIndex} data-active={index === mottoIndex}>{motto}</span>
              ))}
            </h1>
            <p className={styles.services}>Akvaryum kurulum ve bakım hizmetleri.</p>
          </div>
          <figure className={styles.review}>
            <div className={styles.reviewHeading}>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">Google yorumları <span aria-hidden="true">↗</span></a>
              <span className={styles.stars} role="img" aria-label="Bu yorum: 5 üzerinden 5 yıldız">
                {[1, 2, 3, 4, 5].map((star) => <AppIcon key={star} name="star" fill="currentColor" />)}
              </span>
            </div>
            <blockquote key={review.name} className={styles.reviewQuote} title={review.text}>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${review.name} adlı kişinin yorumunu Google’da okuyun`}>“{review.text}”</a>
            </blockquote>
            <figcaption>
              {review.photo ? <Image key={review.photo} src={review.photo} alt="" width={24} height={24} /> : <span className={styles.avatar} aria-hidden="true">{review.name.slice(0, 1).toLocaleUpperCase("tr-TR")}</span>}
              <span className={styles.author} title={review.name}>{review.name}</span>
              <div className={styles.rotationControls}>
                <button type="button" onClick={() => setReviewIndex((index) => (index + 1) % storeGoogleReviews.length)} aria-label="Sonraki Google yorumu" title="Sonraki yorum">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
                </button>
                {!reducedMotion && <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Yorum ve başlık geçişlerini başlat" : "Yorum ve başlık geçişlerini duraklat"} title={paused ? "Geçişleri başlat" : "Geçişleri duraklat"}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{paused ? <path d="M4 2 14 8 4 14Z" /> : <path d="M4 3h3v10H4zM10 3h3v10h-3z" />}</svg>
                </button>}
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
      <div className="store-shortcuts">
        {shortcuts.map((item) => (
          <Link key={item.href} href={item.href} className={`store-shortcut-${item.image}`}>
            <Image
              src={`/images/home-v2/${item.image}.webp`}
              alt=""
              fill
              sizes="(max-width: 700px) 92vw, 320px"
              className="store-shortcut-photo"
            />
            <strong>{item.title}</strong>
            <span>{item.text}</span>
            <span className="store-shortcut-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
