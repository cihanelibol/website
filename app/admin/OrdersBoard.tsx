"use client";

import AppIcon from "@/components/AppIcon";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { OrderRecord } from "@/lib/order-types";
import OrderCard from "./OrderCard";
import { GROUP_HINTS, GROUP_LABELS, orderGroup, type OrderGroup } from "./order-groups";

type Filter = "islem" | OrderGroup | "tumu";

// "İşlem bekleyen" = sizin bir şey yapmanız gereken siparişler.
const ACTION_GROUPS: OrderGroup[] = ["kontrol", "tahsilat", "hazirlanacak"];
const FILTERS: Filter[] = ["islem", "kontrol", "tahsilat", "hazirlanacak", "kargoda", "tamamlandi", "kart-bekliyor", "iptal", "tumu"];
const FILTER_LABELS: Record<Filter, string> = { ...GROUP_LABELS, islem: "İşlem bekleyen", tumu: "Tümü" };

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR").replace(/\s+/g, "");
}

export default function OrdersBoard({ orders }: { orders: OrderRecord[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initial = params.get("filtre") as Filter | null;
  const [filter, setFilterState] = useState<Filter>(initial && FILTERS.includes(initial) ? initial : "islem");
  const [query, setQuery] = useState("");

  const setFilter = (f: Filter) => {
    setFilterState(f);
    router.replace(f === "islem" ? pathname : `${pathname}?filtre=${f}`, { scroll: false });
  };

  const grouped = useMemo(() => orders.map((o) => ({ order: o, group: orderGroup(o) })), [orders]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(FILTERS.map((f) => [f, 0])) as Record<Filter, number>;
    for (const { group } of grouped) {
      c[group]++;
      c.tumu++;
      if (ACTION_GROUPS.includes(group)) c.islem++;
    }
    return c;
  }, [grouped]);

  const visible = useMemo(() => {
    const q = normalize(query);
    return grouped
      .filter(({ group }) => filter === "tumu" || (filter === "islem" ? ACTION_GROUPS.includes(group) : group === filter))
      .filter(({ order: o }) => !q || [o.id, o.customerName, o.email, o.phone, o.cargo?.takipNo ?? ""].some((v) => normalize(v).includes(q)))
      // İşlem bekleyenlerde en eski önce (sıra bekleyen), diğerlerinde en yeni önce.
      .sort((a, b) => (filter === "islem" ? a.order.createdAt.localeCompare(b.order.createdAt) : b.order.createdAt.localeCompare(a.order.createdAt)));
  }, [grouped, filter, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-lg font-bold">Siparişler</h2>
        <label className="relative ml-auto w-full sm:w-72">
          <span className="sr-only">Sipariş ara</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><AppIcon name="search" /></span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim, telefon, e-posta, sipariş no..."
            className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 py-2.5 pl-9 pr-3.5 text-sm outline-none placeholder:text-muted focus:border-cyan-400/50"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sipariş filtresi">
        {FILTERS.filter((f) => counts[f] > 0 || f === "islem" || f === "tumu").map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950" : "glass text-muted hover:text-foreground"
            }`}
          >
            {FILTER_LABELS[f]} <span className="opacity-70">{counts[f]}</span>
          </button>
        ))}
      </div>

      {filter !== "islem" && filter !== "tumu" && <p className="text-sm text-muted">{GROUP_HINTS[filter]}</p>}

      {visible.length === 0 ? (
        <div className="glass rounded-3xl px-6 py-14 text-center text-sm text-muted">
          {query ? "Aramaya uyan sipariş yok." : filter === "islem" ? "Bekleyen iş yok. Her şey yolunda." : "Bu grupta sipariş yok."}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(({ order }) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </section>
  );
}
