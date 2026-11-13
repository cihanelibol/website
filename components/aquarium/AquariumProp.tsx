import type { CSSProperties } from "react";
import Image from "next/image";
import { PROPS } from "@/lib/aquarium/scene-config";
import styles from "../AquariumScene.module.css";

const photographs = { plant: "aquatic-plant", coral: "pink-coral", rock: "reef-rock", arch: "reef-arch", fan: "purple-seafan", anemone: "green-anemone" };

export default function AquariumProp({ config, index }: { config: typeof PROPS[number]; index: number }) {
  return (
    <button type="button" className={styles.prop} data-prop={config.kind} data-prop-id={config.id} data-layer={config.layer} data-mobile={config.mobile} data-aquarium-obstacle={config.kind === "rock" && config.layer === "front" ? "rock" : undefined} aria-label={`${config.name}: kabarcık çıkar`} style={{ left: `${config.x}%`, "--prop-size": `${config.size}px`, "--bottom": `${config.bottom}%`, "--tilt": `${config.tilt}deg`, "--sway-delay": `${-index * 1.7}s`, "--prop-facing": config.x > 60 ? -1 : 1 } as CSSProperties}>
      <span className={styles.propSway} aria-hidden="true">
        <Image src={`/aquarium/${photographs[config.kind]}.webp`} alt="" fill sizes="300px" unoptimized draggable={false} className={styles.propPhoto} loading="eager" />
      </span>
      <span className={styles.propBubbles} aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}
