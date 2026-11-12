"use client";

import { useEffect, useState } from "react";

const examples = [
  "Lepistes yemi",
  "Akvaryum dış filtre",
  "Canlı akvaryum bitkisi",
  "Su düzenleyici",
  "İlk akvaryum kurulumu",
];

export default function AnimatedSearchInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [example, setExample] = useState("");

  useEffect(() => {
    if (focused || value) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let length = 0;
    let deleting = false;

    const tick = () => {
      if (motion.matches || document.hidden) return;
      const text = examples[index];
      length += deleting ? -1 : 1;
      setExample(text.slice(0, length));
      let delay = deleting ? 38 : 95;
      if (length === text.length) {
        deleting = true;
        delay = 1800;
      } else if (length === 0) {
        deleting = false;
        index = (index + 1) % examples.length;
        delay = 400;
      }
      timer = setTimeout(tick, delay);
    };
    const resume = () => {
      clearTimeout(timer);
      if (!motion.matches && !document.hidden) timer = setTimeout(tick, 250);
    };
    resume();
    motion.addEventListener("change", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [focused, value]);

  return (
    <div className="store-search-field">
      <input
        id="store-search"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? "Ne arıyorsunuz?" : ""}
      />
      {!value && !focused && (
        <span className="store-search-hint" aria-hidden="true">
          <span className="store-search-example">Örn. {example}<i /></span>
          <span className="store-search-static">Ürün, balık türü veya marka arayın</span>
        </span>
      )}
    </div>
  );
}
