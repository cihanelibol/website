"use client";

import AppIcon from "@/components/AppIcon";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ReviewState } from "@/app/urunler/[id]/actions";

export default function ReviewForm({
  action,
}: {
  action: (prev: ReviewState, formData: FormData) => Promise<ReviewState>;
}) {
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(
    action,
    {}
  );
  const [rating, setRating] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.ok) successRef.current?.focus(); }, [state.ok]);

  if (state.ok) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl border border-teal-400/30 bg-teal-400/10 px-5 py-4 text-sm">
        <AppIcon name="check" /> Yorumunuz kaydedildi. İncelemeden sonra yayımlanacak, teşekkürler!
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p id="review-rating-label" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Puanınız</p>
        <div role="radiogroup" aria-labelledby="review-rating-label" className="flex flex-wrap items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="store-rating-option">
              <input type="radio" name="rating" value={star} checked={rating === star} onChange={() => setRating(star)} aria-label={`${star} yıldız`} required />
              <svg viewBox="0 0 24 24" aria-hidden="true" data-filled={star <= rating}><path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3l-5.6 3 1.1-6.3L3 9.6l6.2-.9Z" /></svg>
            </label>
          ))}
          <span className="sr-only" role="status">{rating ? `Seçiminiz: ${rating} yıldız` : "Puan seçin"}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Adınız
          </label>
          <input
            id="review-name"
            autoComplete="name"
            name="name"
            required
            maxLength={60}
            placeholder="Ad Soyad"
            className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Yorumunuz
        </label>
        <textarea
          id="review-comment"
          name="comment"
          required
          rows={3}
          maxLength={1000}
          placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
          className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-lg outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-amber-400"><AppIcon name="warning" /> {state.error}</p>
      )}

      <button
        disabled={pending}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Yorumu Gönder"}
      </button>
    </form>
  );
}
