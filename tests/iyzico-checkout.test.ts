import { describe, it, expect, vi, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
const external = vi.hoisted(() => ({ post: vi.fn(), catalogue: vi.fn(), init: vi.fn(), retrieve: vi.fn() }));
vi.mock("../lib/easytrade", () => ({ getAllProducts: external.catalogue, postOrder: external.post }));
vi.mock("../lib/payments", () => ({ cardPaymentAvailable: () => true, initiateIyzicoCheckout: external.init, retrieveIyzicoCheckout: external.retrieve }));
import { submitOrderAction, type CheckoutInput } from "../app/sepet/actions";
import { POST } from "../app/api/odeme/iyzico/route";
import { readJson } from "../lib/storage";

type Stored = { id: string; total: number; paymentStatus: string; paymentMethod: string; submission?: string; status: string };
beforeEach(() => {
  external.post.mockReset().mockResolvedValue({ reference: "ET-1", total: 24.68, currency: "TRY" });
  external.catalogue.mockReset().mockResolvedValue([{ id: 1, name: "Canonical", price_with_tax: 12.34, stock_quantity: 20, currency: { value: "TRY" }, has_variations: false }]);
  external.init.mockReset().mockResolvedValue({ token: "tok-1234567890", paymentPageUrl: "https://sandbox-cpp.iyzipay.com/?token=tok" });
  external.retrieve.mockReset();
});
const input = (): CheckoutInput => ({ requestId: randomUUID(), customer_name: "Test Customer", customer_email: "test@example.test", customer_phone: "05555555555", address: "Synthetic test address 123", city: "City", district: "District", postal_code: "34000", notes: "", legalAccepted: true, items: [{ id: 1, qty: 2 }] });
const callback = (token: string) => { const body = new FormData(); body.set("token", token); return POST(new Request("https://test.example/api/odeme/iyzico", { method: "POST", body })); };

describe("iyzico checkout", () => {
  it("does not send to EasyTrade before payment, then forwards exactly once after a verified payment", async () => {
    const result = await submitOrderAction(input());
    expect(result.paymentPageUrl).toContain("iyzipay.com");
    expect(external.post).not.toHaveBeenCalled();
    expect(external.init.mock.calls[0][0]).toMatchObject({ total: 224.68, shippingFee: 200 });
    const [order] = await readJson<Stored[]>("orders.json", []);
    expect(order).toMatchObject({ paymentMethod: "iyzico", paymentStatus: "beklemede" });
    expect(order.submission).toBeUndefined();

    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: order.id });
    const response = await callback("tok-1234567890");
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain(`durum=tamam&siparis=${order.id}`);
    expect(external.post).toHaveBeenCalledTimes(1);
    expect(external.post.mock.calls[0][0].notes).toContain(`Mağaza sipariş kimliği: ${order.id}`);
    expect((await readJson<Stored[]>("orders.json", []))[0]).toMatchObject({ paymentStatus: "odendi", submission: "sent" });

    await callback("tok-1234567890");
    expect(external.post).toHaveBeenCalledTimes(1);
  });

  it("never marks paid when the verified amount or basket differs", async () => {
    await submitOrderAction(input());
    const [order] = await readJson<Stored[]>("orders.json", []);
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-2", paidPrice: 1, currency: "TRY", basketId: order.id });
    expect((await callback("tok-1234567890")).headers.get("location")).toContain("durum=kontrol");
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-3", paidPrice: 224.68, currency: "TRY", basketId: "GA-OTHER" });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("beklemede");
    expect(external.post).not.toHaveBeenCalled();
  });

  it("ignores unknown tokens and failed payments", async () => {
    await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "FAILURE", basketId: "x" });
    expect((await callback("tok-1234567890")).headers.get("location")).toContain("durum=basarisiz");
    expect((await callback("unknown-token-xyz")).headers.get("location")).toContain("durum=hata");
    expect(external.post).not.toHaveBeenCalled();
  });

  it("re-opens the payment page when the same checkout is retried before paying", async () => {
    const request = input();
    await submitOrderAction(request);
    const again = await submitOrderAction(request);
    expect(again.paymentPageUrl).toBeTruthy();
    expect(await readJson<Stored[]>("orders.json", [])).toHaveLength(1);
  });
});
