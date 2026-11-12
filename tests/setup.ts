import { vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
export const cookieJar = new Map<string, { value: string; options?: Record<string, unknown> }>();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (key: string) => cookieJar.get(key), set: (key: string, value: string, options: Record<string, unknown>) => cookieJar.set(key, { value, options }), delete: (key: string) => cookieJar.delete(key) }),
  headers: async () => new Headers(),
}));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
let directory: string;
beforeEach(async () => {
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("SESSION_SECRET", randomBytes(32).toString("base64url"));
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("APP_ORIGIN", "https://test.example");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("MAIL_FROM", "Test <sender@example.test>");
  directory = await mkdtemp(path.join(tmpdir(), "griakvaryum-security-"));
  vi.stubEnv("STORAGE_DIR", directory);
  cookieJar.clear();
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Network is forbidden in security unit tests"); }));
});
afterEach(async () => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); await rm(directory, { recursive: true, force: true }); });
