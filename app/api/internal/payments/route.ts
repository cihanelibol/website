import { timingSafeEqual } from "node:crypto";
import { paymentCheckCandidates } from "@/lib/orders";
import { processPaymentToken } from "@/lib/payment-processing";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || secret.length < 32 || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return new Response(null, { status: 401 });
  try {
    const candidates = await paymentCheckCandidates();
    for (const item of candidates) await processPaymentToken(item.token);
    return Response.json({ checked: candidates.length }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Payment check unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
export const GET = POST;
