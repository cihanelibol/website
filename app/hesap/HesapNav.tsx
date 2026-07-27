"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "./actions";

const items = [
  { href: "/hesap", label: "Profilim", emoji: "👤" },
  { href: "/hesap/adresler", label: "Adreslerim", emoji: "📍" },
  { href: "/hesap/siparisler", label: "Siparişlerim", emoji: "📦" },
];

export default function HesapNav({
  userName,
  isAdmin = false,
}: {
  userName: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="glass mb-6 rounded-3xl p-4 lg:sticky lg:top-24 lg:mb-0">
      <div className="mb-3 border-b border-cyan-400/10 px-3 pb-3">
        <div className="text-xs uppercase tracking-wider text-muted">
          Hoş geldiniz
        </div>
        <div className="truncate font-display font-bold">{userName}</div>
      </div>
      <nav className="space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-xl border border-amber-400/40 px-3 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-400/70 hover:bg-amber-400/10"
          >
            <span>⚙️</span>
            Yönetim Paneli
          </Link>
        )}
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              pathname === item.href
                ? "bg-gradient-to-r from-cyan-500/25 to-teal-500/25 font-semibold text-cyan-200"
                : "text-muted hover:bg-cyan-400/10 hover:text-foreground"
            }`}
          >
            <span>{item.emoji}</span>
            {item.label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-red-400/10 hover:text-red-300">
            <span>🚪</span>
            Çıkış Yap
          </button>
        </form>
      </nav>
    </aside>
  );
}
