import Image from "next/image";

// iyzico üye işyeri zorunluluğu: sitede "iyzico ile Öde", Visa ve Mastercard
// logolarının görünmesi gerekir. Dosyalar iyzico'nun resmi logo paketinden
// (docs.iyzico.com/ek-bilgiler/iyzico-logo-paketi) değiştirilmeden alınmıştır.

/** Footer logo bandı: iyzico ile Öde + Mastercard + Visa + Amex + Troy. */
export function PaymentLogoBand({ tone = "white", className = "" }: { tone?: "white" | "colored"; className?: string }) {
  const src = tone === "white" ? "/payment/logo_band_white.svg" : "/payment/logo_band_colored.svg";
  const width = tone === "white" ? 456 : 429;
  return (
    <Image
      src={src}
      alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy ile güvenli ödeme"
      width={width}
      height={32}
      unoptimized
      className={className}
    />
  );
}

/** Ürün ve ödeme adımı için "iyzico ile Öde" + kart logoları. */
export function IyzicoCheckoutNote({ className = "" }: { className?: string }) {
  return (
    <div className={`store-payment-note ${className}`}>
      <PaymentLogoBand tone="colored" className="store-payment-band" />
      <p>Ödeme altyapısı: iyzico</p>
    </div>
  );
}
