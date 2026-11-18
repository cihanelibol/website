import { test, expect } from "@playwright/test";

test("receipt status cannot be forged with query parameters in production HTML or RSC", async ({ request }) => {
  const variants: Record<string, string>[] = [{}, { RSC: "1" }];
  for (const headers of variants) {
    const response = await request.get("/sepet/sonuc?durum=tamam&siparis=GA-111111111111111111111111", { headers });
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).not.toContain("Ödemeniz alındı, siparişiniz onaylandı");
    expect(body).not.toContain("Teslimat adresi</h3>");
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["referrer-policy"]).toBe("no-referrer");
  }
});

test("payment worker rejects unauthenticated calls", async ({ request }) => {
  expect((await request.post("/api/internal/payments")).status()).toBe(401);
  expect((await request.get("/api/internal/payments", { headers: { Authorization: "Bearer forged" } })).status()).toBe(401);
});
