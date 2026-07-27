"use client";

import { useEffect } from "react";

const THEME_META_COLORS: Record<string, string> = {
  dark: "#04101c",
  light: "#f2f7fa",
};

function syncMetaThemeColor(theme: string) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_META_COLORS[theme] ?? THEME_META_COLORS.light);
}

/*
 * Tema düğmesi. Aktif temayı state'te tutmaz: ikonların görünürlüğü
 * [data-theme] üzerinden CSS ile (light: varyantı) çözülür; böylece
 * SSR/hidrasyon uyuşmazlığı ve ilk boyamada yanlış ikon oluşmaz.
 */
export default function ThemeToggle() {
  useEffect(() => {
    // Kaydedilmiş tema varsa adres çubuğu rengini de eşitle
    syncMetaThemeColor(document.documentElement.getAttribute("data-theme") ?? "light");
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    syncMetaThemeColor(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-cyan-400/10 hover:text-foreground"
      aria-label="Açık/koyu tema arasında geçiş yap"
      title="Temayı değiştir"
    >
      {/* Koyu temada güneş: "aydınlığa geç" */}
      <svg
        className="block light:hidden"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Açık temada ay: "karanlığa geç" */}
      <svg
        className="hidden light:block"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
