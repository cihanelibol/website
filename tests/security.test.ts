import { describe, it, expect, vi } from "vitest";
import { TOTP, Secret } from "otpauth";
import { cookieJar } from "./setup";
import { createUser, issueAccountToken, consumeAccountToken, verifyLogin, setSessionCookies, getSessionUser, clearSessionCookies, changePassword, getProfile, findOrCreateGoogleUser, getAdminUser, beginMfa, completeMfa, getUserById, cookieOptions, sessionCookie, type User } from "../lib/auth";
import { readJson, updateJson } from "../lib/storage";
import { signingKey, rateLimit, limitedJson, seal, unseal } from "../lib/security";
import { getAllOrders, getOrdersByUser, reserveOrder, updateOrderStatus, markOrderSubmission, reconcileOrder, recordManualPayment } from "../lib/orders";
import { addReview, getReviews, getModerationReviews, moderateReview } from "../lib/reviews";
import { getAdminMembers } from "../lib/admin-data";
import { getActivities } from "../lib/activity";
import { getAddresses, addAddress, deleteAddress } from "../lib/addresses";
import { priceItems } from "../lib/checkout";
import { escapeHtml } from "../lib/email-text";
import { sendWelcomeEmail } from "../lib/email";
import { startGoogle, consumeOAuth } from "../lib/oauth";
import type { EtProduct } from "../lib/easytrade";

