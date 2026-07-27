"use server";

import { revalidatePath } from "next/cache";
import { addReview } from "@/lib/reviews";

export type ReviewState = { ok?: boolean; error?: string };

export async function addReviewAction(
  productId: number,
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const name = String(formData.get("name") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!name) return { error: "Adınızı yazın." };
  if (!rating || rating < 1 || rating > 5)
    return { error: "1-5 arası bir puan seçin." };
  if (comment.length < 3) return { error: "Kısa da olsa bir yorum yazın." };

  await addReview({ productId, name, rating, comment });
  revalidatePath(`/urunler/${productId}`);
  return { ok: true };
}
