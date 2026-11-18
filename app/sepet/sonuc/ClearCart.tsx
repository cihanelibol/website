"use client";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function ClearCart({ orderId, items, cancelled = false }: { orderId: string; items: { id: number; qty: number }[]; cancelled?: boolean }) {
  const { completeOrder } = useCart();
  useEffect(() => {
    if (cancelled) {
      try {
        const draft = JSON.parse(sessionStorage.getItem("ga_checkout_draft") ?? "null");
        if (draft?.resultUrl === `/sepet/sonuc?siparis=${orderId}`) sessionStorage.removeItem("ga_checkout_draft");
      } catch { /* Optional local draft. */ }
      return;
    }
    completeOrder(orderId, items);
  }, [completeOrder, orderId, items, cancelled]);
  return null;
}
