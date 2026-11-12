import { appOrigin, audit, guardRate, InputError, limitedJson } from "@/lib/security";
const directives = new Set(["script-src", "script-src-elem", "script-src-attr", "style-src", "style-src-elem", "style-src-attr", "connect-src", "img-src", "font-src", "frame-src", "frame-ancestors", "object-src", "base-uri", "form-action", "default-src"]);
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== appOrigin()) || (!origin && request.headers.get("sec-fetch-site") !== "same-origin")) return new Response(null, { status: 403 });
  const type = request.headers.get("content-type")?.split(";")[0];
  if (type !== "application/csp-report" && type !== "application/reports+json") return new Response(null, { status: 415 });
  try {
    const body = await limitedJson(new Request(request, { headers: { "content-type": "application/json" } }), 8192);
    const reports = type === "application/csp-report" ? [(body as Record<string, unknown>)?.["csp-report"]] : body;
    if (!Array.isArray(reports) || reports.length > 5) return new Response(null, { status: 400 });
    await guardRate("csp-report", 20, 60);
    for (const report of reports) {
      const data = report?.body ?? report;
      const directive = data?.["effective-directive"] ?? data?.effectiveDirective;
      if (typeof directive === "string" && directives.has(directive))
        // Never persist source URLs, query strings, source samples or document contents.
        await audit(`csp.${directive}`, undefined, undefined, "reported");
    }
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return new Response(null, { status: error instanceof InputError ? 429 : 400 }); }
}
