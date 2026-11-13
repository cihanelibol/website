import { expect, test } from "@playwright/test";

for (const slug of ["filtre-rehberi", "isitici-kullanimi"]) {
  test(`${slug}: visible sources agree with Article schema and mobile links are usable`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/rehber/${slug}`);
    await page.getByRole("button", { name: "Yalnızca gerekli", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Yayınlayan: Gri Akvaryum" })).toHaveAttribute("href", "/magaza/eminonu");
    const sourceRegion = page.getByRole("region", { name: "Kaynaklar ve üretici kılavuzları" });
    const citations = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => {
      const all = scripts.flatMap(script => JSON.parse(script.textContent ?? "null"));
      return all.find(schema => schema?.["@type"] === "Article")?.citation as { name: string; url: string }[];
    });
    expect(citations.length).toBeGreaterThan(0);
    for (const source of citations) {
      await expect(sourceRegion.getByRole("link", { name: source.name, exact: true })).toHaveAttribute("href", source.url);
    }
    const categoryLinks = page.getByRole("region", { name: "Bu rehberle ilgili ürün kategorileri" }).getByRole("link");
    expect(await categoryLinks.count()).toBeGreaterThan(0);
    for (const link of await categoryLinks.all()) await expect(link).toHaveAttribute("href", /^\/kategori\/[a-z-]+$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("health symptoms guide does not turn symptoms into a shopping recommendation", async ({ page }) => {
  await page.goto("/rehber/balik-hastaliklari");
  await expect(page.getByRole("region", { name: "Bu rehberle ilgili ürün kategorileri" })).toHaveCount(0);
});
