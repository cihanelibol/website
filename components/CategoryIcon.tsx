import type { ReactElement } from "react";

/**
 * Kategori kartları için özel çizim SVG ikon seti.
 * Her ikon tek bir kategoriyi temsil eder; assignCategoryIcons benzer
 * kategorilerde bile (ör. üç farklı yem kategorisi) aynı ikonun iki kez
 * kullanılmamasını garanti eder.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, ReactElement> = {
  // Balık - sağa yüzen balık silüeti
  fish: (
    <g {...stroke}>
      <path d="M17 12c0-.1-2.6-4.5-6.7-4.5C6.6 7.5 4 10.6 3 12c1 1.4 3.6 4.5 7.3 4.5 4.1 0 6.7-4.4 6.7-4.5Z" />
      <path d="m17 12 4-3.5v7L17 12Z" />
      <circle cx="7.2" cy="11.2" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
  // Pul yem - eğik kutudan dökülen pullar
  flakes: (
    <g {...stroke}>
      <rect x="12.6" y="1.8" width="6.6" height="8.6" rx="1.2" transform="rotate(35 15.9 6.1)" />
      <path d="m10.6 10.6 1-1 1 1-1 1Z" />
      <path d="m7.6 14.1 1-1 1 1-1 1Z" />
      <path d="m11.1 16.6 1-1 1 1-1 1Z" />
      <path d="M3 20.2c1.6 1 3.2 1 4.8 0s3.2-1 4.8 0 3.2 1 4.8 0 2.8-.9 3.9-.2" />
    </g>
  ),
  // Granül yem - kaseye dökülen taneler
  pellets: (
    <g {...stroke}>
      <path d="M4 14.5h16c0 3.6-3.1 6-8 6s-8-2.4-8-6Z" />
      <circle cx="9" cy="4.8" r="1.2" />
      <circle cx="14.2" cy="7.6" r="1.2" />
      <circle cx="10" cy="10.8" r="1.2" />
      <circle cx="15.5" cy="12" r="1.2" />
    </g>
  ),
  // Marka konservesi - üstünde balık amblemi olan yem kutusu
  can: (
    <g {...stroke}>
      <ellipse cx="12" cy="5" rx="6.5" ry="2.2" />
      <path d="M5.5 5v12c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V5" />
      <path d="M9.4 12.6c.9-1.1 1.8-1.7 2.8-1.7s2 .6 2.9 1.7c-.9 1.1-1.9 1.7-2.9 1.7s-1.9-.6-2.8-1.7Z" />
    </g>
  ),
  // Filtre - gövde, çıkış borusu ve kabarcıklar
  filter: (
    <g {...stroke}>
      <rect x="6.5" y="6" width="10" height="14" rx="2" />
      <path d="M11.5 6V3h4.5" />
      <circle cx="19" cy="5.5" r="1" />
      <circle cx="20.5" cy="2.8" r="0.7" />
      <path d="M9 14.5h5M9 17h5" />
      <path d="M9 9.5h5" />
    </g>
  ),
  // Yedek parça - pompa rotoru / pervane
  impeller: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="2.1" />
      <path d="M12 9.9C12 6.8 13.6 4.6 16.2 3.6" />
      <path d="M14.1 12c3.1 0 5.3 1.6 6.3 4.2" />
      <path d="M12 14.1c0 3.1-1.6 5.3-4.2 6.3" />
      <path d="M9.9 12c-3.1 0-5.3-1.6-6.3-4.2" />
    </g>
  ),
  // Filtre malzemesi - katmanlı sünger/elyaf ortamı
  sponge: (
    <g {...stroke}>
      <rect x="4" y="4.5" width="16" height="4.6" rx="1.2" />
      <rect x="4" y="10.4" width="16" height="4.6" rx="1.2" />
      <rect x="4" y="16.3" width="16" height="3.9" rx="1.2" />
      <circle cx="8.5" cy="12.7" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12.3" cy="12.7" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12.7" r="0.55" fill="currentColor" stroke="none" />
      <path d="M7.5 4.5v4.6M12 4.5v4.6M16.5 4.5v4.6" />
    </g>
  ),
  // Kimyasal - erlen ve kabarcıklar
  flask: (
    <g {...stroke}>
      <path d="M9 3h6" />
      <path d="M10.4 3v5.2L5.3 17a1.9 1.9 0 0 0 1.8 2.7h9.8a1.9 1.9 0 0 0 1.8-2.7L13.6 8.2V3" />
      <circle cx="10.6" cy="15.2" r="1" />
      <circle cx="13.8" cy="16.8" r="0.7" />
    </g>
  ),
  // Isıtıcı - dalgıç ısıtıcı ve rezistans çizgileri
  heater: (
    <g {...stroke}>
      <rect x="9.8" y="2.8" width="4.4" height="15" rx="2.2" />
      <path d="M9.8 8.6h4.4M9.8 11.2h4.4M9.8 13.8h4.4" />
      <path d="M12 17.8v3.4" />
      <path d="M4 21.2c1.4.8 2.7.8 4 0" />
      <path d="M16 21.2c1.4.8 2.7.8 4 0" />
    </g>
  ),
  // Aydınlatma - ampul ve ışınlar
  light: (
    <g {...stroke}>
      <path d="M8.9 14.7a5.4 5.4 0 1 1 6.2 0c-.8.6-1.1 1.4-1.1 2.1h-4c0-.7-.3-1.5-1.1-2.1Z" />
      <path d="M10.4 19.8h3.2" />
      <path d="M12 1.4v1.8M4.8 4.2l1.3 1.3M19.2 4.2l-1.3 1.3" />
    </g>
  ),
  // Bitki - yapraklar ve kök tabanı
  plant: (
    <g {...stroke}>
      <path d="M12 21v-8.2" />
      <path d="M12 12.8C8.2 12.8 5.6 10.4 5 7c3.9.1 6.4 2.2 7 5.8Z" />
      <path d="M12 12.8c3.8 0 6.4-2.4 7-5.8-3.9.1-6.4 2.2-7 5.8Z" />
      <path d="M12 9.5c.2-2.6 1.2-4.6 3-6.1" />
      <path d="M7.5 21h9" />
    </g>
  ),
  // Dekor - dallanan mercan
  coral: (
    <g {...stroke}>
      <path d="M12 20.8v-5.6" />
      <path d="M12 15.2c0-3-2.2-4-2.2-7.2" />
      <path d="M12 15.2c0-3 2.2-4 2.2-7.2" />
      <path d="M9.8 8c0-1.7-1.1-2.3-1.1-4.4" />
      <path d="M14.2 8c0-1.7 1.1-2.3 1.1-4.4" />
      <path d="M6.8 20.8h10.4" />
    </g>
  ),
  // Akvaryum - su çizgili tank
  tank: (
    <g {...stroke}>
      <rect x="3" y="4.8" width="18" height="14.4" rx="2" />
      <path d="M3.4 9.2c2 1 4-1 6 0s4-1 6 0 3.4-.9 5.2-.1" />
      <path d="M9.4 14.6c.8-1 1.7-1.5 2.6-1.5s1.8.5 2.6 1.5c-.8 1-1.7 1.5-2.6 1.5s-1.8-.5-2.6-1.5Z" />
    </g>
  ),
  // Aksesuar - kepçe / file
  net: (
    <g {...stroke}>
      <path d="m14.8 9.2 6-6" />
      <circle cx="9.6" cy="14.4" r="6.2" />
      <path d="m5.4 11.4 8.6 6.2M4.6 16.6l7-6.6" />
    </g>
  ),
  // Karides / canlı yem
  shrimp: (
    <g {...stroke}>
      <path d="M17.8 8.2a6.3 6.3 0 1 1-12.4 2.4c.3-2 1.9-3.4 3.8-3.4 2 0 3.4 1.4 3.4 3.2 0 1.6-1 2.8-2.6 2.8" />
      <path d="M17.8 8.2c1.4-.5 2.4-1.4 2.9-2.8" />
      <path d="M17.8 8.2c.4 1.4 1.3 2.4 2.7 2.9" />
      <circle cx="15.2" cy="7.2" r="0.7" fill="currentColor" stroke="none" />
    </g>
  ),
  // Genel - kabarcıklar (eşleşme kalmazsa son çare)
  bubbles: (
    <g {...stroke}>
      <circle cx="9" cy="14.5" r="4.5" />
      <circle cx="16.5" cy="7.5" r="2.6" />
      <circle cx="18.6" cy="14.8" r="1.3" />
    </g>
  ),
};

/**
 * Sıralı aday listeleri: ilk eşleşen kuralın ilk KULLANILMAMIŞ ikonu seçilir.
 * Böylece "Balık Yemleri", "Tropical Balık Yemleri" ve "Granül Yemler" gibi
 * kardeş kategoriler bile farklı ikonlar alır.
 */
