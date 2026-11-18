import { describe, it, expect, vi, afterEach } from "vitest";
import { cardPaymentAvailable, paymentConfigError, paymentIsSandbox } from "../lib/payments";

afterEach(() => { vi.unstubAllEnvs(); });

function keys(apiKey: string, secret = "s") {
  vi.stubEnv("IYZICO_API_KEY", apiKey); vi.stubEnv("IYZICO_SECRET_KEY", secret); vi.stubEnv("IYZICO_BASE_URL", "");
}

describe("card payment availability", () => {
  it("stays off without keys", () => {
    vi.stubEnv("IYZICO_API_KEY", ""); vi.stubEnv("IYZICO_SECRET_KEY", "");
    expect(cardPaymentAvailable(true)).toBe(false);
    expect(paymentConfigError()).toBeNull();
  });
  it("limits sandbox keys to admins so test cards cannot create paid customer orders", () => {
    keys("sandbox-k");
    expect(paymentIsSandbox()).toBe(true);
    expect(cardPaymentAvailable(false)).toBe(false);
    expect(cardPaymentAvailable(true)).toBe(true);
  });
  it("treats live keys as live even without IYZICO_BASE_URL (no more sandbox 1001)", () => {
    keys("live-key");
    expect(paymentIsSandbox()).toBe(false);
    expect(cardPaymentAvailable(false)).toBe(true);
  });
  it("opens to everyone on the explicit live endpoint", () => {
    keys("k"); vi.stubEnv("IYZICO_BASE_URL", "https://api.iyzipay.com/");
    expect(cardPaymentAvailable(false)).toBe(true);
  });
  it("trims whitespace pasted around keys", () => {
    keys("  sandbox-k\n", " s \n");
    expect(paymentIsSandbox()).toBe(true);
    expect(cardPaymentAvailable(true)).toBe(true);
  });
  it("closes payment and explains when key and endpoint disagree", () => {
    keys("live-key"); vi.stubEnv("IYZICO_BASE_URL", "https://sandbox-api.iyzipay.com");
    expect(cardPaymentAvailable(true)).toBe(false);
    expect(paymentConfigError()).toMatch(/uyuşmuyor/);
    keys("sandbox-k"); vi.stubEnv("IYZICO_BASE_URL", "https://api.iyzipay.com");
    expect(cardPaymentAvailable(true)).toBe(false);
  });
  it("rejects unknown endpoints", () => {
    keys("k"); vi.stubEnv("IYZICO_BASE_URL", "https://evil.example.com");
    expect(cardPaymentAvailable(true)).toBe(false);
    expect(paymentConfigError()).toMatch(/geçersiz/);
  });
});
