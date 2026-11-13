import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = new URL(process.argv[2] || 'https://griakvaryum.com');
const browser = await chromium.launch({ headless: true });
const samples = [];
try {
  for (const path of ['/', '/kategori/filtreler', '/rehber/filtre-rehberi', '/magaza/eminonu']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    // Fresh visitor, no consent: never send audit activity to analytics.
    await context.route('https://www.googletagmanager.com/**', route => route.abort());
    await context.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.abort());
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__lab = { lcp: null, lcpElement: null, shifts: [] };
      new PerformanceObserver(list => {
        const last = list.getEntries().at(-1);
        if (last) { window.__lab.lcp = last.startTime; window.__lab.lcpElement = last.element?.tagName ?? null; }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__lab.shifts.push({ time: entry.startTime, value: entry.value });
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const response = await page.goto(new URL(path, base).href, { waitUntil: 'load', timeout: 60000 });
    // Fixed observation window for repeatability; this is not a field CWV measurement.
    await page.waitForTimeout(5000);
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      let maxWindow = 0, currentWindow = 0, first = 0, previous = 0;
      for (const shift of window.__lab.shifts) {
        if (currentWindow && shift.time - previous < 1000 && shift.time - first < 5000) currentWindow += shift.value;
        else { currentWindow = shift.value; first = shift.time; }
        previous = shift.time;
        maxWindow = Math.max(maxWindow, currentWindow);
      }
      return { ttfbMs: Math.round(navigation.responseStart), fcpMs: fcp ? Math.round(fcp.startTime) : null, observedLcpMs: window.__lab.lcp === null ? null : Math.round(window.__lab.lcp), lcpElement: window.__lab.lcpElement, observedCls: Number(maxWindow.toFixed(4)), transferBytes: navigation.transferSize, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    samples.push({ path, status: response.status(), ...metrics });
    await context.close();
  }
  const report = { capturedAt: new Date().toISOString(), base: base.href, method: 'One fresh headless Chromium context per page; 390x844 CSS px; no CPU/network throttling; normal motion; no analytics consent; measured five seconds after load. Lab snapshots, not Lighthouse scores or field Core Web Vitals. INP and percentile distributions are not measured.', samples };
  await mkdir('.gstack/seo-evidence', { recursive: true });
  await writeFile('.gstack/seo-evidence/performance-lab.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
