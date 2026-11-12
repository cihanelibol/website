import { describe, it, expect, vi, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
const external = vi.hoisted(() => ({ post: vi.fn(), catalogue: vi.fn() }));
vi.mock("../lib/easytrade", () => ({ getAllProducts: external.catalogue, postOrder: external.post }));
import { submitOrderAction, type CheckoutInput } from "../app/sepet/actions";
import { readJson } from "../lib/storage";
beforeEach(() => {
  external.post.mockReset().mockResolvedValue({ reference: "ET-synthetic-1", total: 24.68, currency: "TRY" });
  external.catalogue.mockReset().mockResolvedValue([{ id: 1, name: "Canonical", price_with_tax: 12.34, stock_quantity: 20, currency: { value: "TRY" }, has_variations: false }]);
});
function input(): CheckoutInput { return { requestId: randomUUID(), customer_name: "Test Customer", customer_email: "test@example.test", customer_phone: "05555555555", address: "Synthetic test address 123", city: "City", district: "District", postal_code: "34000", notes: "", legalAccepted: true, items: [{ id: 1, qty: 2, price: 0.01, name: "Forged" }] }; }
describe("checkout orchestration", () => {
  it("blocks real order submission from development before any side effect", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await submitOrderAction(input())).error).toContain("Geliştirme");
    expect(external.catalogue).not.toHaveBeenCalled(); expect(external.post).not.toHaveBeenCalled();
    expect(await readJson("orders.json", [])).toEqual([]);
  });
  it("persists before sending, uses server prices and sends only once on retry", async () => {
    external.post.mockImplementation(async () => { expect(await readJson("orders.json", [])).toHaveLength(1); return { reference: "ET-synthetic-1", total: 24.68, currency: "TRY" }; });
    const request = input(); const first = await submitOrderAction(request); const retry = await submitOrderAction(request);
    expect(first.ok).toBe(true); expect(retry.orderId).toBe(first.orderId); expect(external.post).toHaveBeenCalledTimes(1);
    expect(external.post.mock.calls[0][0].total_amount).toBe(24.68); expect(external.post.mock.calls[0][0].items[0].unit_price).toBe(12.34);
  });
  it("never resends an ambiguous timeout", async () => {
    external.post.mockRejectedValue(new Error("Timed out")); const request = input();
    expect((await submitOrderAction(request)).error).toBeTruthy(); expect((await submitOrderAction(request)).error).toBeTruthy();
    expect(external.post).toHaveBeenCalledTimes(1);
    expect((await readJson<{ submission: string }[]>("orders.json", []))[0].submission).toBe("unknown");
  });
  it("does not call the catalogue on invalid quantities", async () => {
    const request = input(); request.items[0].qty = -1;
    expect((await submitOrderAction(request)).error).toBeTruthy(); expect(external.catalogue).not.toHaveBeenCalled(); expect(external.post).not.toHaveBeenCalled();
  });
  it("does not duplicate a successful order when notification fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "synthetic-test-key"); const request = input();
    expect((await submitOrderAction(request)).ok).toBe(true); expect((await submitOrderAction(request)).ok).toBe(true);
    expect(external.post).toHaveBeenCalledTimes(1);
  });
});
