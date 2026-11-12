import { describe, it, expect, vi } from "vitest";
const backend = vi.hoisted(() => ({ value: undefined as unknown, revision: 0, conflicts: 0 }));
vi.mock("@neondatabase/serverless", () => ({
  neonConfig: {},
  neon: () => async (parts: TemplateStringsArray, ...values: unknown[]) => {
    const sql = parts.join("?");
    if (sql.startsWith("SELECT")) return backend.value === undefined ? [] : [{ data: structuredClone(backend.value), revision: String(backend.revision) }];
    if (sql.startsWith("INSERT")) {
      if (backend.value !== undefined) return [];
      backend.value = JSON.parse(values[1] as string); backend.revision++; return [{ key: values[0] }];
    }
    if (sql.startsWith("UPDATE")) {
      if (backend.conflicts > 0) { backend.conflicts--; backend.value = Number(backend.value) + 10; backend.revision++; return []; }
      if (values[2] !== String(backend.revision)) return [];
      backend.value = JSON.parse(values[0] as string); backend.revision++; return [{ key: values[1] }];
    }
    throw new Error("Unexpected SQL");
  },
}));
import { readJson, updateJson } from "../lib/storage";
describe("database compare-and-swap", () => {
  it("recomputes against concurrent changes instead of overwriting them", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://synthetic.invalid/test");
    backend.value = 0; backend.revision = 1; backend.conflicts = 1;
    const result = await updateJson("counter.json", 0, current => ({ value: current + 1, result: current + 1 }));
    expect(result).toBe(11); expect(await readJson("counter.json", 0)).toBe(11);
  });
  it("preserves all concurrent creates and increments", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://synthetic.invalid/test");
    backend.value = undefined; backend.revision = 0; backend.conflicts = 0;
    await Promise.all(Array.from({ length: 8 }, () => updateJson("counter.json", 0, n => ({ value: n + 1, result: undefined }))));
    expect(backend.value).toBe(8);
  });
  it("stops after bounded contention without replacing newer data", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://synthetic.invalid/test");
    backend.value = 0; backend.revision = 1; backend.conflicts = 20;
    await expect(updateJson("counter.json", 0, n => ({ value: n + 1, result: undefined }))).rejects.toThrow("contention");
    expect(backend.value).toBe(120);
  });
});
