"use client";
import { trackEvent } from "@/lib/analytics";

// Sepet durumu: localStorage'da saklanır, tüm sayfalarda paylaşılır.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number; // KDV dahil birim fiyat
  image: string | null;
  unit: string;
  maxStock: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  totalCount: number;
  totalAmount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ga_cart";
const CHANGE_EVENT = "ga:cart-change";
let memorySnapshot = "[]";
let memoryOnly = false;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
function snapshot() {
  if (memoryOnly) return memorySnapshot;
  try { return localStorage.getItem(STORAGE_KEY) ?? "[]"; }
  catch { return memorySnapshot; }
}
function serverSnapshot() { return "[]"; }
function parseItems(raw: string): CartItem[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is CartItem =>
      item !== null && typeof item === "object" &&
      Number.isSafeInteger(item.id) && typeof item.name === "string" &&
      Number.isFinite(item.price) && item.price >= 0 &&
      Number.isSafeInteger(item.maxStock) && item.maxStock > 0 &&
      Number.isSafeInteger(item.qty) && item.qty > 0 &&
      typeof item.unit === "string" &&
      (item.image === null || typeof item.image === "string")
    ).map((item) => ({ ...item, qty: Math.min(item.qty, item.maxStock) }));
  } catch { return []; }
}
function updateItems(update: (items: CartItem[]) => CartItem[]) {
  memorySnapshot = JSON.stringify(update(parseItems(snapshot())));
  try { localStorage.setItem(STORAGE_KEY, memorySnapshot); } catch { memoryOnly = true; }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const items = useMemo(() => parseItems(raw), [raw]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const before = parseItems(snapshot()).find(i => i.id === item.id)?.qty ?? 0;
    updateItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, qty: Math.min(i.maxStock, i.qty + qty) }
            : i
        );
      }
      return [...prev, { ...item, qty: Math.min(item.maxStock, qty) }];
    });
    const after = parseItems(snapshot()).find(i => i.id === item.id)?.qty ?? 0;
    if (after > before) trackEvent("add_to_cart", { currency: "TRY", value: item.price * (after - before), items: [{ item_id: String(item.id), item_name: item.name, price: item.price, quantity: after - before }] });
  }, []);

  const remove = useCallback((id: number) => {
    updateItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    updateItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            i.id === id ? { ...i, qty: Math.min(i.maxStock, qty) } : i
          )
    );
  }, []);

  const clear = useCallback(() => updateItems(() => []), []);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((s, i) => s + i.qty, 0);
    const totalAmount = items.reduce((s, i) => s + Math.round(i.price * 100) * i.qty, 0) / 100;
    return { items, add, remove, setQty, clear, totalCount, totalAmount };
  }, [items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
