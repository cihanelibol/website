"use client";

import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tabs = [
  { href: "/admin", label: "Siparişler", icon: "package" },
  { href: "/admin/uyeler", label: "Üyeler", icon: "users" },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: "message" },
  { href: "/admin/guvenlik", label: "Güvenlik", icon: "shield" },
  { href: "/admin/denetim", label: "Denetim Kaydı", icon: "file" },
];

function isActive(href: string, path: string) {
  return href === "/admin" ? path === "/admin" : path.startsWith(href);
}

export default function AdminNav() {
  const pathname = usePathname();
  // Tıklanan sekmeyi sunucu yanıtını beklemeden aktif göster; yol değişince
  // (yeni sayfa geldiğinde) iyimser durum kendiliğinden düşer.
  const [pending, setPending] = useState<string | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setPending(null);
  }
  const current = pending ?? pathname;

  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = isActive(tab.href, current);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              if (!isActive(tab.href, pathname)) {
                setPending(tab.href);
              }
            }}
            // Aktif ve pasif sekme aynı 1px kenarlığı taşır: boyut oynamaz.
            // Renk geçişi yok: arka plan anında değiştiği için yazının ayrıca
            // animasyonla gelmesi bir an görünmez olmasına (titreme) yol açıyordu.
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
              active
                ? "border-transparent bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
                : "glass text-muted hover:border-cyan-400/40 hover:text-foreground"
            }`}
          >
            <span><AppIcon name={tab.icon ?? "book"} /></span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
