import { it, expect } from "vitest";
import { scryptSync } from "node:crypto";
import { checkPassword, encodePassword } from "../lib/passwords";
import { verifyLogin, type User } from "../lib/auth";
import { readJson, updateJson } from "../lib/storage";
it("uses explicit strong costs and upgrades a legacy hash on successful login", async () => {
  const password = "a sufficiently long test password", salt = "a".repeat(32);
  const legacy = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  await updateJson<User[], void>("users.json", [], () => ({ value: [{ id: "a".repeat(24), name: "Test", email: "test@example.test", passwordHash: legacy, emailVerifiedAt: new Date().toISOString(), createdAt: new Date().toISOString(), role: "customer" }], result: undefined }));
  expect(await verifyLogin("test@example.test", "wrong password")).toBeUndefined();
  expect((await readJson<User[]>("users.json", []))[0].passwordHash).toBe(legacy);
  const authenticated = await verifyLogin("test@example.test", password);
  expect(authenticated?.passwordHash).toMatch(/^scrypt\$131072\$8\$1\$/);
  expect(await checkPassword(password, authenticated!.passwordHash)).toBe(true);
  expect(await checkPassword("wrong password", authenticated!.passwordHash)).toBe(false);
});
it("rejects unrecognized cost parameters without executing attacker-selected work", async () => {
  expect(await checkPassword("test", "scrypt$999999999$8$1$bad$hash")).toBe(false);
  expect(await encodePassword("test password")).toMatch(/^scrypt\$131072\$8\$1\$/);
});
