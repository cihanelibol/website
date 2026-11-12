import { timingSafeEqual } from "node:crypto";
import { dispatchOrderNotifications } from "@/lib/order-outbox";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret ?? ""}`);
  if (!secret || secret.length < 32 || actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  try { return Response.json(await dispatchOrderNotifications(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Notification dispatch unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
