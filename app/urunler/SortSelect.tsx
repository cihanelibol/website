"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "default", label: "Önerilen Sıralama" },
  { value: "price_asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sirala") ?? "default";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") params.delete("sirala");
    else params.set("sirala", value);
    params.delete("sayfa"); // sıralama değişince ilk sayfaya dön
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="store-catalog-sort glass cursor-pointer rounded-xl font-medium text-foreground outline-none transition-colors hover:border-cyan-400/40 [&>option]:bg-surface"
      aria-label="Sıralama"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