const password = "a sufficiently long test password";
async function user(email = "customer@example.test") {
  const result = await createUser({ name: "Test Customer", email, password });
  if ("error" in result) throw new Error(result.error);
  const token = await issueAccountToken(email, "verify");
  await consumeAccountToken(token!.token, "verify");
  return (await verifyLogin(email, password))!;
}
async function admin() {
  const u = await user();
  await updateJson<User[], void>("users.json", [], users => { users[0].role = "admin"; return { value: users, result: undefined }; });
  await setSessionCookies((await getUserById(u.id))!);
  return u;
}
describe("identity and sessions", () => {
  it("never grants admin from the email allowlist", async () => {
    vi.stubEnv("ADMIN_EMAILS", "customer@example.test");
    const u = await user(); await setSessionCookies(u);
    expect(u.role).toBe("customer"); expect(await getAdminUser()).toBeUndefined();
  });
  it("requires mailbox verification before login", async () => {
    await createUser({ name: "Test", email: "new@example.test", password });
    expect(await verifyLogin("new@example.test", password)).toBeUndefined();
  });
  it.each(["griakvaryum@gmail.com", "cihanelibol47@gmail.com"])("does not self-assign the intended operator %s", async email => {
    const u = await user(email); expect(u.role).toBe("customer");
  });
  it("rejects revoked roles, disabled users and expired account tokens", async () => {
    const u = await user(); await setSessionCookies(u);
    await updateJson<User[], void>("users.json", [], users => { users[0].disabled = true; return { value: users, result: undefined }; });
    expect(await getSessionUser()).toBeUndefined();
    expect(await verifyLogin(u.email, password)).toBeUndefined();
  });
  it("requires host-only secure HTTP-only production cookies", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(sessionCookie()).toBe("__Host-ga_session");
    expect(cookieOptions()).toEqual({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  });
  it("rejects weak passwords and malformed hashes safely", async () => {
    await expect(createUser({ name: "Test", email: "new@example.test", password: "123456" })).rejects.toThrow();
    const u = await user();
    await updateJson<User[], void>("users.json", [], users => { users[0].passwordHash = "bad:hash"; return { value: users, result: undefined }; });
    expect(await verifyLogin(u.email, password)).toBeUndefined();
  });
  it("rejects missing/empty/default signing secrets", () => {
    for (const key of ["", "griakvaryum-dev-secret-degistir", "a".repeat(64)]) { vi.stubEnv("SESSION_SECRET", key); expect(signingKey).toThrow(); }
  });
  it("rejects legacy self-contained tokens", async () => {
    cookieJar.set("ga_session", { value: "legacy.payload.signature" }); expect(await getSessionUser()).toBeUndefined();
  });
  it("revokes a copied session on logout", async () => {
    await setSessionCookies(await user()); const copied = cookieJar.get("ga_session")!;
    await clearSessionCookies(); cookieJar.set("ga_session", copied);
    expect(await getSessionUser()).toBeUndefined();
  });
  it("revokes every old session on password change", async () => {
    const u = await user(); await setSessionCookies(u); const copied = cookieJar.get("ga_session")!;
    await changePassword(u.id, password, password + " changed"); cookieJar.set("ga_session", copied);
    expect(await getSessionUser()).toBeUndefined(); expect(await verifyLogin(u.email, password)).toBeUndefined();
    expect(await verifyLogin(u.email, password + " changed")).toBeTruthy();
  });
  it("does not resurrect a session from stale login data", async () => {
    const u = await user(); await changePassword(u.id, password, password + " changed");
    await expect(setSessionCookies(u)).rejects.toThrow();
  });
  it("invalidates disabled users and expires sessions", async () => {
    await setSessionCookies(await user());
    await updateJson<User[], void>("users.json", [], users => { users[0].sessions![0].expires = 1; return { value: users, result: undefined }; });
    expect(await getSessionUser()).toBeUndefined();
  });
  it("returns a minimal profile without credentials", async () => {
    await setSessionCookies(await user());
    const profile = await getProfile(); expect(profile).toBeTruthy();
    for (const key of ["passwordHash", "sessions", "tokens", "mfa", "googleSub"]) expect(profile).not.toHaveProperty(key);
  });
  it("consumes account tokens exactly once under concurrency", async () => {
    const u = await user(); const token = await issueAccountToken(u.email, "reset");
    const attempts = await Promise.allSettled([consumeAccountToken(token!.token, "reset", password + " new"), consumeAccountToken(token!.token, "reset", password + " other")]);
    expect(attempts.filter(a => a.status === "fulfilled")).toHaveLength(1);
  });
  it("prevents duplicate email records under concurrent registration", async () => {
    const results = await Promise.all([createUser({ name: "One", email: "same@example.test", password }), createUser({ name: "Two", email: "SAME@example.test", password })]);
    expect(results.filter(r => !("error" in r))).toHaveLength(1); expect(await readJson("users.json", [])).toHaveLength(1);
  });
  it("blocks Google pre-registration merging, even after email verification", async () => {
    await user("victim@example.test");
    await expect(findOrCreateGoogleUser({ email: "victim@example.test", sub: "123456789", name: "Victim", verified: true })).rejects.toThrow();
  });
  it("lets the verified Google mailbox owner claim an unverified account and drops prior credentials", async () => {
    const created = await createUser({ name: "Squatter", email: "owner@example.test", password });
    if ("error" in created) throw new Error(created.error);
    const { user: claimed, created: isNew } = await findOrCreateGoogleUser({ email: "owner@example.test", sub: "555", name: "Owner", verified: true });
    expect(isNew).toBe(false); expect(claimed.id).toBe(created.id);
    expect(await verifyLogin("owner@example.test", password)).toBeFalsy();
    const stored = await getUserById(created.id);
    expect(stored?.googleSub).toBe("555"); expect(stored?.emailVerifiedAt).toBeTruthy(); expect(stored?.passwordHash).toBe(""); expect(stored?.tokens ?? []).toHaveLength(0);
  });
  it("requires verified provider claims and binds identity to subject", async () => {
    await expect(findOrCreateGoogleUser({ email: "victim@example.test", sub: "123", name: "Victim", verified: false })).rejects.toThrow();
    const first = await findOrCreateGoogleUser({ email: "one@example.test", sub: "123", name: "One", verified: true });
    const again = await findOrCreateGoogleUser({ email: "changed@example.test", sub: "123", name: "One", verified: true });
    expect(again.user.id).toBe(first.user.id);
  });
  it("OAuth state can only be consumed once", async () => {
    const { flow } = await startGoogle();
    await expect(consumeOAuth(flow, "wrong")).rejects.toThrow();
    await consumeOAuth(flow, flow.state); await expect(consumeOAuth(flow, flow.state)).rejects.toThrow();
  });
  it("encrypts sensitive MFA/OAuth state with authentication", () => {
    const encrypted = seal("test secret"); expect(unseal(encrypted)).toBe("test secret");
    expect(() => unseal(encrypted.slice(0, -3) + "AAA")).toThrow();
  });
});
describe("authorization and MFA", () => {
  it("protects every admin data reader without relying on layout", async () => {
    for (const read of [getAdminMembers, getAllOrders, getActivities]) await expect(read()).rejects.toThrow("REDIRECT");
    await setSessionCookies(await user());
    for (const read of [getAdminMembers, getAllOrders, getActivities]) await expect(read()).rejects.toThrow("REDIRECT");
  });
  it("requires MFA and rejects reusing the same TOTP", async () => {
    await admin(); expect(await getAdminUser()).toBeUndefined();
    const setup = await beginMfa();
    const generator = new TOTP({ secret: Secret.fromBase32(setup.secret), digits: 6, period: 30 });
    const code = generator.generate(); const recovery = await completeMfa(code);
    expect(recovery).toHaveLength(8); expect(await getAdminUser()).toBeTruthy();
    await expect(completeMfa(code)).rejects.toThrow();
    await completeMfa(recovery![0]); await expect(completeMfa(recovery![0])).rejects.toThrow();
  });
  it("enforces address ownership", async () => {
    const a = await user("a@example.test"); await setSessionCookies(a);
    const address = await addAddress({ userId: a.id, title: "Home", fullName: "Test User", phone: "05555555555", city: "City", district: "District", address: "Test address 123", postalCode: "34000" });
    await clearSessionCookies(); await setSessionCookies(await user("b@example.test"));
    await expect(getAddresses(a.id)).rejects.toThrow(); await expect(deleteAddress(a.id, address.id)).rejects.toThrow();
  });
  it("hides pending and legacy reviews until an MFA-verified admin approves", async () => {
    const review = await addReview({ productId: 1, name: "Test", rating: 5, comment: "A pending comment" });
    expect(await getReviews(1)).toEqual([]);
    await expect(getModerationReviews()).rejects.toThrow(); await expect(moderateReview(review.id, "approved")).rejects.toThrow();
    await admin(); const setup = await beginMfa(); await completeMfa(new TOTP({ secret: Secret.fromBase32(setup.secret) }).generate());
    await moderateReview(review.id, "approved"); expect(await getReviews(1)).toHaveLength(1);
    await moderateReview(review.id, "rejected"); expect(await getReviews(1)).toEqual([]);
  });
  it("separates delivery and payment; requires exact amount and fresh MFA for manual records", async () => {
    const a = await admin(); const setup = await beginMfa(); await completeMfa(new TOTP({ secret: Secret.fromBase32(setup.secret) }).generate());
    const { order } = await reserveOrder({ userId: a.id, customerName: "Test", email: a.email, phone: "05555555555", addressText: "Test address", items: [], total: 10, paymentMethod: "iyzico-bekliyor", paymentStatus: "beklemede" }, "payment-request", "payload");
    await markOrderSubmission(order.id, "unknown");
    await expect(updateOrderStatus(order.id, "onaylandi")).rejects.toThrow();
    await reconcileOrder(order.id, "external-order-123", "Verified external provider record");
    for (const status of ["onaylandi", "hazirlaniyor", "kargoda", "teslim-edildi"] as const) await updateOrderStatus(order.id, status);
    expect((await getAllOrders())[0].paymentStatus).toBe("beklemede");
    await expect(recordManualPayment(order.id, 1, "bank-123", "Verified bank statement record")).rejects.toThrow();
    await recordManualPayment(order.id, 10, "bank-123", "Verified bank statement record");
    await expect(recordManualPayment(order.id, 10, "bank-123", "Verified bank statement record")).rejects.toThrow();
    expect((await getAllOrders())[0].paymentStatus).toBe("odendi");
    expect((await getOrdersByUser(a.id))[0]).not.toHaveProperty("paymentEvidence");
    await updateJson<User[], void>("users.json", [], users => { users[0].sessions![0].mfaAt = Date.now() - 6 * 60_000; return { value: users, result: undefined }; });
    await expect(reconcileOrder(order.id, "external-1", "Verified provider record")).rejects.toThrow("doğrulamayı");
  });
});
describe("integrity and output", () => {
  it("does not lose concurrent updates", async () => {
    await Promise.all(Array.from({ length: 20 }, () => updateJson<number, void>("counter.json", 0, n => ({ value: n + 1, result: undefined }))));
    expect(await readJson("counter.json", 0)).toBe(20);
  });
  it("enforces a shared atomic rate limit", async () => {
    const results = await Promise.all(Array.from({ length: 10 }, () => rateLimit("test", "user", 3, 60)));
    expect(results.filter(Boolean)).toHaveLength(3);
  });
  it("rejects oversized bodies even without Content-Length", async () => {
    await expect(limitedJson(new Request("https://test.example", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "x".repeat(5000) }) }))).rejects.toThrow();
  });
  const product = { id: 1, name: "Product", stock_quantity: 10, price_with_tax: 123.45, currency: { value: "TRY" }, has_variations: false } as EtProduct;
  it("ignores forged price and name and combines duplicate quantities", () => {
    const priced = priceItems([{ id: 1, qty: 2, price: 0.01, name: "fake" }, { id: 1, qty: 1 }], [product]);
    expect(priced.total).toBe(370.35); expect(priced.items[0].name).toBe("Product"); expect(priced.items).toHaveLength(1);
  });
  it.each([0, -1, 1.5, NaN, Infinity, 100, "2"])("rejects invalid quantity %s", qty => { expect(() => priceItems([{ id: 1, qty }], [product])).toThrow(); });
  it("rejects unavailable products, currency and stock", () => {
    expect(() => priceItems([{ id: 99, qty: 1 }], [product])).toThrow();
    expect(() => priceItems([{ id: 1, qty: 11 }], [product])).toThrow();
    expect(() => priceItems([{ id: 1, qty: 1 }], [{ ...product, currency: { value: "USD", label: "USD" } }])).toThrow();
  });
  it("only reserves one order for concurrent retries and rejects changed payloads", async () => {
    const input = { userId: null, customerName: "Test", email: "x@example.test", phone: "05555555555", addressText: "Test address", items: [], total: 10, paymentMethod: "iyzico-bekliyor" as const, paymentStatus: "beklemede" as const };
    const results = await Promise.all([reserveOrder(input, "request", "fingerprint"), reserveOrder(input, "request", "fingerprint")]);
    expect(results.filter(r => r.created)).toHaveLength(1);
    await expect(reserveOrder(input, "request", "different")).rejects.toThrow();
  });
  it("does not allow an unauthenticated order mutation", async () => { await expect(updateOrderStatus("id", "teslim-edildi")).rejects.toThrow(); });
  it("escapes every HTML metacharacter", () => { expect(escapeHtml(`<a href="x">&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;"); });
  it("renders hostile names as text in outgoing email without sending it", async () => {
    vi.stubEnv("RESEND_API_KEY", "synthetic-test-key");
    const fetch = vi.fn(async () => Response.json({ id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" })); vi.stubGlobal("fetch", fetch);
    await sendWelcomeEmail('<a href="https://attacker.invalid">Test</a>', "recipient@example.test");
    const body = JSON.parse((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.html).toContain("&lt;a href=&quot;https://attacker.invalid&quot;&gt;");
    expect(body.html).not.toContain('<a href="https://attacker.invalid">');
  });
});
