"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-types";
import { updateOrderStatusAction } from "./actions";

function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  yeni: "bg-cyan-500/20 text-cyan-300",
  onaylandi: "bg-blue-500/20 text-blue-300",
  hazirlaniyor: "bg-amber-500/20 text-amber-300",
  kargoda: "bg-violet-500/20 text-violet-300",
  "teslim-edildi": "bg-teal-500/20 text-teal-300",
  iptal: "bg-red-500/20 text-red-300",
};

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";

export default function OrderCard({ order }: { order: OrderRecord }) {
  const currentStatus: OrderStatus = order.status ?? "yeni";
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [cargoFirma, setCargoFirma] = useState(order.cargo?.firma ?? "");
  const [cargoTakipNo, setCargoTakipNo] = useState(order.cargo?.takipNo ?? "");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onSave = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction({
        orderId: order.id,
        status,
        cargoFirma,
        cargoTakipNo,
        note,
        notifyCustomer: notify,
      });
      setFeedback(
        result.ok
          ? "✓ Güncellendi" + (notify ? " ve müşteriye e-posta gönderildi" : "")
          : `⚠ ${result.error}`
      );
      if (result.ok) setNote("");
    });
  };

  return (
    <div className="glass rounded-2xl p-5">
      {/* Başlık satırı */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-display font-bold">{order.id}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[currentStatus]}`}
            >
              {ORDER_STATUS_LABELS[currentStatus]}
            </span>
            {order.userId === null && (
              <span className="rounded-full bg-slate-500/20 px-2.5 py-0.5 text-xs text-slate-300">
                Misafir
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-muted">
            {new Date(order.createdAt).toLocaleString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-bold text-gradient">
            {formatTL(order.total)}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
          >
            {open ? "▲ Kapat" : "▼ Yönet"}
          </button>
        </div>
      </div>

      {/* Müşteri özeti */}
      <div className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
        <span>
          👤 <strong className="text-foreground">{order.customerName}</strong>{" "}
          — {order.phone}
        </span>
        <span className="truncate">✉️ {order.email}</span>
        <span className="sm:col-span-2">📍 {order.addressText}</span>
        {order.cargo?.firma && (
          <span className="sm:col-span-2">
            🚚 {order.cargo.firma}
            {order.cargo.takipNo && ` — Takip: ${order.cargo.takipNo}`}
          </span>
        )}
      </div>

      {open && (
        <div className="mt-4 space-y-4 border-t border-cyan-400/10 pt-4">
          {/* Ürünler */}
          <ul className="space-y-1.5 text-sm text-muted">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <Link
                  href={`/urunler/${item.id}`}
                  className="min-w-0 truncate hover:text-cyan-200"
                >
                  {item.name}
                </Link>
                <span className="shrink-0">
                  {item.qty} × {formatTL(item.price)}
                </span>
              </li>
            ))}
          </ul>

          {/* Durum geçmişi */}
          {(order.history?.length ?? 0) > 0 && (
            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Durum Geçmişi
              </div>
              <ol className="space-y-1 text-xs text-muted">
                {order.history!.map((h, i) => (
                  <li key={i}>
                    <span className="text-cyan-300">
                      {new Date(h.at).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>{" "}
                    — {ORDER_STATUS_LABELS[h.status]}
                    {h.note && <span className="italic"> · {h.note}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Durum güncelleme */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Yeni Durum
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className={`${inputClass} cursor-pointer [&>option]:bg-[#071a2b]`}
              >
                {ORDER_STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Not (isteğe bağlı)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Müşteriye iletilecek not..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Kargo bilgileri — kargoda seçilince öne çıkar */}
          <div
            className={`grid gap-3 sm:grid-cols-2 ${
              status === "kargoda"
                ? "rounded-xl border border-violet-400/30 bg-violet-400/10 p-3"
                : ""
            }`}
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Kargo Firması
              </label>
              <input
                value={cargoFirma}
                onChange={(e) => setCargoFirma(e.target.value)}
                placeholder="Yurtiçi, Aras, MNG..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                Takip Numarası
              </label>
              <input
                value={cargoTakipNo}
                onChange={(e) => setCargoTakipNo(e.target.value)}
                placeholder="1234567890"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-cyan-400"
              />
              Müşteriye e-posta ile bildir
            </label>
            <div className="flex items-center gap-3">
              {feedback && (
                <span
                  className={`text-xs ${
                    feedback.startsWith("✓") ? "text-teal-400" : "text-red-400"
                  }`}
                >
                  {feedback}
                </span>
              )}
              <button
                onClick={onSave}
                disabled={pending}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 disabled:opacity-50"
              >
                {pending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
