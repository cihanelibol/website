// Google OAuth başlangıcı: kullanıcıyı Google izin ekranına yönlendirir.
// CSRF koruması için rastgele "state" değeri çerezde saklanır ve dönüşte doğrulanır.

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { googleConfigured } from "@/lib/auth";

export async function GET(request: Request) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/giris?hata=google-kapali", request.url));
  }

  const origin = new URL(request.url).origin;
  const state = randomBytes(16).toString("hex");

  const store = await cookies();
  store.set("ga_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
