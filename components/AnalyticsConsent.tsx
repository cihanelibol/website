"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ANALYTICS_CHANGE, ANALYTICS_PREFERENCE, ANALYTICS_READY, ANALYTICS_SETTINGS, GA4_ID, GTM_ID, trackEvent } from "@/lib/analytics";

function subscribe(callback: () => void) {
  window.addEventListener(ANALYTICS_CHANGE, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(ANALYTICS_CHANGE, callback); window.removeEventListener("storage", callback); };
}
function snapshot() {
  try { return localStorage.getItem(ANALYTICS_PREFERENCE) ?? "unknown"; }
  catch { return "unknown"; }
}
const serverSnapshot = () => "unknown";
const privatePath = (path: string) => /^\/(admin|hesap|giris|kayit|kimlik|parola-yenile|sepet)(\/|$)/.test(path);

export default function AnalyticsConsent({ nonce }: { nonce?: string }) {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(ANALYTICS_SETTINGS, open);
    return () => window.removeEventListener(ANALYTICS_SETTINGS, open);
  }, []);

  useEffect(() => {
    if (preference !== "granted" || privatePath(pathname)) {
      if (window.gtag) {
        Object.assign(window, { [`ga-disable-${GA4_ID}`]: true });
        window.gtag("consent", "update", { analytics_storage: "denied" });
      }
      return;
    }
    Object.assign(window, { [`ga-disable-${GA4_ID}`]: false });
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        void args;
        // Google's queue expects the arguments object, not an event object.
        // eslint-disable-next-line prefer-rest-params -- Preserve Google's documented gtag queue protocol.
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("set", { allow_google_signals: false, allow_ad_personalization_signals: false, allow_user_provided_data: false, page_location: location.origin + pathname });
      window.gtag("consent", "update", { analytics_storage: "granted" });
      window.gtag("js", new Date());
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.id = "gri-google-tag";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      if (nonce) script.nonce = nonce;
      script.onload = () => {
        window.griAnalyticsReady = true;
        window.dispatchEvent(new Event(ANALYTICS_READY));
      };
      document.head.appendChild(script);
    }
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("set", "page_location", location.origin + pathname);
    if (window.griAnalyticsReady) window.dispatchEvent(new Event(ANALYTICS_READY));
  }, [nonce, pathname, preference]);

  useEffect(() => {
    if (preference !== "granted") return;
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const destination = new URL(href, location.href);
      if (destination.origin === location.origin && privatePath(destination.pathname) && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0 && !link.target) {
        // A fresh private document has no Google tag; don't carry it into account forms.
        event.preventDefault();
        location.assign(destination.href);
        return;
      }
      if (href.startsWith("tel:")) trackEvent("contact_click", { contact_method: "phone" });
      else if (href.startsWith("https://wa.me/")) trackEvent("contact_click", { contact_method: "whatsapp" });
      else if (/^https:\/\/(maps\.google\.com|www\.google\.com\/maps)/.test(href)) trackEvent("directions_click");
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [preference]);

  function choose(value: "granted" | "denied") {
    try { localStorage.setItem(ANALYTICS_PREFERENCE, value); } catch { /* Keep analytics off if the choice cannot be saved. */ }
    if (value === "denied" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      Object.assign(window, { [`ga-disable-${GA4_ID}`]: true });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!/^_ga(?:_|$)/.test(name)) continue;
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        const parts = location.hostname.split(".");
        for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}`;
      }
      location.reload();
      return;
    }
    window.dispatchEvent(new Event(ANALYTICS_CHANGE));
    setSettingsOpen(false);
  }

  if ((!settingsOpen && preference !== "unknown") || privatePath(pathname)) return null;
  return <section aria-label="Analitik çerez tercihleri" className="fixed bottom-4 left-4 right-4 z-[100] max-w-lg rounded-2xl border border-cyan-400/20 bg-background p-5 shadow-xl sm:right-auto">
    <p className="font-semibold">Siteyi geliştirmemize yardımcı olun</p>
    <p className="mt-2 text-sm leading-relaxed text-muted">İzin verirseniz ziyaret ve ürün etkileşimlerini Google Analytics ile ölçeriz. Seçiminizi alt menüdeki “Çerez tercihleri” bağlantısından değiştirebilirsiniz. <Link className="underline" href="/sozlesme/analitik-cerezler">Ayrıntılar</Link></p>
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" className="store-button" onClick={() => choose("denied")}>Yalnızca gerekli</button>
      <button type="button" className="store-button" onClick={() => choose("granted")}>Analitiğe izin ver</button>
      {settingsOpen && <button type="button" className="store-button" onClick={() => setSettingsOpen(false)}>Kapat</button>}
    </div>
  </section>;
}

export function AnalyticsSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS))}>Çerez tercihleri</button>;
}
