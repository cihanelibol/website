import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { addActivity } from "@/lib/activity";
import { guardRate, InputError, limitedJson, sameOrigin, textField } from "@/lib/security";
export async function POST(request: Request) {
  const respond = (ok: boolean, status = 200) => NextResponse.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });
  if (!sameOrigin(request)) return respond(false, 403);
  let session;
  try { session = await getSessionUser(); } catch { return respond(false, 503); }
  if (!session) return respond(true);
  try { await guardRate("activity", 30, 60, session.uid); } catch (error) { return respond(false, error instanceof InputError ? 429 : 503); }
  try {
    const body = await limitedJson(request) as Record<string, unknown>;
    if (!body || !["urun-goruntuleme", "sepete-ekleme"].includes(String(body.type))) return respond(false, 400);
    if (!Number.isSafeInteger(body.productId) || Number(body.productId) < 1 || (body.qty !== undefined && (!Number.isInteger(body.qty) || Number(body.qty) < 1 || Number(body.qty) > 99))) return respond(false, 400);
    await addActivity({ userId: session.uid, userName: session.name, type: body.type as "urun-goruntuleme" | "sepete-ekleme", productId: Number(body.productId), productName: textField(body.productName ?? "", 120), qty: body.qty as number | undefined });
    return respond(true);
  } catch { return respond(false, 400); }
}
