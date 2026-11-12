import { test, expect } from "@playwright/test";
test("production security headers and per-request nonce", async ({ request }) => {
  const a = await request.get("/giris"); const b = await request.get("/giris");
  expect(a.status()).toBe(200);
  expect(a.headers()["x-content-type-options"]).toBe("nosniff");
  expect(a.headers()["x-frame-options"]).toBe("DENY");
  expect(a.headers()["referrer-policy"]).toBe("no-referrer");
  expect(a.headers()["strict-transport-security"]).toContain("max-age=");
  const csp = a.headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'"); expect(csp).toContain("'nonce-");
  expect(csp).not.toBe(b.headers()["content-security-policy"]);
  expect(a.headers()["x-powered-by"]).toBeUndefined();
  expect(await a.text()).not.toMatch(/passwordHash|googleSub|SESSION_SECRET/);
});
for (const path of ["/admin", "/admin/uyeler", "/admin/denetim", "/admin/yorumlar", "/admin/islemler", "/admin/guvenlik", "/hesap", "/hesap/siparisler"]) {
  test(`anonymous HTML and RSC cannot read ${path}`, async ({ request }) => {
    const requests: Record<string, string>[] = [{}, { RSC: "1" }, { RSC: "1", "Next-Router-Prefetch": "1", "Next-Router-State-Tree": encodeURIComponent(JSON.stringify(["", { children: ["admin", { children: ["__PAGE__", {}] }] }])) }];
    for (const headers of requests) {
      let response = await request.get(path, { headers, maxRedirects: 0 });
      // Next canonicalizes the RSC cache key before rendering the authorization boundary.
      const canonical = response.headers()["location"];
      if (canonical?.startsWith(`${path}?_rsc`)) response = await request.get(canonical, { headers, maxRedirects: 0 });
      expect([200, 307]).toContain(response.status());
      const body = await response.text();
      if (!headers["Next-Router-Prefetch"]) expect(response.headers()["location"] || body).toMatch(/giris|hesap\/guvenlik|NEXT_REDIRECT/);
      else expect(body.length).toBeLessThan(3000); // Prefetch may return only a route skeleton.
      expect(body).not.toMatch(/passwordHash|customerName|googleSub|recovery"/);
      expect(response.headers()["cache-control"]).toContain("no-store");
    }
  });
}
test("activity rejects foreign origins and skips anonymous storage", async ({ request }) => {
  expect((await request.post("/api/etkinlik", { headers: { Origin: "https://attacker.invalid" }, data: {} })).status()).toBe(403);
  const response = await request.post("/api/etkinlik", { headers: { Origin: "https://test.example" }, data: {} });
  expect(response.status()).toBe(200); expect(await response.json()).toEqual({ ok: true });
});
test("notification worker rejects anonymous and forged credentials", async ({ request }) => {
  expect((await request.post("/api/internal/notifications")).status()).toBe(401);
  expect((await request.post("/api/internal/notifications", { headers: { Authorization: "Bearer forged" } })).status()).toBe(401);
  expect((await request.get("/api/internal/notifications")).status()).toBe(405);
});
test("missing external services fail closed", async ({ request }) => {
  expect((await request.get("/api/arama?q=test")).status()).toBe(503);
  const response = await request.get("/api/auth/google", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toContain("/giris");
});
