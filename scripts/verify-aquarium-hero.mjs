/** Local-only UI verification: node scripts/verify-aquarium-hero.mjs [baseURL] */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const origin = process.argv[2] || 'http://localhost:3000';
const evidence = '.gstack/aquarium';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const media = [];
const motion = page => page.getByRole('group', { name: 'Etkileşimli akvaryum' });
const transforms = page => page.locator('[data-fish]:visible').evaluateAll(nodes => nodes.map(n => n.style.transform));
async function open(page, path = '/giris') {
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL(path, origin).href, { waitUntil: 'networkidle' });
  const cookies = page.getByRole('button', { name: 'Yalnızca gerekli', exact: true });
  if (await cookies.isVisible()) await cookies.click();
}
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  page.on('request', request => { if (/\.(mp4|webm)(\?|$)/.test(request.url())) media.push(request.url()); });
  await open(page);
  await page.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'true');
  assert.equal(await page.locator('[data-fish]').count(), 18);
  assert.equal(await page.locator('[data-prop]').count(), 24);
  assert.equal(await page.locator('main video').count(), 0);
  assert.deepEqual(media, []);
  assert.ok(await page.locator('main img').evaluateAll(images => images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0)), 'All photographic assets loaded');
  assert.equal(await page.locator('main img').evaluateAll(images => new Set(images.map(image => image.currentSrc)).size), 12, 'Shared photographic assets for the complete reef');
  const before = await transforms(page);
  await page.waitForTimeout(150);
  assert.notDeepEqual(await transforms(page), before);

  const fish = page.locator('[data-fish="misket"]');
  let box = await fish.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForFunction(() => document.querySelector('[data-fish="misket"]').dataset.state === 'flee');
  await page.mouse.move(1400, 50);
  await page.waitForTimeout(450);
  const escaped = await fish.boundingBox();
  assert.ok(Math.hypot(escaped.x - box.x, escaped.y - box.y) > 15, 'Clicked fish moves away');
  await page.waitForFunction(() => document.querySelector('[data-fish="misket"]').dataset.state === 'cruise');
  console.log('PASS: independent entities, no video download, click escape and recovery');

  const plant = page.locator('[data-prop="plant"]').first();
  box = await plant.boundingBox();
  await page.mouse.move(Math.max(4, box.x + box.width * .65), box.y + box.height * .5);
  await page.waitForTimeout(250);
  assert.notEqual(await plant.evaluate(n => n.style.getPropertyValue('--pointer-sway')), '0.00deg');
  const coral = page.locator('[data-prop="coral"]').first();
  await coral.click({ position: { x: 80, y: 100 } });
  assert.equal(await coral.getAttribute('data-reacting'), 'true');
  console.log('PASS: plant pointer response and prop bubble reaction');

  await page.getByLabel('E-posta', { exact: true }).fill('preview@example.com');
  await page.getByLabel('Parola', { exact: true }).fill('preview-only');
  assert.equal(await motion(page).getAttribute('data-calm'), 'true');
  assert.equal(await page.getByLabel('E-posta', { exact: true }).inputValue(), 'preview@example.com');
  await page.getByText('Hesabınıza erişmek için destek alın', { exact: true }).click();
  await page.waitForTimeout(150);
  const overlapping = await page.evaluate(() => {
    const card = document.querySelector('[data-aquarium-obstacle="form"]').getBoundingClientRect();
    return [...document.querySelectorAll('[data-fish]')].some(node => {
      const r = node.getBoundingClientRect();
      return r.right > card.left && r.left < card.right && r.bottom > card.top && r.top < card.bottom;
    });
  });
  assert.equal(overlapping, false, 'Fish avoid the expanded card');
  await page.getByText('Hesabınıza erişmek için destek alın', { exact: true }).click();
  await page.getByLabel('E-posta', { exact: true }).clear();
  await page.getByLabel('Parola', { exact: true }).clear();

  assert.equal(await page.getByRole('button', { name: /Akvaryum animasyonunu|Akvaryum ışığını/ }).count(), 0, 'Playback and lighting controls removed');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(60);
  const paused = await transforms(page);
  await page.waitForTimeout(180);
  assert.deepEqual(await transforms(page), paused);
  assert.ok(await motion(page).evaluate(el => el.getAnimations({ subtree: true }).every(a => a.playState === 'paused' || a.playState === 'finished')));
  await page.screenshot({ path: `${evidence}/interactive-desktop.png` });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'true');
  await page.keyboard.press('Tab');
  await fish.focus();
  await page.keyboard.press('Enter');
  assert.equal(await fish.getAttribute('data-reacting'), 'true');
  await page.waitForTimeout(60);
  const focusedPosition = await fish.evaluate(n => n.style.transform);
  await page.waitForTimeout(120);
  assert.equal(await fish.evaluate(n => n.style.transform), focusedPosition, 'Keyboard target stays still');
  await page.getByLabel('E-posta', { exact: true }).focus();
  console.log('PASS: form input, card resize, removed controls and keyboard interaction');

  const reef = await motion(page).elementHandle();
  await page.getByRole('link', { name: 'Kayıt Olun', exact: true }).click();
  await page.waitForURL('**/kayit');
  assert.equal(await page.locator('main h1').textContent(), 'Kayıt Ol');
  assert.ok(await reef.evaluate(node => node === document.querySelector('[aria-label="Etkileşimli akvaryum"]')), 'Same aquarium survives panel switch');
  assert.equal(await page.locator('#auth-heading').evaluate(node => node === document.activeElement), true);
  await page.getByRole('button', { name: 'Kayıt Ol', exact: true }).click();
  assert.equal(await page.locator('#register-name').getAttribute('aria-invalid'), 'true', 'Registration validation preserved');
  await page.screenshot({ path: `${evidence}/interactive-register.png`, animations: 'disabled' });
  await page.goBack();
  await page.waitForSelector('[data-auth-screen="login"]');
  await page.goForward();
  await page.waitForSelector('[data-auth-screen="register"]');
  await page.getByRole('link', { name: 'Giriş Yapın', exact: true }).click();
  await page.getByRole('link', { name: 'Parolamı unuttum / hesabımı doğrula', exact: true }).click();
  await page.waitForURL('**/parola-yenile');
  assert.equal(await page.locator('main h1').textContent(), 'Parolamı unuttum');
  await page.getByLabel('E-posta', { exact: true }).fill('recovery-preview@example.com');
  await page.screenshot({ path: `${evidence}/interactive-recovery.png`, animations: 'disabled' });
  assert.ok(await reef.evaluate(node => node === document.querySelector('[aria-label="Etkileşimli akvaryum"]')));
  await page.getByRole('link', { name: 'Giriş sayfasına dön', exact: true }).click();
  assert.equal(await page.getByLabel('Parola', { exact: true }).inputValue(), '', 'Sensitive fields clear on screen changes');
  console.log('PASS: inline auth panels, persistent aquarium, back/forward, focus and registration validation');

  for (const width of [320, 390, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.waitForTimeout(80);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}`);
    const quality = await motion(page).getAttribute('data-quality');
    assert.equal(await page.locator('[data-fish]:visible').count(), width <= 700 ? 8 : quality === 'low' ? 12 : 18);
    assert.equal(await page.locator('[data-prop]:visible').count(), width <= 700 ? 12 : 24);
  }
  await page.setViewportSize({ width: 1440, height: 400 });
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'false');
  const offscreen = await transforms(page);
  await page.waitForTimeout(100);
  assert.deepEqual(await transforms(page), offscreen);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'true');
  // Exercise the visibility handler deterministically without relying on browser window focus.
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'false');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  console.log('PASS: six responsive widths, offscreen and hidden-tab pause');

  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  await open(reduced);
  const still = await transforms(reduced);
  await reduced.waitForTimeout(160);
  assert.deepEqual(await transforms(reduced), still);
  assert.equal(await motion(reduced).evaluate(el => el.getAnimations({ subtree: true }).length), 0);
  await reduced.getByLabel('E-posta', { exact: true }).fill('motion@example.com');
  await reduced.screenshot({ path: `${evidence}/interactive-reduced.png` });
  console.log('PASS: reduced-motion static scene and usable form');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 950 }, isMobile: true, hasTouch: true });
  await open(mobile);
  await mobile.waitForFunction(() => document.querySelector('[aria-label="Etkileşimli akvaryum"]').dataset.running === 'true');
  const mobileFish = mobile.locator('[data-fish="misket"]');
  await mobileFish.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  box = await mobileFish.boundingBox();
  await mobile.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await mobile.waitForFunction(() => document.querySelector('[data-fish="misket"]').dataset.state === 'flee');
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.waitForTimeout(60);
  const mobilePaused = await transforms(mobile);
  await mobile.evaluate(() => scrollTo(0, 0));
  await mobile.screenshot({ path: `${evidence}/interactive-mobile.png`, fullPage: true });
  assert.deepEqual(await transforms(mobile), mobilePaused, 'Transient screenshot viewport does not collapse fish positions');
  await mobile.getByLabel('E-posta', { exact: true }).fill('mobile@example.com');
  assert.equal(await mobile.getByLabel('E-posta', { exact: true }).inputValue(), 'mobile@example.com');
  await mobile.getByRole('link', { name: 'Kayıt Olun', exact: true }).click();
  assert.equal(await mobile.locator('main h1').textContent(), 'Kayıt Ol');
  const mobileHeading = await mobile.locator('main h1').boundingBox();
  const headerBottom = await mobile.locator('.store-header').evaluate(node => node.getBoundingClientRect().bottom);
  assert.ok(mobileHeading.y >= headerBottom && mobileHeading.y < 950, 'Panel heading returns below sticky header on mobile');
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobile.getByRole('link', { name: 'Giriş Yapın', exact: true }).click();
  await mobile.getByRole('link', { name: 'Parolamı unuttum / hesabımı doğrula', exact: true }).click();
  assert.equal(await mobile.locator('main h1').textContent(), 'Parolamı unuttum');
  await mobile.screenshot({ path: `${evidence}/interactive-mobile-recovery.png`, animations: 'disabled' });
  console.log('PASS: mobile touch escape and form interaction');

  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(new URL('/giris', origin).href);
  assert.equal(await staticPage.locator('[data-fish]').count(), 18);
  assert.equal(await staticPage.getByLabel('E-posta', { exact: true }).isVisible(), true);
  await staticContext.close();
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto(new URL('/giris?hata=google-dogrulama', origin).href);
  assert.match(await page.locator('main [role="alert"]').textContent(), /Google doğrulaması tamamlanamadı/);
  await page.goto(new URL('/kayit', origin).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('main video').count(), 0);
  assert.equal(await page.locator('[data-fish]').count(), 18);
  assert.equal(await page.locator('main h1').textContent(), 'Kayıt Ol');
  await page.goto(new URL('/parola-yenile', origin).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-fish]').count(), 18);
  assert.equal(await page.locator('main h1').textContent(), 'Parolamı unuttum');
  const token = 'local-preview-token-not-submitted';
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(new URL(`/kimlik#reset:${token}`, origin).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('input[name="token"]').inputValue(), token);
  assert.equal(await page.locator('input[name="purpose"]').inputValue(), 'reset');
  assert.equal(await page.locator('input[autocomplete="new-password"]').isVisible(), true);
  assert.equal(new URL(page.url()).hash, '', 'Token removed from URL after local capture');
  assert.ok(requests.every(url => !url.includes(token)), 'Fragment token stays out of network requests');
  await page.getByRole('link', { name: 'Giriş sayfasına dön', exact: true }).click();
  assert.equal(await page.locator('[data-auth-screen="login"]').count(), 1);
  console.log('PASS: static HTML fallback, OAuth error, direct auth routes and private reset fragment');

  await mobile.close();
  await reduced.close();
  await page.goto(new URL('/giris', origin).href, { waitUntil: 'networkidle' });
  const frames = await page.evaluate(() => new Promise(resolve => {
    const samples = []; let previous = 0;
    function frame(t) { if (previous) samples.push(t - previous); previous = t; if (samples.length < 150) requestAnimationFrame(frame); else { samples.sort((a,b) => a-b); resolve({ medianFrameMs: samples[75], p95FrameMs: samples[142], frames: samples.length }); } }
    requestAnimationFrame(frame);
  }));
  await writeFile(`${evidence}/interactive-frame-sample.json`, JSON.stringify({ environment: 'Local Chromium; synthetic frame intervals, not real-device GPU or field metrics', ...frames }, null, 2));
  console.log('Frame sample:', frames);
  assert.deepEqual(errors, []);
  console.log('PASS: no browser exceptions');
} finally { await browser.close(); }
