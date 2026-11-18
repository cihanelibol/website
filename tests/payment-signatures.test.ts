import { createHmac } from "node:crypto";
import { it, expect, vi, beforeEach } from "vitest";
import { retrieveIyzicoCheckout, initiateIyzicoCheckout } from "../lib/payments";

beforeEach(() => {
  vi.stubEnv("IYZICO_API_KEY", "live-key"); vi.stubEnv("IYZICO_SECRET_KEY", "synthetic-secret"); vi.stubEnv("IYZICO_BASE_URL", "");
});
const sign = (parts: unknown[]) => createHmac("sha256", "synthetic-secret").update(parts.join(":" )).digest("hex");
it("requires the signed checkout result and exact token", async () => {
  const body = { status: "success", paymentStatus: "SUCCESS", paymentId: "P-1", currency: "TRY", basketId: "GA-1", conversationId: "", paidPrice: 100.00, price: 100.00, token: "valid-token-123", fraudStatus: 1, signature: "" };
  body.signature = sign(["SUCCESS", "P-1", "TRY", "GA-1", "", "100", "100", "valid-token-123"]);
  vi.stubGlobal("fetch", vi.fn(async () => Response.json(body)));
  expect((await retrieveIyzicoCheckout(body.token)).paymentStatus).toBe("SUCCESS");
  body.paidPrice = 1;
  await expect(retrieveIyzicoCheckout(body.token)).rejects.toThrow("imzası");
  await expect(retrieveIyzicoCheckout("other-token-123")).rejects.toThrow("token");
  body.signature = "";
  await expect(retrieveIyzicoCheckout(body.token)).rejects.toThrow("imzası");
});
it("rejects non-200 responses and accepts only signed initialization for this order", async () => {
  const order = { orderId: "GA-1", userId: null, total: 10, shippingFee: 0, customerName: "Test Buyer", email: "buyer@example.test", phone: "05555555555", address: "Test address", city: "Istanbul", postalCode: "34000", ip: "127.0.0.1", items: [{ id: 1, name: "Product", price: 10, qty: 1 }] };
  const body = { status: "success", conversationId: order.orderId, token: "token-12345678", paymentPageUrl: "https://cpp.iyzipay.com/?token=test", tokenExpireTime: 120, signature: sign([order.orderId, "token-12345678"]) };
  const fetch = vi.fn(async (_url: string, _init?: RequestInit) => { void _url; void _init; return Response.json(body); }); vi.stubGlobal("fetch", fetch);
  expect(await initiateIyzicoCheckout(order)).toMatchObject({ token: body.token, expiresIn: 120 });
  expect(JSON.parse(fetch.mock.calls[0]?.[1]?.body as string).enabledInstallments).toEqual([1]);
  body.conversationId = "different";
  await expect(initiateIyzicoCheckout(order)).rejects.toThrow("kimliği");
  vi.stubGlobal("fetch", vi.fn(async () => Response.json(body, { status: 503 })));
  await expect(retrieveIyzicoCheckout("token-12345678")).rejects.toThrow("HTTP 503");
});
