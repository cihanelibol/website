import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { tokenHash } from "./security";

const MAX_AGE = 30 * 24 * 3600;
export const orderCookieName = (id: string) => `ga_order_${id}`;

/** Scoped, expiring receipt capability; never a payment credential. */
export function orderAccessToken(id: string, now = Date.now()): string {
  const expires = Math.floor(now / 1000) + MAX_AGE;
  return `${expires}.${tokenHash(`order-read:${id}:${expires}`)}`;
}

export function validOrderAccess(id: string, token?: string): boolean {
  if (!/^GA-[A-F0-9]{24}$/.test(id) || !token || !/^\d{10}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expires, signature] = token.split(".");
  if (Number(expires) <= Date.now() / 1000 || Number(expires) > Date.now() / 1000 + MAX_AGE + 60) return false;
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(tokenHash(`order-read:${id}:${expires}`), "hex"));
}

export async function grantOrderAccess(id: string) {
  (await cookies()).set(orderCookieName(id), orderAccessToken(id), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
}

export function orderTrackingPath(id: string) {
  return `/sepet/sonuc?siparis=${encodeURIComponent(id)}`;
}

export function orderTrackingLink(id: string) {
  return `${orderTrackingPath(id)}&access=${orderAccessToken(id)}`;
}
