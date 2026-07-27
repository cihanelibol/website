"use client";

// Ürün detay sayfası açıldığında "ürün görüntüleme" olayını bildirir.
// Görünmez bir bileşendir; yalnızca giriş yapmış üyeler için kayıt oluşur.

import { useEffect } from "react";

export function logActivity(body: {
  type: "urun-goruntuleme" | "sepete-ekleme";
  productId?: number;
  productName?: string;
  qty?: number;
}): void {
  try {
    fetch("/api/etkinlik", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* izleme hatası akışı etkilemez */
  }
}

export default function ActivityPing({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  useEffect(() => {
    logActivity({ type: "urun-goruntuleme", productId, productName });
  }, [productId, productName]);

  return null;
}
