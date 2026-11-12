import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { createHash, randomBytes } from "node:crypto";
import { updateJson } from "./storage";
import { appOrigin, tokenHash } from "./security";
const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"), { timeoutDuration: 5000 });
export const oauthCookie = () => process.env.NODE_ENV === "production" ? "__Host-ga_oauth" : "ga_oauth";
export type OAuthState = { state: string; verifier: string; nonce: string; expires: number; linkUserId?: string };
export async function startGoogle(linkUserId?: string) {
  const flow: OAuthState = { state: randomBytes(32).toString("base64url"), verifier: randomBytes(32).toString("base64url"), nonce: randomBytes(32).toString("base64url"), expires: Date.now() + 600_000, linkUserId };
  await updateJson<Record<string, number>, void>("oauth.json", {}, records => {
    for (const [key, expires] of Object.entries(records)) if (expires <= Date.now()) delete records[key];
    if (Object.keys(records).length >= 1000) throw new Error("Too many OAuth flows");
    records[tokenHash(flow.state)] = flow.expires;
    return { value: records, result: undefined };
  });
  const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID!, redirect_uri: `${appOrigin()}/api/auth/google/callback`, response_type: "code", scope: "openid email profile", state: flow.state, nonce: flow.nonce, code_challenge: createHash("sha256").update(flow.verifier).digest("base64url"), code_challenge_method: "S256", prompt: "select_account" });
  return { flow, url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` };
}
export async function consumeOAuth(flow: OAuthState, state: string) {
  if (flow.state !== state || flow.expires <= Date.now()) throw new Error("Invalid OAuth state");
  await updateJson<Record<string, number>, void>("oauth.json", {}, records => {
    const hash = tokenHash(state);
    if (!records[hash] || records[hash] <= Date.now()) throw new Error("Expired OAuth state");
    delete records[hash]; return { value: records, result: undefined };
  });
}
export async function googleIdentity(code: string, flow: OAuthState) {
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000), headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: `${appOrigin()}/api/auth/google/callback`, grant_type: "authorization_code", code_verifier: flow.verifier }) });
  if (!response.ok) throw new Error("OAuth token exchange failed");
  const tokens = await response.json();
  if (typeof tokens.id_token !== "string") throw new Error("Missing ID token");
  const { payload } = await jwtVerify(tokens.id_token, googleKeys, { issuer: ["https://accounts.google.com", "accounts.google.com"], audience: process.env.GOOGLE_CLIENT_ID!, algorithms: ["RS256"], requiredClaims: ["sub", "email", "email_verified", "nonce", "exp", "iat"], maxTokenAge: "10 minutes" });
  if (payload.nonce !== flow.nonce || payload.email_verified !== true || typeof payload.email !== "string" || typeof payload.sub !== "string" || (payload.azp && payload.azp !== process.env.GOOGLE_CLIENT_ID)) throw new Error("Invalid identity claims");
  return { sub: payload.sub, email: payload.email, verified: true, name: typeof payload.name === "string" ? payload.name.slice(0, 60) : "" };
}
