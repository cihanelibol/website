import { describe, it, expect, vi } from "vitest";
import { cardPaymentAvailable } from "../lib/payments";

describe("card payment availability", () => {
  it("stays off without keys", () => {
    expect(cardPaymentAvailable(true)).toBe(false);
  });
  it("limits sandbox to admins so test cards cannot create paid customer orders", () => {
    vi.stubEnv("IYZICO_API_KEY", "k"); vi.stubEnv("IYZICO_SECRET_KEY", "s");
    expect(cardPaymentAvailable(false)).toBe(false);
    expect(cardPaymentAvailable(true)).toBe(true);
  });
  it("opens to everyone on the live endpoint", () => {
    vi.stubEnv("IYZICO_API_KEY", "k"); vi.stubEnv("IYZICO_SECRET_KEY", "s"); vi.stubEnv("IYZICO_BASE_URL", "https://api.iyzipay.com");
    expect(cardPaymentAvailable(false)).toBe(true);
  });
});
