"use server";
import { revalidatePath } from "next/cache";
import { addReview } from "@/lib/reviews";
import { getProduct } from "@/lib/easytrade";
import { guardRate, textField, safeError, InputError } from "@/lib/security";
export type ReviewState = { ok?: boolean; error?: string };
export async function addReviewAction(productId: number, _prev: ReviewState, data: FormData): Promise<ReviewState> {
  try {
    await guardRate("review", 3, 3600);
    if (!Number.isSafeInteger(productId) || productId < 1 || !await getProduct(productId)) throw new InputError("Ürün bulunamadı.");
    const rating = Number(data.get("rating"));
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new InputError("1–5 arasında puan seçin.");
    await addReview({ productId, name: textField(data.get("name"), 60, 2), rating, comment: textField(data.get("comment"), 1000, 3) });
    revalidatePath(`/urunler/${productId}`); return { ok: true };
  } catch (error) { return { error: safeError(error) }; }
}
