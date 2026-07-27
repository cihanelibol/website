// Ürün yorumları ve puanlama

import { randomUUID } from "crypto";
import { readJson, writeJson } from "./storage";

export type Review = {
  id: string;
  productId: number;
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO
};

const FILE = "reviews.json";

export async function getReviews(productId: number): Promise<Review[]> {
  const all = await readJson<Review[]>(FILE, []);
  return all
    .filter((r) => r.productId === productId)
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
  };
  const all = await readJson<Review[]>(FILE, []);
  all.push(review);
  await writeJson(FILE, all);
  return review;
}

export function ratingSummary(reviews: Review[]): {
  count: number;
  average: number;
} {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { count: reviews.length, average: sum / reviews.length };
}
