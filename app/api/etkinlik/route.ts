// Üye aktivite olaylarını toplayan uç nokta.
// İstemci "sepete ekleme" ve "ürün görüntüleme" olaylarını buraya bildirir;
// kimlik sunucudaki oturum çerezinden alınır (istemciden gelen kimliğe güvenilmez).

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { addActivity, type ActivityType } from "@/lib/activity";

const ALLOWED_TYPES: ActivityType[] = ["urun-goruntuleme", "sepete-ekleme"];

export async function POST(request: Request) {
  const session = await getSessionUser();
  // Misafir hareketleri kaydedilmez — sessizce kabul et
  if (!session) return NextResponse.json({ ok: true });

  let body: {
    type?: string;
    productId?: number;
    productName?: string;
    qty?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = body.type as ActivityType;
  if (!ALLOWED_TYPES.includes(type))
    return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await addActivity({
      userId: session.uid,
      userName: session.name,
      type,
      productId:
        typeof body.productId === "number" ? body.productId : undefined,
      productName:
        typeof body.productName === "string"
          ? body.productName.slice(0, 120)
          : undefined,
      qty: typeof body.qty === "number" ? body.qty : undefined,
    });
  } catch (err) {
    console.error("Aktivite kaydedilemedi:", err);
  }
  return NextResponse.json({ ok: true });
}
