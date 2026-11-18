import { NextResponse } from "next/server";
import { processPaymentToken } from "@/lib/payment-processing";
import { appOrigin } from "@/lib/security";
import { orderTrackingPath } from "@/lib/order-access";

export const dynamic = "force-dynamic";
function back(id?: string) {
  return NextResponse.redirect(`${appOrigin()}${id ? orderTrackingPath(id) : "/sepet/sonuc"}`, 303);
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return back();
  let token = "";
  try { token = String((await request.formData()).get("token") ?? ""); } catch { return back(); }
  if (!/^[A-Za-z0-9-]{10,100}$/.test(token)) return back();
  try {
    const outcome = await processPaymentToken(token);
    return back(outcome?.orderId);
  } catch { return back(); }
}

export function GET() { return back(); }
