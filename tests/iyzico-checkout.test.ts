import { describe, it, expect, vi, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
const external = vi.hoisted(() => ({ post: vi.fn(), catalogue: vi.fn(), init: vi.fn(), retrieve: vi.fn() }));
vi.mock("../lib/easytrade", () => ({ getAllProducts: external.catalogue, postOrder: external.post }));
vi.mock("../lib/payments", () => ({ cardPaymentAvailable: () => true, paymentIsSandbox: () => false, PaymentStartRejected: class extends Error {}, initiateIyzicoCheckout: external.init, retrieveIyzicoCheckout: external.retrieve }));
import { submitOrderAction, checkOrderPaymentAction, retryOrderPaymentAction, type CheckoutInput } from "../app/sepet/actions";
import { POST } from "../app/api/odeme/iyzico/route";
import { readJson, updateJson } from "../lib/storage";
import { getCustomerOrder } from "../lib/orders";
import { orderView } from "../lib/order-presentation";
import { cookieJar } from "./setup";
import type { OrderRecord } from "../lib/order-types";
import { POST as paymentWorker } from "../app/api/internal/payments/route";
import { PaymentStartRejected } from "../lib/payments";

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
    expect(response.headers.get("location")).toContain(`siparis=${order.id}`);
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
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("kontrol");
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-3", paidPrice: 224.68, currency: "TRY", basketId: "GA-OTHER" });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("kontrol");
    expect(external.post).not.toHaveBeenCalled();
  });

  it("ignores unknown tokens and failed payments", async () => {
    await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "FAILURE", basketId: "x" });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("basarisiz");
    expect((await callback("unknown-token-xyz")).headers.get("location")).toBe("https://test.example/sepet/sonuc");
    expect(external.post).not.toHaveBeenCalled();
  });

  it("re-opens the payment page when the same checkout is retried before paying", async () => {
    const request = input();
    await submitOrderAction(request);
    const again = await submitOrderAction(request);
    expect(again.paymentPageUrl).toBeTruthy();
    expect(external.init).toHaveBeenCalledTimes(1);
    expect(await readJson<Stored[]>("orders.json", [])).toHaveLength(1);
  });

  it("uses canonical prices and shipping and never forwards before a verified capture", async () => {
    const request = input(); request.items[0].price = 0.01; request.items[0].name = "Forged";
    await submitOrderAction(request);
    expect(external.init.mock.calls[0][0]).toMatchObject({ total: 224.68, shippingFee: 200, items: [{ id: 1, name: "Canonical", price: 12.34, qty: 2 }] });
    expect(external.post).not.toHaveBeenCalled();
  });

  it("prices free shipping in the payment session", async () => {
    external.catalogue.mockResolvedValue([{ id: 1, name: "Canonical", price_with_tax: 1300, stock_quantity: 20, currency: { value: "TRY" }, has_variations: false }]);
    expect((await submitOrderAction(input())).ok).toBe(true);
    expect(external.init.mock.calls[0][0]).toMatchObject({ total: 2600, shippingFee: 0 });
  });

  it("claims a single payment session for concurrent submissions", async () => {
    const request = input();
    await Promise.all([submitOrderAction(request), submitOrderAction(request)]);
    expect(external.init).toHaveBeenCalledTimes(1);
    expect(await readJson("orders.json", [])).toHaveLength(1);
  });

  it("keeps an uncertain initialization closed and exposes a secure status locator", async () => {
    external.init.mockRejectedValue(new Error("timeout"));
    const request = input(); const first = await submitOrderAction(request);
    expect(first.resultUrl).toContain(first.orderId);
    expect((await submitOrderAction(request)).error).toBeTruthy();
    expect(external.init).toHaveBeenCalledTimes(1);
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("kontrol");
    expect(external.post).not.toHaveBeenCalled();
  });
  it("allows another initialization after an explicit provider rejection", async () => {
    external.init.mockRejectedValueOnce(new PaymentStartRejected("Rejected"));
    const first = await submitOrderAction(input());
    expect(first.error).toBe("Rejected");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("basarisiz");
    expect((await retryOrderPaymentAction(first.orderId!)).paymentPageUrl).toBeTruthy();
    expect(external.init).toHaveBeenCalledTimes(2);
  });

  it("shows captured payment as processing when external submission times out and never resends", async () => {
    const { orderId } = await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    external.post.mockRejectedValue(new Error("timeout"));
    await callback("tok-1234567890"); await callback("tok-1234567890");
    const order = (await readJson<OrderRecord[]>("orders.json", []))[0];
    expect(order).toMatchObject({ paymentStatus: "odendi", submission: "unknown" });
    expect(orderView(order).title).toBe("Ödemeniz alındı, siparişiniz işleniyor");
    expect(order).not.toHaveProperty("notifications");
    expect(external.post).toHaveBeenCalledTimes(1);
  });

  it("rejects external receipts with an unexpected total", async () => {
    const { orderId } = await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    external.post.mockResolvedValue({ reference: "ET-1", total: 224.68, currency: "TRY" });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0]).toMatchObject({ paymentStatus: "odendi", submission: "unknown" });
  });

  it("allows an authorized customer to recover a missed callback without another charge", async () => {
    const { orderId } = await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    expect((await checkOrderPaymentAction(orderId!)).ok).toBe(true);
    expect((await getCustomerOrder(orderId!))?.paymentStatus).toBe("odendi");
    expect(external.init).toHaveBeenCalledTimes(1); expect(external.post).toHaveBeenCalledTimes(1);
    cookieJar.clear();
    expect((await checkOrderPaymentAction(orderId!)).error).toBeTruthy();
    expect((await retryOrderPaymentAction(orderId!)).error).toBeTruthy();
  });

  it("retains older payment tokens and ignores stale failures after a new attempt", async () => {
    const { orderId } = await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "FAILURE" });
    await callback("tok-1234567890");
    external.init.mockResolvedValue({ token: "tok-2222222222", paymentPageUrl: "https://sandbox-cpp.iyzipay.com/?token=second" });
    expect((await retryOrderPaymentAction(orderId!)).paymentPageUrl).toContain("second");
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("beklemede");
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("odendi");
  });

  it.each([0, -1, undefined])("does not fulfil fraud status %s", async fraudStatus => {
    const { orderId } = await submitOrderAction(input());
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0].paymentStatus).toBe("kontrol");
    expect(external.post).not.toHaveBeenCalled();
    expect((await retryOrderPaymentAction(orderId!)).error).toBeTruthy();
    expect(external.init).toHaveBeenCalledTimes(1);
  });

  it("records late payment on a cancelled order without fulfilment or confirmation", async () => {
    const { orderId } = await submitOrderAction(input());
    await updateJson<OrderRecord[], void>("orders.json", [], orders => { orders[0].status = "iptal"; return { value: orders, result: undefined }; });
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    await callback("tok-1234567890");
    expect((await readJson<Stored[]>("orders.json", []))[0]).toMatchObject({ status: "iptal", paymentStatus: "odendi" });
    expect(external.post).not.toHaveBeenCalled();
  });

  it("never sends sandbox captures to fulfilment", async () => {
    const { orderId } = await submitOrderAction(input());
    await updateJson<OrderRecord[], void>("orders.json", [], orders => { orders[0].paymentSandbox = true; return { value: orders, result: undefined }; });
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    await callback("tok-1234567890");
    expect(external.post).not.toHaveBeenCalled();
    const [order] = await readJson<OrderRecord[]>("orders.json", []);
    expect(order).not.toHaveProperty("notifications");
    expect(orderView(order).title).toBe("Test ödemesi");
  });

  it("authenticates the worker and recovers an unresolved capture", async () => {
    vi.stubEnv("CRON_SECRET", "s".repeat(40));
    expect((await paymentWorker(new Request("https://test.example/api/internal/payments", { method: "POST" }))).status).toBe(401);
    const { orderId } = await submitOrderAction(input());
    const request = () => new Request("https://test.example/api/internal/payments", { method: "POST", headers: { Authorization: `Bearer ${"s".repeat(40)}` } });
    await paymentWorker(request());
    expect(external.retrieve).not.toHaveBeenCalled(); // Customer still has a valid payment form.
    await updateJson<OrderRecord[], void>("orders.json", [], orders => { orders[0].paymentStatus = "kontrol"; return { value: orders, result: undefined }; });
    external.retrieve.mockResolvedValue({ status: "success", paymentStatus: "SUCCESS", fraudStatus: 1, paymentId: "P-1", paidPrice: 224.68, currency: "TRY", basketId: orderId });
    expect((await paymentWorker(request())).status).toBe(200);
    expect((await getCustomerOrder(orderId!))?.paymentStatus).toBe("odendi");
    expect(external.post).toHaveBeenCalledTimes(1);
  });
});
