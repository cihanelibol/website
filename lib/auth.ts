// Hafif üyelik sistemi: scrypt parola özeti + HMAC imzalı oturum çerezi.
// Üyelik zorunlu değil - sipariş misafir olarak da verilebilir.

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { readJson, writeJson } from "./storage";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // salt:hash (hex) — Google hesaplarında boş
  /** Google ile açılan hesaplarda "google" */
  provider?: "google";
  /** Cep telefonu (05XXXXXXXXX) */
  phone?: string;
  createdAt: string;
  /** Üyelik sözleşmesi + KVKK aydınlatma onay zamanı (ispat kaydı) */
  legalAcceptedAt?: string;
  /** Ticari elektronik ileti onayı (isteğe bağlı) ve zamanı */
  marketingConsent?: boolean;
  marketingConsentAt?: string | null;
};

const FILE = "users.json";
const SESSION_COOKIE = "ga_session";
// Kullanıcı adını arayüzde göstermek için (httpOnly değil, imzasız - sadece görsel)
export const DISPLAY_COOKIE = "ga_user";
const SESSION_DAYS = 30;

function secret(): string {
  return process.env.SESSION_SECRET ?? "griakvaryum-dev-secret-degistir";
}

/* ---------------- Roller ---------------- */
// ADMIN_EMAILS env değişkeni (virgülle ayrılmış) yönetici e-postalarını belirler.
// Bu adresler dışındaki tüm üyeler normal müşteridir.

const DEFAULT_ADMIN_EMAILS = "cihanelibol47@gmail.com,griakvaryum@gmail.com";

export function isAdminEmail(email: string): boolean {
  const admins = (process.env.ADMIN_EMAILS ?? DEFAULT_ADMIN_EMAILS)
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readJson<User[]>(FILE, []);
  const needle = email.trim().toLowerCase();
  return users.find((u) => u.email === needle);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  marketingConsent?: boolean;
}): Promise<User | { error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }
  if (input.password.length < 6) {
    return { error: "Parola en az 6 karakter olmalı." };
  }
  const users = await readJson<User[]>(FILE, []);
  if (users.some((u) => u.email === email)) {
    return { error: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin." };
  }
  const now = new Date().toISOString();
  const user: User = {
    id: randomBytes(12).toString("hex"),
    name: input.name.trim().slice(0, 60),
    email,
    passwordHash: hashPassword(input.password),
    phone: input.phone,
    createdAt: now,
    legalAcceptedAt: now,
    marketingConsent: Boolean(input.marketingConsent),
    marketingConsentAt: input.marketingConsent ? now : null,
  };
  users.push(user);
  await writeJson(FILE, users);
  return user;
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<User | undefined | { error: string }> {
  const user = await findUserByEmail(email);
  if (!user) return undefined;
  if (user.provider === "google" || !user.passwordHash) {
    return {
      error:
        "Bu hesap Google ile açılmış. Lütfen 'Google ile devam et' düğmesini kullanın.",
    };
  }
  return verifyPassword(password, user.passwordHash) ? user : undefined;
}

/** Google ile giriş: e-posta varsa mevcut hesabı döndürür, yoksa hesap açar */
export async function findOrCreateGoogleUser(input: {
  email: string;
  name: string;
}): Promise<{ user: User; created: boolean }> {
  const email = input.email.trim().toLowerCase();
  const users = await readJson<User[]>(FILE, []);
  const existing = users.find((u) => u.email === email);
  if (existing) return { user: existing, created: false };

  const now = new Date().toISOString();
  const user: User = {
    id: randomBytes(12).toString("hex"),
    name: input.name.trim().slice(0, 60) || email.split("@")[0],
    email,
    passwordHash: "",
    provider: "google",
    createdAt: now,
    // Google ile devam eden kullanıcı, düğme altındaki bilgilendirmeyle
    // sözleşmeleri kabul etmiş sayılır (ispat kaydı)
    legalAcceptedAt: now,
    marketingConsent: false,
    marketingConsentAt: null,
  };
  users.push(user);
  await writeJson(FILE, users);
  return { user, created: true };
}

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await readJson<User[]>(FILE, []);
  return users.find((u) => u.id === id);
}

export async function updateUserProfile(
  id: string,
  patch: { name?: string; phone?: string }
): Promise<User | undefined> {
  const users = await readJson<User[]>(FILE, []);
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  if (patch.name) user.name = patch.name.trim().slice(0, 60);
  if (patch.phone) user.phone = patch.phone;
  await writeJson(FILE, users);
  return user;
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<{ error?: string }> {
  const users = await readJson<User[]>(FILE, []);
  const user = users.find((u) => u.id === id);
  if (!user) return { error: "Kullanıcı bulunamadı." };
  if (!verifyPassword(currentPassword, user.passwordHash))
    return { error: "Mevcut parolanız hatalı." };
  if (newPassword.length < 6)
    return { error: "Yeni parola en az 6 karakter olmalı." };
  user.passwordHash = hashPassword(newPassword);
  await writeJson(FILE, users);
  return {};
}

/* ---------------- Oturum çerezi ---------------- */

type SessionPayload = { uid: string; name: string; exp: number };

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(user: User): string {
  const payload: SessionPayload = {
    uid: user.id,
    name: user.name,
    exp: Date.now() + SESSION_DAYS * 86400_000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function parseSessionToken(token: string): SessionPayload | undefined {
  const [data, sig] = token.split(".");
  if (!data || !sig || sign(data) !== sig) return undefined;
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    ) as SessionPayload;
    return payload.exp > Date.now() ? payload : undefined;
  } catch {
    return undefined;
  }
}

// Yönetim bağlantısını arayüzde göstermek için (güvenlik sunucuda ayrıca doğrulanır)
export const ROLE_COOKIE = "ga_role";

export async function setSessionCookies(user: User): Promise<void> {
  const store = await cookies();
  const maxAge = SESSION_DAYS * 86400;
  store.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    maxAge,
    path: "/",
  });
  // Not: Next cookies().set değeri kendisi URL-kodlar; burada tekrar kodlama yapılmaz
  store.set(DISPLAY_COOKIE, user.name, {
    sameSite: "lax",
    maxAge,
    path: "/",
  });
  store.set(ROLE_COOKIE, isAdminEmail(user.email) ? "admin" : "musteri", {
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(DISPLAY_COOKIE);
  store.delete(ROLE_COOKIE);
}

/** Oturumdaki kullanıcı yönetici mi? (kayıt üzerinden sunucuda doğrulanır) */
export async function getAdminUser(): Promise<User | undefined> {
  const session = await getSessionUser();
  if (!session) return undefined;
  const user = await getUserById(session.uid);
  return user && isAdminEmail(user.email) ? user : undefined;
}

export async function getSessionUser(): Promise<
  { uid: string; name: string } | undefined
> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return undefined;
  const payload = parseSessionToken(token);
  return payload ? { uid: payload.uid, name: payload.name } : undefined;
}
