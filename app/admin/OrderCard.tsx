"use client";

import AppIcon from "@/components/AppIcon";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ORDER_STATUS_LABELS,
  ORDER_TRANSITIONS,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/order-types";
import { reconcileAction, updateOrderStatusAction } from "./actions";
import { GROUP_HINTS, GROUP_LABELS, orderGroup, type OrderGroup } from "./order-groups";

function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(value);
}
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const GROUP_COLORS: Record<OrderGroup, string> = {
  kontrol: "bg-amber-500/20 text-amber-300",
  tahsilat: "bg-orange-500/20 text-orange-300",
  hazirlanacak: "bg-cyan-500/20 text-cyan-300",
  kargoda: "bg-violet-500/20 text-violet-300",
  tamamlandi: "bg-teal-500/20 text-teal-300",
  "kart-bekliyor": "bg-slate-500/20 text-slate-300",
  iptal: "bg-red-500/20 text-red-300",
};

/** Bir sonraki adımın buton metni. */
const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  onaylandi: "Siparişi onayla",
  hazirlaniyor: "Hazırlamaya başla",
  kargoda: "Kargoya verdim",
  "teslim-edildi": "Teslim edildi",
};

const inputClass =
  "w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";
const primaryButton =
  "rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 disabled:opacity-50";
const secondaryButton =
  "glass rounded-xl px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground disabled:opacity-50";

function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "9" + digits;
  else if (digits.length === 10) digits = "90" + digits;
  return `https://wa.me/${digits}`;
}

type Panel = null | "status" | "submission" | "payment";