const RULES: [RegExp, string[]][] = [
  [/tropical/, ["can", "flakes", "shrimp", "pellets"]],
  [/granül/, ["pellets", "flakes", "can", "shrimp"]],
  [/karides|canlı yem|artemia/, ["shrimp", "flakes", "pellets"]],
  [/yem|vitamin|besin/, ["flakes", "shrimp", "pellets", "can"]],
  [/yedek|parça|rotor|mil/, ["impeller", "sponge", "filter"]],
  [/malzeme|sünger|elyaf|biyolojik/, ["sponge", "impeller", "filter"]],
  [/filtre|motor|pompa|hava/, ["filter", "impeller", "sponge"]],
  [/ısıtıcı|termo/, ["heater"]],
  [/led|aydınlatma|lamba/, ["light"]],
  [/bitki/, ["plant"]],
  [/dekor|taban|kum|kaya|mercan/, ["coral"]],
  [/ilaç|bakım|sağlık|kimyasal|katkı|test/, ["flask"]],
  [/aksesuar|kepçe|file/, ["net"]],
  [/akvaryum|fanus|tank/, ["tank", "fish"]],
  [/balık/, ["fish", "tank"]],
];

const FALLBACK_POOL = [
  "fish",
  "tank",
  "plant",
  "coral",
  "net",
  "light",
  "heater",
  "bubbles",
];

/** Kategori adlarına, tekrar etmeyecek şekilde ikon anahtarları atar. */
export function assignCategoryIcons(names: string[]): string[] {
  const used = new Set<string>();

  const pick = (candidates: string[]): string | null => {
    for (const key of candidates) {
      if (!used.has(key)) return key;
    }
    return null;
  };

  return names.map((name) => {
    const n = name.toLocaleLowerCase("tr-TR");
    let icon: string | null = null;
    for (const [pattern, candidates] of RULES) {
      if (pattern.test(n)) {
        icon = pick(candidates);
        if (icon) break;
      }
    }
    if (!icon) icon = pick(FALLBACK_POOL);
    if (!icon) icon = "bubbles";
    used.add(icon);
    return icon;
  });
}

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {ICONS[icon] ?? ICONS.bubbles}
    </svg>
  );
}
