import type { CSSProperties } from "react";
import Image from "next/image";
import { FISH } from "@/lib/aquarium/scene-config";
import styles from "../AquariumScene.module.css";

const photographs = { clown: "clownfish", tang: "blue-tang", gold: "yellow-tang", anthias: "pink-anthias", copperband: "copperband" };

export default function Fish({ config, index }: { config: typeof FISH[number]; index: number }) {
  const src = `/aquarium/${photographs[config.species]}.webp`;
  return (
    <button type="button" className={styles.fish} data-fish={config.id} data-mobile={config.mobile} data-layer={config.depth < .8 ? "back" : "front"} data-species={config.species} data-state="cruise" aria-label={`${config.name} ile oyna`} style={{ "--fish-size": `${config.size}px`, "--depth": config.depth, "--swim-delay": `${-index * .37}s`, left: `${config.x * 100}%`, top: `${config.y * 100}%` } as CSSProperties}>
      <span className={styles.fishHeading} aria-hidden="true">
        <span className={styles.fishArt}>
          {/* Overlapping soft masks let the real tail move without a hard seam. */}
          <span className={styles.photoTail}><Image src={src} alt="" fill sizes="160px" unoptimized draggable={false} className={styles.fishPhoto} loading="eager" /></span>
          <span className={styles.photoBody}><Image src={src} alt="" fill sizes="160px" unoptimized draggable={false} className={styles.fishPhoto} loading="eager" /></span>
        </span>
      </span>
      <span className={styles.propBubbles} aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}
