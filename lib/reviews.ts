import "server-only";
// Ürün yorumları ve puanlama

import { randomUUID } from "crypto";
import { readJson, updateJson } from "./storage";
import { requireAdmin } from "./auth";
import { audit, InputError } from "./security";

export type Review = {
  id: string;
  productId: number;
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
  moderation?: "pending" | "approved" | "rejected";
  moderatedBy?: string;
  moderatedAt?: string;
};

const FILE = "reviews.json";

export async function getReviews(productId: number): Promise<Review[]> {
  const all = await readJson<Review[]>(FILE, []);
  return all
    .filter((r) => r.productId === productId && r.moderation === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addReview(input: {
  productId: number;
  name: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const review: Review = {
    id: randomUUID(),
    productId: input.productId,
    name: input.name.trim().slice(0, 60),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    comment: input.comment.trim().slice(0, 1000),
    createdAt: new Date().toISOString(),
    moderation: "pending",
  };
  await updateJson<Review[], void>(FILE, [], all => {
    if (all.length >= 20_000 || all.filter(r => !r.moderation || r.moderation === "pending").length >= 1000)
      throw new InputError("Yorumlar şu anda inceleme bekliyor. Lütfen daha sonra deneyin.");
    return { value: [...all, review], result: undefined };
  });
  return review;
}

export async function getModerationReviews() {
  await requireAdmin();
  return (await readJson<Review[]>(FILE, [])).filter(r => !r.moderation || r.moderation === "pending").slice(0, 100);
}
export async function moderateReview(id: string, decision: "approved" | "rejected") {
  const admin = await requireAdmin();
  if (!["approved", "rejected"].includes(decision)) throw new InputError("Geçersiz karar.");
  const productId = await updateJson<Review[], number>(FILE, [], all => {
    const review = all.find(r => r.id === id);
    if (!review) throw new InputError("Yorum bulunamadı.");
    review.moderation = decision; review.moderatedBy = admin.id; review.moderatedAt = new Date().toISOString();
    return { value: all, result: review.productId };
  });
  await audit("review.moderated", admin.id, id, decision);
  return productId;
}

export function ratingSummary(reviews: Review[]): {
  count: number;
  average: number;
} {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { count: reviews.length, average: sum / reviews.length };
}
