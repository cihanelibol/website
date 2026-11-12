import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import Link from "next/link";
import { AddToCartButton } from "./cart/AddToCartButton";
import ProductQuickView from "./ProductQuickView";
import type { EtProduct } from "@/lib/easytrade";
import { formatPrice, primaryImage } from "@/lib/product-display";
import { BRANDS, productMatchesBrand } from "@/lib/catalog";

export default function ProductCard({ product, headingLevel = 3 }: { product: EtProduct; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const image = primaryImage(product);
  const inStock = product.stock_quantity > 0;
  const brand =
    BRANDS.find((b) => productMatchesBrand(product, b))?.label ??
    product.categories[0]?.name ??
    "Gri Akvaryum";
  return (
    <article className="store-product" data-has-image={Boolean(image)}>
      <div className="store-product-media">
        <Link
          href={`/urunler/${product.id}`}
          className="store-product-image"
          aria-label={product.name}
        >
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 260px"
              unoptimized
            />
          ) : (
            <ProductImagePlaceholder />
          )}
        </Link>
        {!inStock ? (
          <span className="store-stock store-stock-out">Stokta yok</span>
        ) : (
          product.stock_quantity <= 5 && (
            <span className="store-stock">
              Son {product.stock_quantity} ürün
            </span>
          )
        )}
        <ProductQuickView product={product} />
      </div>
      <div className="store-product-body">
        <p className="store-product-category">{brand}</p>
        <Link href={`/urunler/${product.id}`}>
          <Heading>{product.name}</Heading>
        </Link>
        <div className="store-product-buy">
          <div>
            <div className="store-price">
              {formatPrice(product.price_with_tax)}
            </div>
            <div className="store-tax">KDV dahil / {product.unit.label}</div>
          </div>
          <AddToCartButton product={product} iconOnly />
        </div>
      </div>
    </article>
  );
}
