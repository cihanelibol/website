"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./AquariumVideoScene.module.css";

export default function AquariumVideoScene() {
  const scene = useRef<HTMLDivElement>(null);
  const aquarium = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  const [videoFailed, setVideoFailed] = useState(false);
  const running = visible && inView && !videoFailed && (intent === "play" || (intent === "auto" && !reducedMotion));

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => setReducedMotion(preference.matches);
    const visibilityChanged = () => setVisible(!document.hidden);
    motionChanged();
    visibilityChanged();
    preference.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (scene.current) observer.observe(scene.current.closest("main") ?? scene.current);
    return () => {
      preference.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const background = aquarium.current;
    let active = true;
    if (running) {
      background?.play().catch(() => { if (active) setIntent("pause"); });
    } else {
      background?.pause();
    }
    return () => {
      active = false;
      background?.pause();
    };
  }, [running]);

  return (
    <div ref={scene} className={styles.scene} data-running={running}>
      <div className={styles.tank}>
        <Image src="/videos/aquarium-poster.webp" alt="Mercanlar arasında yüzen palyaço balıklarıyla gerçek bir resif akvaryumu" fill sizes="100vw" className={styles.poster} loading="eager" fetchPriority="high" />
        {!videoFailed && <video ref={aquarium} className={styles.aquarium} src="/videos/aquarium.mp4" poster="/videos/aquarium-poster.webp" width="960" height="540" muted loop playsInline preload="none" aria-hidden="true" onError={() => setVideoFailed(true)} />}
        <div className={styles.shade} />
      </div>
      <div className={styles.water} aria-hidden="true">
        <div className={styles.rays} />
        <div className={styles.surface} />
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className={styles.particle} style={{
            "--x": `${(index * 37 + 8) % 100}%`,
            "--size": `${index % 4 === 0 ? 5 : 2}px`,
            "--duration": `${22 + index % 6 * 5}s`,
            "--delay": `${-index * 7}s`,
          } as CSSProperties} />
        ))}
      </div>
      <div className={styles.caption}>
        <h2>Hayalindeki akvaryumu birlikte kuralım.</h2>
        <p>İlk balığından yaşayan bir su altı dünyasına, her adımda yanındayız.</p>
      </div>
      {!videoFailed && <button className={styles.playback} type="button" onClick={() => setIntent(running ? "pause" : "play")} aria-label={running ? "Akvaryum animasyonunu duraklat" : "Akvaryum animasyonunu oynat"}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{running ? <path d="M4 3h3v10H4zM10 3h3v10h-3z" /> : <path d="M4 2 14 8 4 14Z" />}</svg>
        <span>{running ? "Duraklat" : "Oynat"}</span>
      </button>}
    </div>
  );
}
