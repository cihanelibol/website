import { NextRequest, NextResponse } from "next/server";
import { catalogUrl, parseCatalogParams, type CatalogParams } from "./lib/catalog-seo";
export function proxy(request: NextRequest) {
  // Redirect before rendering starts, so legacy filters return a real HTTP 308.
  if (request.nextUrl.pathname === "/urunler") {
    const raw: CatalogParams = {};
    for (const key of request.nextUrl.searchParams.keys()) {
      const values = request.nextUrl.searchParams.getAll(key);
      raw[key] = values.length === 1 ? values[0] : values;
    }
    // Historical Search Console URL: this used a category slug before numeric IDs.
    const legacyFishCategory = raw.kategori === "baliklar" && !raw.grup;
    if (legacyFishCategory) {
      delete raw.kategori;
      raw.grup = "baliklar-canlilar";
    }
    const filters = parseCatalogParams(raw);
    if (filters) {
      const path = catalogUrl(filters).split("?")[0];
      if (path !== "/urunler") {
        const destination = request.nextUrl.clone();
        destination.pathname = path;
        if (legacyFishCategory) destination.searchParams.delete("kategori");
        destination.searchParams.delete(path.startsWith("/kategori/") ? "grup" : "marka");
        return NextResponse.redirect(destination, 308);
      }
    }
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const dev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'", `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'", "img-src 'self' https: data: blob:", "font-src 'self'",
    `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${dev ? " ws: wss:" : ""}`, "frame-src https://maps.google.com https://www.google.com",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "report-uri /api/csp-report",
    ...(!dev ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  const requestId = crypto.randomUUID();
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId);
  // Enable enforcement after production browser smoke; framing is enforced separately.
  response.headers.set(process.env.CSP_ENFORCE === "1" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only", csp);
  if (/^\/(admin|hesap|giris|kayit|kimlik|parola-yenile|sepet)(\/|$)/.test(request.nextUrl.pathname))
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images).*)"] };
