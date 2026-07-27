"use client";

import { useActionState, useState } from "react";
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
  const [hover, setHover] = useState(0);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 px-5 py-4 text-sm">
        ✓ Yorumunuz kaydedildi, teşekkürler!
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Puanınız
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl transition-transform hover:scale-125"
              aria-label={`${star} yıldız`}
            >
              <span
                className={
                  star <= (hover || rating) ? "" : "opacity-25 grayscale"
                }
              >
                ⭐
              </span>
            </button>
          ))}
          <input type="hidden" name="rating" value={rating} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            Adınız
          </label>
          <input
            name="name"
            required
            maxLength={60}
            placeholder="Ad Soyad"
            className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Yorumunuz
        </label>
        <textarea
          name="comment"
          required
          rows={3}
          maxLength={1000}
          placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
          className="w-full rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-cyan-400/50"
        />
      </div>

      {state.error && (
        <p className="text-sm text-amber-400">⚠ {state.error}</p>
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
