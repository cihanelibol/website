// Public IDs: supplied GTM container and its verified published GA4 destination.
export const GTM_ID = "GTM-MX2PWXC3";
export const GA4_ID = "G-VFL3YXK217";
export const ANALYTICS_PREFERENCE = "gri-analytics-consent-v1";
export const ANALYTICS_CHANGE = "gri-analytics-consent-change";
export const ANALYTICS_SETTINGS = "gri-analytics-settings";
export const ANALYTICS_READY = "gri-analytics-ready";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    griAnalyticsReady?: boolean;
  }
}

export function analyticsAllowed() {
  try { return localStorage.getItem(ANALYTICS_PREFERENCE) === "granted"; }
  catch { return false; }
}

export function trackEvent(name: string, parameters: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !analyticsAllowed() || !window.gtag || !window.griAnalyticsReady) return false;
  window.gtag("event", name, {
    ...parameters,
    send_to: GA4_ID,
    page_location: window.location.origin + window.location.pathname,
  });
  return true;
}
