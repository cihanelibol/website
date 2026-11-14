// Merchant-confirmed terms. Keep the storefront, checkout and structured data together.
export const SHIPPING = {
  fee: 200,
  freeAbove: 2500,
  country: "TR",
  cutoffTime: "15:00:00+03:00",
  policyPath: "/sozlesme/kargo-teslimat",
  summary: "Kargo 200 TL; ürünler toplamı 2.500 TL üzerindeki siparişlerde ücretsizdir.",
  dispatch: "Saat 15.00'e kadar verilen siparişler aynı gün kargoya verilir.",
} as const;

export function shippingFee(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return Math.round(subtotal * 100) > SHIPPING.freeAbove * 100 ? 0 : SHIPPING.fee;
}

export function totalWithShipping(subtotal: number): number {
  return (Math.round(subtotal * 100) + shippingFee(subtotal) * 100) / 100;
}