export default function OrderCard({ order }: { order: OrderRecord }) {
  const currentStatus: OrderStatus = order.status ?? "yeni";
  const group = orderGroup(order);
  const allowed = group === "kart-bekliyor" ? (["iptal"] as OrderStatus[]) : ORDER_TRANSITIONS[currentStatus];
  const next = allowed.find((s) => s !== "iptal");
  const blocked = group === "kontrol";

  const [panel, setPanel] = useState<Panel>(null);
  const [status, setStatus] = useState<OrderStatus>(next ?? currentStatus);
  const [cargoFirma, setCargoFirma] = useState(order.cargo?.firma ?? "");
  const [cargoTakipNo, setCargoTakipNo] = useState(order.cargo?.takipNo ?? "");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [reference, setReference] = useState("");
  const [checkNote, setCheckNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [details, setDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const openStatus = (s: OrderStatus) => {
    setStatus(s);
    setFeedback(null);
    setPanel("status");
  };

  const saveStatus = () => {
    if (status === "kargoda" && (!cargoFirma.trim() || !cargoTakipNo.trim())) {
      setFeedback({ ok: false, message: "Kargo firması ve takip numarasını girin." });
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId: order.id, status, cargoFirma, cargoTakipNo, note, notifyCustomer: notify });
      setFeedback({ ok: result.ok === true, message: result.ok ? "Güncellendi" + (notify && result.emailQueued ? " · müşteri bildirimi kuyruğa alındı" : "") : `${result.error}` });
      if (result.ok) { setNote(""); setPanel(null); }
    });
  };

  const saveCheck = (kind: "submission" | "payment") => {
    setFeedback(null);
    const data = new FormData();
    data.set("kind", kind);
    data.set("id", order.id);
    data.set("total", String(order.total));
    data.set("reference", reference);
    data.set("note", checkNote);
    if (confirmed) data.set("confirmed", "on");
    startTransition(async () => {
      const result = await reconcileAction({}, data);
      setFeedback({ ok: result.ok === true, message: result.ok ? (kind === "payment" ? "Tahsilat kaydedildi" : "Aktarım onaylandı") : `${result.error}` });
      if (result.ok) { setReference(""); setCheckNote(""); setConfirmed(false); setPanel(null); }
    });
  };

  const copyId = async () => {
    try { await navigator.clipboard.writeText(order.id); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* izin yok */ }
  };

  const paymentBadge =
    order.paymentStatus === "odendi"
      ? { text: order.paymentMethod === "iyzico" ? "Kartla ödendi" : "Ödendi", cls: "bg-teal-500/20 text-teal-300" }
      : group === "kart-bekliyor"
        ? { text: "Kart ödemesi yok", cls: "bg-slate-500/20 text-slate-300" }
        : { text: "Ödeme bekleniyor", cls: "bg-orange-500/20 text-orange-300" };

  const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <article className={`glass rounded-2xl p-5 ${group === "kart-bekliyor" || group === "iptal" ? "opacity-70" : ""}`}>
      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="text-base">{order.customerName}</strong>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${GROUP_COLORS[group]}`}>{GROUP_LABELS[group]}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${paymentBadge.cls}`}>{paymentBadge.text}</span>
            {order.userId === null && <span className="rounded-full bg-slate-500/20 px-2.5 py-0.5 text-xs text-slate-300">Misafir</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span>{formatDate(order.createdAt)}</span>
            <button type="button" onClick={copyId} className="font-mono hover:text-foreground" title="Sipariş numarasını kopyala">
              {order.id} {copied ? "✓ kopyalandı" : "⧉"}
            </button>
            <span>Durum: {ORDER_STATUS_LABELS[currentStatus]}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold text-accent">{formatTL(order.total)}</div>
          <div className="text-xs text-muted">
            {itemCount} ürün
            {order.shippingFee !== undefined && ` · kargo ${order.shippingFee === 0 ? "ücretsiz" : formatTL(order.shippingFee)}`}
          </div>
        </div>
      </div>

      {/* Ne yapmalıyım? */}
      {(group === "kontrol" || group === "tahsilat" || group === "kart-bekliyor") && (
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-sm text-amber-300">
          <AppIcon name="info" /> {GROUP_HINTS[group]}
        </p>
      )}

      {/* İletişim */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
        <a href={`tel:${order.phone.replace(/[^\d+]/g, "")}`} className="hover:text-foreground"><AppIcon name="phone" /> {order.phone}</a>
        <a href={whatsappLink(order.phone)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><AppIcon name="message" /> WhatsApp</a>
        <a href={`mailto:${order.email}?subject=${encodeURIComponent(`Siparişiniz ${order.id}`)}`} className="truncate hover:text-foreground"><AppIcon name="mail" /> {order.email}</a>
        <span className="w-full"><AppIcon name="pin" /> {order.addressText}</span>
        {order.cargo?.firma && (
          <span className="w-full"><AppIcon name="truck" /> {order.cargo.firma}{order.cargo.takipNo && ` — Takip: ${order.cargo.takipNo}`}</span>
        )}
      </div>

      {/* Ürünler (kısa) */}
      <ul className="mt-3 space-y-1 border-t border-cyan-400/10 pt-3 text-sm">
        {(details ? order.items : order.items.slice(0, 3)).map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <Link href={`/urunler/${item.id}`} className="min-w-0 truncate hover:text-cyan-300">{item.name}</Link>
            <span className="shrink-0 text-muted">{item.qty} × {formatTL(item.price)}</span>
          </li>
        ))}
        {!details && order.items.length > 3 && <li className="text-xs text-muted">+{order.items.length - 3} ürün daha</li>}
      </ul>

      {/* Hızlı aksiyonlar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {group === "kontrol" && (
          <button type="button" className={primaryButton} onClick={() => { setFeedback(null); setPanel(panel === "submission" ? null : "submission"); }}>
            EasyTrade&apos;de gördüm, onayla
          </button>
        )}
        {group === "tahsilat" && (
          <button type="button" className={primaryButton} onClick={() => { setFeedback(null); setPanel(panel === "payment" ? null : "payment"); }}>
            Ödemeyi aldım
          </button>
        )}
        {next && !blocked && (
          <button type="button" className={group === "tahsilat" ? secondaryButton : primaryButton} onClick={() => openStatus(next)}>
            {NEXT_LABEL[next] ?? ORDER_STATUS_LABELS[next]} →
          </button>
        )}
        {allowed.includes("iptal") && !blocked && (
          <button type="button" className={secondaryButton} onClick={() => openStatus("iptal")}>İptal et</button>
        )}
        <button type="button" className="ml-auto text-xs font-medium text-cyan-300 hover:text-cyan-200" onClick={() => setDetails((v) => !v)}>
          {details ? "▲ Ayrıntıları gizle" : "▼ Ayrıntılar"}
        </button>
      </div>

      {feedback && (
        <p role="status" className={`mt-2 text-sm ${feedback.ok ? "text-teal-400" : "text-red-400"}`}>
          <AppIcon name={feedback.ok ? "check" : "warning"} /> {feedback.message}
        </p>
      )}

      {/* Durum değiştirme paneli */}
      {panel === "status" && (
        <div className="mt-4 space-y-3 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <div className="text-sm font-semibold">
            {status === "iptal" ? "Siparişi iptal et" : `Yeni durum: ${ORDER_STATUS_LABELS[status]}`}
          </div>
          {status === "kargoda" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Kargo firması</label>
                <input value={cargoFirma} onChange={(e) => setCargoFirma(e.target.value)} placeholder="Yurtiçi, Aras, MNG..." className={inputClass} list={`kargo-${order.id}`} />
                <datalist id={`kargo-${order.id}`}>
                  {["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo", "PTT Kargo", "Kolay Gelsin", "Hepsijet"].map((f) => <option key={f} value={f} />)}
                </datalist>
              </div>
              <div>
                <label className={labelClass}>Takip numarası</label>
                <input value={cargoTakipNo} onChange={(e) => setCargoTakipNo(e.target.value)} placeholder="1234567890" className={inputClass} />
              </div>
            </div>
          )}
          <div>
            <label className={labelClass}>{status === "iptal" ? "İptal nedeni" : "Müşteriye not (isteğe bağlı)"}</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={status === "iptal" ? "Stok kalmadı, müşteri vazgeçti..." : "Müşteriye iletilecek not..."} className={inputClass} />
          </div>
          {status === "iptal" && order.paymentStatus === "odendi" && order.paymentMethod === "iyzico" && (
            <p className="text-sm text-amber-300"><AppIcon name="warning" /> Bu sipariş kartla ödendi. İptal, parayı otomatik iade etmez; iadeyi iyzico panelinden yapın.</p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 cursor-pointer accent-cyan-400" />
              Müşteriye e-posta ile bildir
            </label>
            <div className="flex gap-2">
              <button type="button" className={secondaryButton} onClick={() => setPanel(null)}>Vazgeç</button>
              <button type="button" className={primaryButton} disabled={pending} onClick={saveStatus}>{pending ? "Kaydediliyor..." : "Kaydet"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Aktarım onayı / tahsilat kaydı */}
      {(panel === "submission" || panel === "payment") && (
        <div className="mt-4 space-y-3 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
          <p className="text-sm text-muted">
            {panel === "submission"
              ? "EasyTrade panelinde bu müşterinin siparişini bulun. Varsa EasyTrade sipariş numarasını yazıp onaylayın. Yoksa onaylamayın; müşteriyi arayıp siparişi iptal edin."
              : <>Banka hesabınıza <strong className="text-foreground">{formatTL(order.total)}</strong> geldiğini (veya elden alındığını) kontrol edin. Bu işlem para çekmez, yalnızca kayıt tutar.</>}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>{panel === "submission" ? "EasyTrade sipariş no" : "Dekont / işlem no"}</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={120} placeholder={panel === "submission" ? "ET-12345" : "Havale açıklaması, dekont no veya \"elden\""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Not (en az 10 karakter)</label>
              <input value={checkNote} onChange={(e) => setCheckNote(e.target.value)} maxLength={500} placeholder={panel === "submission" ? "EasyTrade panelinde sipariş mevcut" : "Ziraat hesabına havale geldi"} className={inputClass} />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="h-4 w-4 cursor-pointer accent-cyan-400" />
            {panel === "submission" ? "EasyTrade'de siparişi kendim gördüm." : "Tutarın hesaba geçtiğini kendim kontrol ettim."}
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className={secondaryButton} onClick={() => setPanel(null)}>Vazgeç</button>
            <button type="button" className={primaryButton} disabled={pending || !confirmed || reference.trim().length < 3 || checkNote.trim().length < 10} onClick={() => saveCheck(panel)}>
              {pending ? "Kaydediliyor..." : panel === "submission" ? "Aktarımı onayla" : "Tahsilatı kaydet"}
            </button>
          </div>
        </div>
      )}

      {/* Ayrıntılar: geçmiş, ödeme kanıtı, serbest durum seçimi */}
      {details && (
        <div className="mt-4 space-y-3 border-t border-cyan-400/10 pt-4 text-xs text-muted">
          {order.paymentEvidence && (
            <p>Tahsilat kaydı: {order.paymentEvidence.actor === "iyzico" ? "iyzico" : "yönetici"} · ref. {order.paymentEvidence.reference} · {formatDate(order.paymentEvidence.at)}</p>
          )}
          {order.providerReference && <p>EasyTrade referansı: {order.providerReference}</p>}
          {(order.history?.length ?? 0) > 0 && (
            <div>
              <div className="mb-1.5 font-semibold uppercase tracking-wider">Geçmiş</div>
              <ol className="space-y-1">
                {order.history!.map((h, i) => (
                  <li key={i}>
                    <span className="text-cyan-300">{formatDate(h.at)}</span> — {ORDER_STATUS_LABELS[h.status]}
                    {h.note && <span className="italic"> · {h.note}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
