import { expect, test } from "@playwright/test";

test("analytics waits for consent and its nonce works with enforced CSP", async ({ page }) => {
  let loads = 0;
  await page.route("https://www.googletagmanager.com/**", async route => {
    loads++;
    await route.fulfill({ contentType: "application/javascript", body: "document.documentElement.dataset.analyticsTest = 'loaded';" });
  });
  await page.goto("/rehber/filtre-rehberi");
  await expect(page.getByRole("button", { name: "Analitiğe izin ver", exact: true })).toBeVisible();
  expect(loads).toBe(0);
  await page.getByRole("button", { name: "Analitiğe izin ver", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-analytics-test", "loaded");
  expect(loads).toBe(1);
  await page.getByRole("button", { name: "Çerez tercihleri", exact: true }).click();
  await page.getByRole("button", { name: "Yalnızca gerekli", exact: true }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-analytics-test", "loaded");
  await expect(page.locator("#gri-google-tag")).toHaveCount(0);
});
