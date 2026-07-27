"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Sipariş Yönetimi", emoji: "📦" },
  { href: "/admin/uyeler", label: "Üye Yönetimi", emoji: "👥" },
  { href: "/admin/denetim", label: "Denetim Kaydı", emoji: "🕵️" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950"
                : "glass text-muted hover:border-cyan-400/40 hover:text-foreground"
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
