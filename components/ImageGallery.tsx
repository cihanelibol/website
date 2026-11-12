"use client";

import Image from "next/image";
import ProductImagePlaceholder from "@/components/ProductImagePlaceholder";
import { useState } from "react";

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="store-missing-gallery">
        <ProductImagePlaceholder />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="glass relative aspect-square overflow-hidden rounded-3xl bg-white/95">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 540px"
          className="object-contain p-6"
          unoptimized
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 bg-white/95 transition-colors ${
                i === active
                  ? "border-cyan-400"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Görsel ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="72px"
                className="object-contain p-1.5"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
