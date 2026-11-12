export default function ProductImagePlaceholder({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`store-product-placeholder${compact ? " store-product-placeholder-compact" : ""}`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z" />
        <path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5" />
      </svg>
      {!compact && <small>Ürün görseli eklenmemiş</small>}
    </div>
  );
}
