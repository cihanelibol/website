import { test, expect } from "@playwright/test";
test("enforced CSP permits login, registration and guide hydration", async ({ page }) => {
  const violations: string[] = [], errors: string[] = [];
  await page.exposeFunction("recordCsp", (directive: string) => violations.push(directive));
  await page.addInitScript(() => document.addEventListener("securitypolicyviolation", event => {
    (window as unknown as { recordCsp: (value: string) => void }).recordCsp(event.effectiveDirective);
  }));
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/giris", "/kayit", "/rehber"]) {
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.headers()["content-security-policy"]).toContain("strict-dynamic");
    expect(await page.locator("script[nonce]").count()).toBeGreaterThan(0);
  }
  expect(violations).toEqual([]); expect(errors).toEqual([]);
});
