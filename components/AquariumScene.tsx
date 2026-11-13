"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FISH, PROPS } from "@/lib/aquarium/scene-config";
import Fish from "./aquarium/Fish";
import AquariumProp from "./aquarium/AquariumProp";
import { useAquariumEngine } from "./aquarium/useAquariumEngine";
import styles from "./AquariumScene.module.css";

export default function AquariumScene() {
  const world = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);
  const [reduced, setReduced] = useState(true);
  const running = available && !reduced;
  useAquariumEngine(world, running);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => { setReduced(preference.matches); setAvailable(inView && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: .05 });
    if (world.current) observer.observe(world.current);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);

  return (
    <div className={styles.scene}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.caption} data-aquarium-obstacle="caption">
        <a href="#auth-heading" className={styles.skip}>Hesap formuna geç</a>
        <h2>Kendi dünyasında.<br />Senin dünyana yakın.</h2>
        <p>Resifin ritmine katıl.<br />Su altındaki dünyana hoş geldin.</p>
      </div>
      <div ref={world} className={styles.world} data-running={running} data-reduced={reduced} role="group" aria-label="Etkileşimli akvaryum">
        <div className={styles.atmosphere} aria-hidden="true">
          <Image src="/aquarium/aquarium-seabed.webp" alt="" fill sizes="100vw" unoptimized loading="eager" fetchPriority="high" className={styles.backgroundPhoto} />
          <div className={styles.waterShade} />
          <div className={styles.rays} /><div className={styles.surface} />
          <div className={styles.distantReef} /><div className={styles.caustics} />
          <div className={styles.whiteFade} />
          {Array.from({ length: 20 }, (_, i) => <span key={i} className={styles.particle} style={{ "--x": `${(i * 31 + 9) % 100}%`, "--size": `${i % 3 === 0 ? 5 : 2}px`, "--duration": `${19 + i % 5 * 4}s`, "--delay": `${-i * 4}s` } as CSSProperties} />)}
          {[12, 53, 96].map(x => <div key={x} className={styles.airColumn} style={{ left: `${x}%` }}>{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ "--delay": `${-i * 2.1}s`, "--size": `${3 + i % 3 * 2}px`, "--duration": `${8 + i * .7}s` } as CSSProperties} />)}</div>)}
        </div>
        {FISH.map((config, index) => <Fish key={config.id} config={config} index={index} />)}
        <div className={styles.garden}>{PROPS.map((config, index) => <AquariumProp key={config.id} config={config} index={index} />)}</div>
      </div>
    </div>
  );
}
