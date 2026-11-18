import { describe, it, expect, vi, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
const external = vi.hoisted(() => ({ post: vi.fn(), catalogue: vi.fn() }));
vi.mock("../lib/easytrade", () => ({ getAllProducts: external.catalogue, postOrder: external.post }));
import { submitOrderAction, type CheckoutInput } from "../app/sepet/actions";
import { readJson } from "../lib/storage";
beforeEach(() => {
  external.post.mockReset(); external.catalogue.mockReset();
  vi.stubEnv("IYZICO_API_KEY", ""); vi.stubEnv("IYZICO_SECRET_KEY", ""); vi.stubEnv("IYZICO_BASE_URL", "");
});
function input(): CheckoutInput { return { requestId: randomUUID(), customer_name: "Test Customer", customer_email: "test@example.test", customer_phone: "05555555555", address: "Synthetic test address 123", city: "City", district: "District", postal_code: "34000", notes: "", legalAccepted: true, items: [{ id: 1, qty: 2, price: 0.01, name: "Forged" }] }; }
describe("checkout payment gate", () => {
  it.each(["missing", "sandbox", "mismatch"])("never creates or sends an unpaid fallback order with %s configuration", async mode => {
    if (mode !== "missing") { vi.stubEnv("IYZICO_API_KEY", mode === "sandbox" ? "sandbox-key" : "live-key"); vi.stubEnv("IYZICO_SECRET_KEY", "secret"); }
    if (mode === "mismatch") vi.stubEnv("IYZICO_BASE_URL", "https://sandbox-api.iyzipay.com");
    const result = await submitOrderAction(input());
    expect(result.error).toContain("ödeme alınamıyor");
    expect(result.ok).not.toBe(true);
    expect(await readJson("orders.json", [])).toEqual([]);
    expect(external.catalogue).not.toHaveBeenCalled(); expect(external.post).not.toHaveBeenCalled();
  });
  it("blocks development before any side effect", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await submitOrderAction(input())).error).toContain("Geliştirme");
    expect(external.catalogue).not.toHaveBeenCalled(); expect(external.post).not.toHaveBeenCalled();
  });
  it("validates item quantities before fetching products", async () => {
    vi.stubEnv("IYZICO_API_KEY", "live-key"); vi.stubEnv("IYZICO_SECRET_KEY", "secret");
    const request = input(); request.items[0].qty = -1;
    expect((await submitOrderAction(request)).error).toBeTruthy();
    expect(external.catalogue).not.toHaveBeenCalled(); expect(external.post).not.toHaveBeenCalled();
  });
});
