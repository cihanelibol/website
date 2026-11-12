"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { OCEAN_INTRO_SESSION_KEY } from "@/lib/ocean-intro";
import styles from "./OceanSplash.module.css";

const BRAND = "Gri Akvaryum";
const DURATION_MS = 1800;
const FADE_MS = 300;
const FILL_MS = DURATION_MS - FADE_MS;
const BUBBLE_COUNT = 12;

/** Original, layered jellyfish artwork; no video or animation dependency. */
function Jellyfish({ index }: { index: number }) {
  const id = `ocean-jelly-${index}`;
  return (
    <div className={`${styles.creature} ${styles[`jellyfish${index}`]}`}>
      <svg className={styles.swimmer} viewBox="0 0 200 340" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-bell`} cx=".42" cy=".3" r=".75">
            <stop stopColor="#ecffff" stopOpacity=".6" />
            <stop offset=".4" stopColor="#98edf2" stopOpacity=".24" />
            <stop offset=".85" stopColor="#65c7ea" stopOpacity=".08" />
            <stop offset="1" stopColor="#cefaff" stopOpacity=".6" />
          </radialGradient>
          <linearGradient id={`${id}-arms`} x1="100" y1="95" x2="100" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d1fbff" stopOpacity=".65" />
            <stop offset="1" stopColor="#79cfe9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className={styles.tentacles} stroke={`url(#${id}-arms)`} strokeLinecap="round">
          <path d="M49 105 C26 154 76 165 48 211 S64 272 43 312 M66 110 C90 151 32 177 67 221 S52 282 76 334 M131 110 C102 157 159 176 127 219 S148 275 121 329 M150 104 C174 149 125 174 151 214 S139 263 165 300" strokeWidth="1.2" />
          <path d="M82 110 C53 143 116 156 85 185 S111 227 89 263 M115 109 C146 138 85 163 118 192 S94 235 114 279" strokeWidth="7" strokeOpacity=".45" />
          <path d="M94 111 C125 153 68 167 104 206 S89 257 106 303" strokeWidth="3" />
        </g>
        <g className={styles.bell}>
          <path d="M25 106 C27 53 54 27 98 26 C143 24 174 58 176 106 C162 122 146 111 136 118 C121 127 112 114 101 120 C87 126 76 114 64 119 C49 123 36 118 25 106Z" fill={`url(#${id}-bell)`} stroke="#b4f5ff" strokeOpacity=".55" strokeWidth=".8" />
          <path d="M27 105 C60 88 143 87 174 105 M48 96 C49 61 69 35 92 29 M76 93 C74 63 84 38 96 28 M122 94 C126 62 115 38 102 28 M151 98 C150 63 129 35 105 29" stroke="#d5fbff" strokeOpacity=".2" strokeWidth=".8" />
          <ellipse cx="100" cy="103" rx="73" ry="12" fill="#8ee9f3" fillOpacity=".08" stroke="#ccfbff" strokeOpacity=".4" />
          <path d="M79 76 C67 58 97 56 99 72 C104 53 128 63 116 78 C133 91 110 102 100 86 C91 103 68 91 79 76Z" stroke="#e3feff" strokeOpacity=".32" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function RibbonFish() {
  return (
    <div className={`${styles.creature} ${styles.ribbonFish}`}>
      <svg className={styles.fishSwimmer} viewBox="0 0 280 120" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ocean-fish-silver" x1="40" y1="35" x2="240" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d9fcff" stopOpacity=".75" />
            <stop offset=".45" stopColor="#57cfe0" stopOpacity=".8" />
            <stop offset="1" stopColor="#268ebd" stopOpacity=".35" />
          </linearGradient>
        </defs>
        <g className={styles.fishTail}>
          <path d="M218 60 Q249 33 273 26 Q262 60 275 96 Q245 88 218 60Z" fill="url(#ocean-fish-silver)" stroke="#b6f8ff" strokeOpacity=".45" />
          <path d="M225 60L270 30M225 60L271 92M230 60H267" stroke="#cbfaff" strokeOpacity=".3" />
        </g>
        <path d="M101 40 Q140 3 185 28L174 44M112 78Q154 108 188 91L173 75" fill="#87e8ef" fillOpacity=".25" stroke="#bef5ff" strokeOpacity=".35" />
        <path d="M24 61 C65 22 161 23 230 60 C172 94 66 98 24 61Z" fill="url(#ocean-fish-silver)" stroke="#c3f8ff" strokeOpacity=".65" />
        <path d="M44 63Q132 47 218 60M74 44Q91 60 74 78" stroke="#e2feff" strokeOpacity=".45" />
        <path d="M111 58Q156 63 131 83Z" fill="#b7f5f9" fillOpacity=".4" />
        <circle cx="51" cy="55" r="4" fill="#052a40" /><circle cx="50" cy="54" r="1.3" fill="#e5ffff" />
      </svg>
    </div>
  );
}

export default function OceanSplash() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const dialog = dialogRef.current;
    const text = textRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    if (!dialog || !text) return;
    if (motion.matches || ["skip", "expired"].includes(root.dataset.oceanIntro ?? "")) {
      root.dataset.oceanIntro = "done";
      return;
    }

    try {
      if (sessionStorage.getItem(OCEAN_INTRO_SESSION_KEY)) {
        root.dataset.oceanIntro = "done";
        return;
      }
    } catch {
      // Storage may be disabled; the intro still remains dismissible.
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const previousOverflow = document.body.style.overflow;
    const previousWidth = document.body.style.width;
    const previousGutter = root.style.scrollbarGutter;
    let finished = false;
    let opened = false;
    const clearTimers = () => timers.forEach(clearTimeout);
    const restore = () => {
      clearTimers();
      if (opened) {
        document.body.style.overflow = previousOverflow;
        document.body.style.width = previousWidth;
        root.style.scrollbarGutter = previousGutter;
        root.dataset.oceanIntro = "done";
      }
      opened = false;
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      restore();
      dialog.close();
    };
    finishRef.current = () => finish();
    const onCancel = (event: Event) => { event.preventDefault(); finish(); };
    const onMotionChange = () => { if (motion.matches) finish(); };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", restore);
    motion.addEventListener("change", onMotionChange);

    // Deferring also prevents React Strict Mode's trial effect from marking it seen.
    const frame = requestAnimationFrame(() => {
      if (finished) return;
      dialog.classList.remove(styles.leaving);
      text.textContent = "";
      dialog.showModal();
      dialog.focus({ preventScroll: true });
      root.dataset.oceanIntro = "playing";
      opened = true;
      // Cover the scrollbar gutter while keeping the underlying page width stable.
      const gutter = innerWidth - root.getBoundingClientRect().width;
      document.body.style.overflow = "hidden";
      root.style.scrollbarGutter = "auto";
      if (gutter > 0) document.body.style.width = `calc(100% - ${gutter}px)`;
      try { sessionStorage.setItem(OCEAN_INTRO_SESSION_KEY, "1"); } catch { /* Optional storage. */ }
      Array.from(BRAND).forEach((_, index) => {
        timers.push(setTimeout(() => {
          text.textContent = BRAND.slice(0, index + 1);
        }, 230 + index * 40));
      });
      timers.push(setTimeout(() => {
        dialog.classList.add(styles.leaving);
      }, FILL_MS));
      timers.push(setTimeout(finish, DURATION_MS));
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimers();
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", restore);
      motion.removeEventListener("change", onMotionChange);
      dialog.close();
      restore();
      finishRef.current = () => {};
    };
  }, []);

  return (
    <dialog ref={dialogRef} tabIndex={-1} className={styles.splash} style={{ "--splash-fill": `${FILL_MS}ms`, "--splash-fade": `${FADE_MS}ms` } as CSSProperties} aria-label="Gri Akvaryum açılış animasyonu" onKeyDown={(event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        event.currentTarget.querySelector<HTMLButtonElement>(`button.${styles.skip}`)?.focus();
      }
    }}>
      <div className={styles.ocean} aria-hidden="true">
        <div className={styles.surface} />
        <div className={styles.rays} />
        <div className={styles.ripples} />
        <div className={styles.particles}>
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{
              "--x": `${(i * 43 + 7) % 100}%`,
              "--y": `${(i * 29 + 13) % 100}%`,
              "--size": `${i % 4 === 0 ? 4 : 2}px`,
              "--delay": `${-(i % 7)}s`,
            } as CSSProperties} />
          ))}
        </div>
        <div className={styles.vignette} />
      </div>
      <div className={styles.creatures} aria-hidden="true">
        <Jellyfish index={0} />
        <RibbonFish />
        <Jellyfish index={1} />
        <Jellyfish index={2} />
      </div>
      <div className={styles.brand} aria-hidden="true">
        <div className={styles.logo}>
          <Image src="/logo-mark.png" alt="" width={814} height={475} loading="eager" unoptimized />
        </div>
        <div className={styles.wordmark}>
          <span ref={textRef} /><span className={styles.caret} />
        </div>
        <div className={styles.bubbleTrack}>
          <span className={styles.bubbleFill} />
          {Array.from({ length: BUBBLE_COUNT }, (_, index) => (
            <i key={index} className={styles.loadingBubble} style={{
              "--bubble-delay": `${index * (FILL_MS - 220) / (BUBBLE_COUNT - 1)}ms`,
              "--bubble-size": `${[8, 10, 9, 11][index % 4]}px`,
            } as CSSProperties} />
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" onClick={() => finishRef.current()} className={styles.skip}>
          Siteye geç
        </button>
      </div>
    </dialog>
  );
}
