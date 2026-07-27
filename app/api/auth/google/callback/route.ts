// Google OAuth dönüşü: kodu jetona çevirir, kullanıcı bilgisini alır,
// hesabı bulur/oluşturur ve kendi oturum çerezlerimizi kurar.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  findOrCreateGoogleUser,
  googleConfigured,
  setSessionCookies,
} from "@/lib/auth";
import { addActivity } from "@/lib/activity";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/giris?hata=${reason}`);

  if (!googleConfigured()) return fail("google-kapali");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const savedState = store.get("ga_oauth_state")?.value;
  store.delete("ga_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return fail("google-dogrulama");
  }

  try {
    // 1) Kodu erişim jetonuna çevir
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) {
      console.error("Google token hatası:", await tokenRes.text());
      return fail("google-jeton");
    }
    const tokens = (await tokenRes.json()) as { access_token: string };

    // 2) Kullanıcı bilgisini al
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    if (!userRes.ok) return fail("google-profil");
    const profile = (await userRes.json()) as {
      email?: string;
      verified_email?: boolean;
      name?: string;
    };
    if (!profile.email) return fail("google-eposta");

    // 3) Hesabı bul/oluştur ve oturum aç
    const { user, created } = await findOrCreateGoogleUser({
      email: profile.email,
      name: profile.name ?? "",
    });
    await setSessionCookies(user);

    if (created) {
      sendWelcomeEmail(user.name, user.email).catch(() => {});
      addActivity({ userId: user.id, userName: user.name, type: "kayit" }).catch(
        () => {}
      );
    } else {
      addActivity({ userId: user.id, userName: user.name, type: "giris" }).catch(
        () => {}
      );
    }

    return NextResponse.redirect(`${origin}/`);
  } catch (err) {
    console.error("Google giriş hatası:", err);
    return fail("google-genel");
  }
}
