import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cookieOptions, getSessionUser, googleConfigured } from "@/lib/auth";
import { appOrigin, guardRate, seal } from "@/lib/security";
import { oauthCookie, startGoogle } from "@/lib/oauth";
export async function GET() {
  const fail = () => NextResponse.redirect(`${appOrigin()}/giris?hata=google-kapali`);
  if (!googleConfigured()) return fail();
  try {
    await guardRate("google-start", 10, 600);
    const session = await getSessionUser();
    const { flow, url } = await startGoogle(session && Date.now() - session.authAt < 300_000 ? session.uid : undefined);
    (await cookies()).set(oauthCookie(), seal(JSON.stringify(flow)), { ...cookieOptions(), maxAge: 600 });
    return NextResponse.redirect(url);
  } catch { return fail(); }
}
