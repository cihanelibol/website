import "server-only";
import { createHash, createHmac, randomBytes, randomUUID, createCipheriv, createDecipheriv } from "node:crypto";
import { headers } from "next/headers";
import { updateJson } from "./storage";

export class InputError extends Error {}
export function textField(value: unknown, max: number, min = 0): string {
  if (typeof value !== "string") throw new InputError("Geçersiz alan.");
  const text = value.trim();
  if (text.length < min || text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))
    throw new InputError("Alan uzunluğu veya içeriği geçersiz.");
  return text;
}
export function emailField(value: unknown): string {
  const email = textField(value, 254, 3).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Geçerli bir e-posta adresi girin.");
  return email;
}
export function signingKey(): string {
  const key = process.env.SESSION_SECRET;
  if (!key || key.length < 43 || new Set(key).size < 16 || /dev-secret|changeme|example/i.test(key))
    throw new Error("A strong SESSION_SECRET is required (32 random bytes as base64url)");
  return key;
}
export function tokenHash(token: string): string {
  return createHmac("sha256", signingKey()).update(token).digest("hex");
}
export function seal(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", createHash("sha256").update(signingKey()).digest(), iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map(b => b.toString("base64url")).join(".");
}
export function unseal(value: string): string {
  const [iv, tag, data] = value.split(".").map(x => Buffer.from(x, "base64url"));
  const cipher = createDecipheriv("aes-256-gcm", createHash("sha256").update(signingKey()).digest(), iv);
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8");
}
export function appOrigin(): string {
  const origin = new URL(process.env.APP_ORIGIN || "https://griakvaryum.com");
  if (origin.username || origin.password || (process.env.NODE_ENV === "production" && origin.protocol !== "https:"))
    throw new Error("Invalid APP_ORIGIN");
  return origin.origin;
}
export async function requestIdentity(): Promise<string> {
  const h = await headers();
  // Vercel overwrites this header at ingress. Do not trust arbitrary X-Forwarded-For.
  return process.env.VERCEL === "1" ? (h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown") : "local";
}
type Bucket = { count: number; expires: number };
export async function rateLimit(scope: string, identity: string, max: number, seconds: number): Promise<boolean> {
  const key = tokenHash(`${scope}:${identity}`);
  const now = Date.now();
  return updateJson<Record<string, Bucket>, boolean>(`limits-${key.slice(0, 2)}.json`, {}, current => {
    for (const [id, bucket] of Object.entries(current)) if (bucket.expires <= now) delete current[id];
    if (!current[key] && Object.keys(current).length >= 2000) return { value: current, result: false };
    const bucket = current[key] ?? { count: 0, expires: now + seconds * 1000 };
    bucket.count = Math.min(max + 1, bucket.count + 1);
    current[key] = bucket;
    return { value: current, result: bucket.count <= max };
  });
}
export async function guardRate(scope: string, max: number, seconds = 60, identity?: string) {
  if (!await rateLimit(scope, identity ?? await requestIdentity(), max, seconds))
    throw new InputError("Çok fazla deneme. Lütfen daha sonra tekrar deneyin.");
}
export function safeError(error: unknown): string {
  return error instanceof InputError ? error.message : "İşlem tamamlanamadı. Lütfen daha sonra tekrar deneyin.";
}
export async function audit(event: string, actor?: string, target?: string, outcome = "success") {
  let requestId = randomUUID() as string;
  try { const id = (await headers()).get("x-request-id"); if (id && /^[a-f0-9-]{36}$/i.test(id)) requestId = id; } catch { /* Operator/test context has no request. */ }
  const record = { stream: "security", eventId: randomUUID(), requestId, event, actor, target, outcome, at: new Date().toISOString() };
  console.info(JSON.stringify(record));
  try {
    await updateJson<typeof record[], void>(`audit-${record.at.slice(0, 10)}.json`, [], current => {
      if (current.length >= 20_000) throw new Error("Audit partition full");
      return { value: [...current, record], result: undefined };
    });
  } catch { console.error(JSON.stringify({ stream: "security", event: "audit.persistence_failed", requestId, eventId: record.eventId })); }
}
export function sameOrigin(request: Request): boolean {
  return request.headers.get("origin") === appOrigin();
}
export async function limitedJson(request: Request, maxBytes = 4096): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new InputError("Invalid content type");
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("Empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new InputError("Body too large"); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally { reader.releaseLock(); }
}
