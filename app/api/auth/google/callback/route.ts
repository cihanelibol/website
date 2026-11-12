import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findOrCreateGoogleUser, getSessionUser, googleConfigured, setSessionCookies } from "@/lib/auth";
import { appOrigin, audit, unseal } from "@/lib/security";
import { consumeOAuth, googleIdentity, oauthCookie, type OAuthState } from "@/lib/oauth";
export async function GET(request: Request) {
  const fail = () => NextResponse.redirect(`${appOrigin()}/giris?hata=google-dogrulama`);
  const store = await cookies();
  const saved = store.get(oauthCookie())?.value;
  store.delete(oauthCookie());
  if (!googleConfigured() || !saved) return fail();
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code"), state = url.searchParams.get("state");
    if (!code || code.length > 4096 || !state || state.length > 64) return fail();
    const flow = JSON.parse(unseal(saved)) as OAuthState;
    await consumeOAuth(flow, state);
    const identity = await googleIdentity(code, flow);
    const session = await getSessionUser();
    const linkUserId = session && session.uid === flow.linkUserId && Date.now() - session.authAt < 300_000 ? session.uid : undefined;
    const { user } = await findOrCreateGoogleUser({ ...identity, linkUserId });
    await setSessionCookies(user); await audit("login.google", user.id);
    return NextResponse.redirect(`${appOrigin()}${user.role === "admin" ? "/hesap/guvenlik" : "/hesap"}`);
  } catch { await audit("login.google", undefined, undefined, "denied"); return fail(); }
}
