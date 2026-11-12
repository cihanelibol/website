import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const prefix = "scrypt$131072$8$1$";
const currentPattern = /^scrypt\$131072\$8\$1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;
const legacyPattern = /^([a-f0-9]{32}):([a-f0-9]{128})$/;
let running = 0;
async function derive(password: string, salt: string, legacy = false): Promise<Buffer> {
  // Bound memory per warm instance even if the libuv worker pool is enlarged.
  if (running >= 4) throw new Error("Password verification capacity exceeded");
  running++;
  try {
    return await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64,
      { N: legacy ? 16384 : 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 },
      (error, key) => error ? reject(error) : resolve(key)));
  } finally { running--; }
}
export function passwordNeedsUpgrade(hash: string) { return legacyPattern.test(hash); }
export async function encodePassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${prefix}${salt}$${(await derive(password, salt)).toString("hex")}`;
}
export async function checkPassword(password: string, stored: string) {
  if (typeof password !== "string" || password.length > 128) return false;
  const current = currentPattern.exec(stored), legacy = legacyPattern.exec(stored);
  const match = current ?? legacy;
  const key = await derive(password, match?.[1] ?? "0".repeat(32), Boolean(legacy));
  const valid = timingSafeEqual(key, Buffer.from(match?.[2] ?? "0".repeat(128), "hex"));
  if (legacy && !valid) await derive(password, "0".repeat(32));
  return Boolean(match) && valid;
}
