import "server-only";
import { randomBytes } from "node:crypto";
import { encodePassword, checkPassword as verifyPassword, passwordNeedsUpgrade } from "./passwords";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOTP, Secret } from "otpauth";
import { readJson, updateJson } from "./storage";
import { InputError, emailField, textField, signingKey, tokenHash, seal, unseal, audit } from "./security";

const FILE = "users.json";
export const DISPLAY_COOKIE = "ga_user";
export const ROLE_COOKIE = "ga_role";
export const sessionCookie = () => process.env.NODE_ENV === "production" ? "__Host-ga_session" : "ga_session";
export const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" });
type Session = { hash: string; expires: number; created: number; mfaAt?: number };
type AccountToken = { hash: string; purpose: "verify" | "reset"; expires: number };
export type User = {
  id: string; name: string; email: string; passwordHash: string;
  provider?: "google"; googleSub?: string; phone?: string; createdAt: string;
  legalAcceptedAt?: string; marketingConsent?: boolean; marketingConsentAt?: string | null;
  emailVerifiedAt?: string; role?: "customer" | "admin"; disabled?: boolean; authVersion?: number;
  sessions?: Session[]; tokens?: AccountToken[];
  mfa?: { secret: string; lastCounter: number; recovery: string[] };
  pendingMfa?: { secret: string; expires: number };
};
export function passwordPolicy(password: unknown): asserts password is string {
  if (typeof password !== "string" || password.length < 15 || password.length > 128)
    throw new InputError("Parola 15–128 karakter olmalı.");
}
async function hashPassword(password: string) {
  passwordPolicy(password);
  return encodePassword(password);
}
export async function findUserByEmail(email: string) {
  return (await readJson<User[]>(FILE, [])).find(u => u.email === email.trim().toLowerCase());
}
export async function getUserById(id: string) {
  return (await readJson<User[]>(FILE, [])).find(u => u.id === id);
}
export async function createUser(input: { name: string; email: string; password: string; phone?: string; marketingConsent?: boolean }): Promise<User | { error: string }> {
  const email = emailField(input.email);
  const name = textField(input.name, 60, 2);
  const passwordHash = await hashPassword(input.password);
  const now = new Date().toISOString();
  const user: User = { id: randomBytes(12).toString("hex"), name, email, passwordHash, role: "customer", authVersion: 1,
    phone: input.phone, createdAt: now, legalAcceptedAt: now, marketingConsent: Boolean(input.marketingConsent), marketingConsentAt: input.marketingConsent ? now : null };
  return updateJson<User[], User | { error: string }>(FILE, [], users => {
    if (users.some(u => u.email === email)) return { value: users, result: { error: "İşlemi tamamlamak için giriş veya parola yenileme adımlarını kullanın." } };
    users.push(user);
    return { value: users, result: user };
  });
}
export async function verifyLogin(email: string, password: string): Promise<User | undefined> {
  const user = await findUserByEmail(email);
  // Do equivalent work for missing accounts; do not disclose provider/account existence.
  const valid = await verifyPassword(password, user?.passwordHash ?? "");
  if (!valid || !user?.emailVerifiedAt || user.disabled) return undefined;
  if (!passwordNeedsUpgrade(user.passwordHash)) return user;
  const upgraded = await encodePassword(password);
  return updateJson<User[], User | undefined>(FILE, [], users => {
    const current = users.find(u => u.id === user.id);
    if (!current || current.disabled || !current.emailVerifiedAt || current.passwordHash !== user.passwordHash) return { value: users, result: undefined };
    current.passwordHash = upgraded;
    return { value: users, result: current };
  });
}
export async function findOrCreateGoogleUser(input: { email: string; name: string; sub: string; verified: boolean; linkUserId?: string }): Promise<{ user: User; created: boolean }> {
  if (input.verified !== true || !/^[\w-]{1,255}$/.test(input.sub)) throw new InputError("Google kimliği doğrulanamadı.");
  const email = emailField(input.email);
  const now = new Date().toISOString();
  return updateJson<User[], { user: User; created: boolean }>(FILE, [], users => {
    const identity = users.find(u => u.googleSub === input.sub);
    if (identity) {
      if (identity.disabled) throw new InputError("Giriş yapılamadı.");
      return { value: users, result: { user: identity, created: false } };
    }
    const existing = users.find(u => u.email === email);
    if (existing && !existing.emailVerifiedAt && !existing.googleSub && !existing.disabled) {
      // Unverified legacy/pre-registered account: Google has just proven ownership of this email,
      // so the mailbox owner claims it. Drop every credential the unverified registrant may hold.
      Object.assign(existing, { googleSub: input.sub, provider: "google", emailVerifiedAt: now, passwordHash: "", sessions: [], tokens: [], authVersion: (existing.authVersion ?? 0) + 1 });
      delete existing.mfa; delete existing.pendingMfa;
      return { value: users, result: { user: existing, created: false } };
    }
    if (existing) {
      if (!existing.emailVerifiedAt || existing.disabled || existing.id !== input.linkUserId || existing.googleSub)
        throw new InputError("Hesabı bağlamak için önce mevcut hesabınıza giriş yapın veya parolanızı yenileyin.");
      existing.googleSub = input.sub;
      return { value: users, result: { user: existing, created: false } };
    }
    const user: User = { id: randomBytes(12).toString("hex"), name: textField(input.name || email.split("@")[0], 60, 1), email,
      passwordHash: "", provider: "google", googleSub: input.sub, emailVerifiedAt: now, role: "customer", authVersion: 1, createdAt: now, legalAcceptedAt: now, marketingConsent: false, marketingConsentAt: null };
    users.push(user);
    return { value: users, result: { user, created: true } };
  });
}
export function googleConfigured() { return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET); }
export async function updateUserProfile(id: string, patch: { name?: string; phone?: string }) {
  return updateJson<User[], User | undefined>(FILE, [], users => {
    const user = users.find(u => u.id === id && !u.disabled);
    if (user) { if (patch.name) user.name = textField(patch.name, 60, 2); if (patch.phone) user.phone = textField(patch.phone, 16, 10); }
    return { value: users, result: user };
  });
}
export async function changePassword(id: string, current: string, next: string): Promise<{ error?: string }> {
  const before = await getUserById(id);
  if (!before || !await verifyPassword(current, before.passwordHash)) return { error: "Mevcut parolanız hatalı." };
  const hash = await hashPassword(next);
  await updateJson<User[], void>(FILE, [], users => {
    const user = users.find(u => u.id === id);
    if (!user || user.disabled || user.passwordHash !== before.passwordHash) throw new InputError("Lütfen yeniden giriş yapın.");
    user.passwordHash = hash; user.authVersion = (user.authVersion ?? 0) + 1; user.sessions = []; user.tokens = [];
    return { value: users, result: undefined };
  });
  await audit("password.changed", id);
  return {};
}
export async function issueAccountToken(email: string, purpose: AccountToken["purpose"]) {
  const raw = randomBytes(32).toString("base64url");
  const hash = tokenHash(raw);
  return updateJson<User[], { token: string; user: User } | undefined>(FILE, [], users => {
    const user = users.find(u => u.email === email && !u.disabled);
    if (!user || (purpose === "verify" && user.emailVerifiedAt)) return { value: users, result: undefined };
    user.tokens = [{ hash, purpose, expires: Date.now() + 30 * 60_000 }];
    return { value: users, result: { token: raw, user } };
  });
}
export async function consumeAccountToken(raw: string, purpose: AccountToken["purpose"], password?: string) {
  if (!/^[\w-]{43}$/.test(raw)) throw new InputError("Bağlantı geçersiz veya süresi dolmuş.");
  const hash = tokenHash(raw);
  const newHash = purpose === "reset" ? await hashPassword(password ?? "") : undefined;
  const id = await updateJson<User[], string>(FILE, [], users => {
    const user = users.find(u => !u.disabled && u.tokens?.some(t => t.hash === hash && t.purpose === purpose && t.expires > Date.now()));
    if (!user) throw new InputError("Bağlantı geçersiz veya süresi dolmuş.");
    user.emailVerifiedAt = new Date().toISOString(); user.tokens = []; user.sessions = [];
    user.authVersion = (user.authVersion ?? 0) + 1;
    if (newHash) user.passwordHash = newHash;
    return { value: users, result: user.id };
  });
  await audit(`account.${purpose}`, id);
}
export async function setSessionCookies(snapshot: User) {
  signingKey();
  const raw = `${snapshot.id}.${randomBytes(32).toString("base64url")}`;
  const hash = tokenHash(raw);
  const maxAge = snapshot.role === "admin" ? 3600 : 7 * 86400;
  const now = Date.now();
  await updateJson<User[], void>(FILE, [], users => {
    const user = users.find(u => u.id === snapshot.id);
    if (!user || user.disabled || !user.emailVerifiedAt || user.passwordHash !== snapshot.passwordHash || user.authVersion !== snapshot.authVersion)
      throw new InputError("Lütfen yeniden giriş yapın.");
    user.sessions = [...(user.sessions ?? []).filter(s => s.expires > now).slice(-9), { hash, expires: now + maxAge * 1000, created: now }];
    return { value: users, result: undefined };
  });
  const store = await cookies();
  store.set(sessionCookie(), raw, { ...cookieOptions(), maxAge });
  if (sessionCookie() !== "ga_session") store.delete("ga_session");
  store.set(DISPLAY_COOKIE, snapshot.name, { ...cookieOptions(), httpOnly: false, maxAge });
  store.set(ROLE_COOKIE, "musteri", { ...cookieOptions(), httpOnly: false, maxAge });
}
async function currentSession() {
  const raw = (await cookies()).get(sessionCookie())?.value;
  if (!raw || !/^[a-f0-9]{24}\.[\w-]{43}$/.test(raw)) return undefined;
  const user = await getUserById(raw.split(".")[0]);
  if (!user || user.disabled || !user.emailVerifiedAt) return undefined;
  const session = user.sessions?.find(s => s.hash === tokenHash(raw) && s.expires > Date.now());
  return session ? { user, session } : undefined;
}
export async function getSessionUser() {
  const data = await currentSession();
  return data ? { uid: data.user.id, name: data.user.name, authAt: data.session.created } : undefined;
}
export async function clearSessionCookies(all = false) {
  const data = await currentSession();
  if (data) {
    await updateJson<User[], void>(FILE, [], users => {
      const user = users.find(u => u.id === data.user.id);
      if (user) user.sessions = all ? [] : user.sessions?.filter(s => s.hash !== data.session.hash);
      return { value: users, result: undefined };
    });
    await audit(all ? "session.revoke_all" : "session.logout", data.user.id);
  }
  const store = await cookies();
  for (const name of [sessionCookie(), "ga_session", DISPLAY_COOKIE, ROLE_COOKIE]) store.delete(name);
}
export async function getAdminUser() {
  const data = await currentSession();
  return data?.user.role === "admin" && data.user.mfa && data.session.mfaAt && Date.now() - data.session.mfaAt < 30 * 60_000 ? data.user : undefined;
}
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) { await audit("admin.denied", undefined, undefined, "denied"); redirect("/hesap/guvenlik"); }
  return user;
}
export async function requireFreshAdmin() {
  const data = await currentSession();
  if (!data || data.user.role !== "admin" || !data.user.mfa || !data.session.mfaAt || Date.now() - data.session.mfaAt > 5 * 60_000)
    throw new InputError("Bu işlem için güvenlik sayfasında iki aşamalı doğrulamayı yenileyin.");
  return data.user;
}
export async function getProfile() {
  const data = await currentSession();
  if (!data) return undefined;
  const u = data.user;
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt, marketingConsent: u.marketingConsent, role: u.role ?? "customer", mfaEnabled: Boolean(u.mfa) };
}
function totp(secret: string, email: string) { return new TOTP({ issuer: "Gri Akvaryum", label: email, algorithm: "SHA1", digits: 6, period: 30, secret: Secret.fromBase32(secret) }); }
export async function beginMfa() {
  const data = await currentSession();
  if (!data || data.user.role !== "admin" || Date.now() - data.session.created > 5 * 60_000 || data.user.mfa) throw new InputError("Lütfen yeniden giriş yapın.");
  const secret = new Secret({ size: 20 }).base32;
  await updateJson<User[], void>(FILE, [], users => {
    const user = users.find(u => u.id === data.user.id && !u.disabled && u.role === "admin" && !u.mfa && u.sessions?.some(s => s.hash === data.session.hash && s.expires > Date.now()));
    if (!user) throw new InputError("Lütfen yeniden giriş yapın.");
    user.pendingMfa = { secret: seal(secret), expires: Date.now() + 5 * 60_000 };
    return { value: users, result: undefined };
  });
  return { secret, uri: totp(secret, data.user.email).toString() };
}
export async function completeMfa(code: string) {
  const data = await currentSession();
  if (!data || data.user.role !== "admin") throw new InputError("Giriş gerekli.");
  const recovery = Array.from({ length: 8 }, () => randomBytes(12).toString("hex"));
  const result = await updateJson<User[], string[] | undefined>(FILE, [], users => {
    const user = users.find(u => u.id === data.user.id && !u.disabled && u.role === "admin");
    const session = user?.sessions?.find(s => s.hash === data.session.hash && s.expires > Date.now());
    if (!user || !session) throw new InputError("Giriş gerekli.");
    const pending = !user.mfa && user.pendingMfa && user.pendingMfa.expires > Date.now() ? user.pendingMfa : undefined;
    const encrypted = user.mfa?.secret ?? pending?.secret;
    if (!encrypted) throw new InputError("Önce iki aşamalı doğrulamayı kurun.");
    const generator = totp(unseal(encrypted), user.email);
    const timestamp = Date.now();
    const delta = /^\d{6}$/.test(code) ? generator.validate({ token: code, window: 1, timestamp }) : null;
    const counter = Math.floor(timestamp / 30_000) + (delta ?? 0);
    const recoveryHash = tokenHash(code);
    const recovered = user.mfa?.recovery.includes(recoveryHash) ?? false;
    if (!recovered && (delta === null || counter <= (user.mfa?.lastCounter ?? -1))) throw new InputError("Doğrulama kodu geçersiz.");
    if (pending) { user.mfa = { secret: encrypted, lastCounter: counter, recovery: recovery.map(tokenHash) }; delete user.pendingMfa; }
    else if (user.mfa) { if (recovered) user.mfa.recovery = user.mfa.recovery.filter(h => h !== recoveryHash); else user.mfa.lastCounter = counter; }
    session.mfaAt = Date.now();
    return { value: users, result: pending ? recovery : undefined };
  });
  (await cookies()).set(ROLE_COOKIE, "admin", { ...cookieOptions(), httpOnly: false, maxAge: 1800 });
  await audit("admin.mfa", data.user.id);
  return result;
}
