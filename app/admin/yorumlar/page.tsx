import { getModerationReviews } from "@/lib/reviews";
import { moderateReviewAction } from "../actions";
export default async function ReviewModerationPage() {
  const reviews = await getModerationReviews();
  return <section className="space-y-4"><h2 className="text-2xl font-semibold">Yorum inceleme</h2>
    <p>Bekleyen ilk 100 yorum gösterilir. Kişisel bilgi, reklam veya hakaret içeren yorumları yayımlamayın.</p>
    {reviews.length === 0 && <p>İnceleme bekleyen yorum yok.</p>}
    {reviews.map(review => <article key={review.id} className="glass rounded-xl p-4 space-y-3">
      <h3>{review.name} · Ürün {review.productId} · {review.rating}/5</h3><p className="break-words">{review.comment}</p>
      <form action={moderateReviewAction} className="flex gap-3"><input type="hidden" name="id" value={review.id} />
        <button className="store-button" name="decision" value="approved">Yayımla</button>
        <button className="store-button-secondary" name="decision" value="rejected">Reddet</button>
      </form>
    </article>)}
  </section>;
}
