"use client";

// Ürün detay sayfası açıldığında "ürün görüntüleme" olayını bildirir.
// Görünmez bir bileşendir; yalnızca giriş yapmış üyeler için kayıt oluşur.

import { useEffect } from "react";
import { ANALYTICS_READY, trackEvent } from "@/lib/analytics";

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
  price,
}: {
  productId: number;
  productName: string;
  price: number;
}) {
  useEffect(() => {
    logActivity({ type: "urun-goruntuleme", productId, productName });
  }, [productId, productName]);

  useEffect(() => {
    let sent = false;
    const report = () => {
      if (!sent) sent = trackEvent("view_item", { currency: "TRY", value: price, items: [{ item_id: String(productId), item_name: productName, price, quantity: 1 }] });
    };
    report();
    window.addEventListener(ANALYTICS_READY, report);
    return () => window.removeEventListener(ANALYTICS_READY, report);
  }, [price, productId, productName]);

  return null;
}
