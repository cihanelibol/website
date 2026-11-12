"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePassword, clearSessionCookies, createUser, getSessionUser, setSessionCookies, updateUserProfile, verifyLogin, issueAccountToken, consumeAccountToken, beginMfa, completeMfa } from "@/lib/auth";
import { addAddress, deleteAddress } from "@/lib/addresses";
import { sendAccountEmail, emailConfigured } from "@/lib/email";
import { guardRate, safeError, emailField, textField, audit, InputError } from "@/lib/security";
export type AuthState = { error?: string; ok?: boolean; message?: string; secret?: string; uri?: string; recovery?: string[] };
const value = (data: FormData, key: string, max = 128, min = 0) => textField(data.get(key) ?? "", max, min);
function phoneField(raw: string) {
  const digits = raw.replace(/[\s()\-+]/g, "").replace(/^90(?=5)/, "");
  const phone = digits.startsWith("5") ? `0${digits}` : digits;
  if (!/^05\d{9}$/.test(phone)) throw new InputError("Geçerli bir cep telefonu girin.");
  return phone;
}
export async function registerAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    await guardRate("register", 5, 3600);
    if (!emailConfigured()) throw new InputError("Kayıt şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
    if (data.get("legal") !== "on") throw new InputError("Üyelik sözleşmesini onaylayın.");
    const email = emailField(data.get("email"));
    const result = await createUser({ name: value(data, "name", 60, 2), email, password: String(data.get("password") ?? ""), phone: phoneField(value(data, "phone", 32)), marketingConsent: data.get("marketing") === "on" });
    if (!("error" in result)) {
      const token = await issueAccountToken(email, "verify");
      if (token) await sendAccountEmail(email, token.token, "verify").catch(() => audit("account.email_failed", result.id, undefined, "error"));
      await audit("account.registered", result.id);
    }
    return { ok: true, message: "İşlem uygunsa doğrulama bağlantısı e-posta adresinize gönderildi. Mevcut hesabınız için parola yenilemeyi kullanabilirsiniz." };
  } catch (error) { return { error: safeError(error) }; }
}
export async function loginAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  let admin = false;
  try {
    await guardRate("login-ip", 30, 900);
    const email = emailField(data.get("email"));
    await guardRate("login-account", 10, 900, email);
    const user = await verifyLogin(email, String(data.get("password") ?? ""));
    if (!user) { await audit("login.failed", undefined, undefined, "denied"); return { error: "Giriş yapılamadı. Bilgilerinizi kontrol edin veya parolanızı yenileyin." }; }
    await setSessionCookies(user); admin = user.role === "admin";
    await audit("login.success", user.id);
  } catch (error) { return { error: safeError(error) }; }
  redirect(admin ? "/hesap/guvenlik" : "/hesap");
}
export async function logoutAction() { await clearSessionCookies(); redirect("/giris"); }
export async function logoutAllAction() { await clearSessionCookies(true); redirect("/giris"); }
export async function updateProfileAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    const session = await getSessionUser(); if (!session) throw new InputError("Giriş gerekli.");
    await guardRate("profile", 10, 60, session.uid);
    await updateUserProfile(session.uid, { name: value(data, "name", 60, 2), phone: phoneField(value(data, "phone", 32)) });
    revalidatePath("/hesap"); return { ok: true };
  } catch (error) { return { error: safeError(error) }; }
}
export async function changePasswordAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    const session = await getSessionUser(); if (!session) throw new InputError("Giriş gerekli.");
    await guardRate("password", 5, 900, session.uid);
    const result = await changePassword(session.uid, String(data.get("current") ?? ""), String(data.get("next") ?? ""));
    if (result.error) return result;
    await clearSessionCookies();
  } catch (error) { return { error: safeError(error) }; }
  redirect("/giris");
}
export async function addAddressAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    const session = await getSessionUser(); if (!session) throw new InputError("Giriş gerekli.");
    await guardRate("address", 10, 60, session.uid);
    await addAddress({ userId: session.uid, title: value(data, "title", 30) || "Adresim", fullName: value(data, "fullName", 60, 2), phone: phoneField(value(data, "phone", 32)), city: value(data, "city", 60, 2), district: value(data, "district", 80), address: value(data, "address", 500, 10), postalCode: value(data, "postalCode", 10) });
    revalidatePath("/hesap/adresler"); return { ok: true };
  } catch (error) { return { error: safeError(error) }; }
}
export async function deleteAddressAction(id: string) {
  const session = await getSessionUser(); if (!session) redirect("/giris");
  await guardRate("address", 10, 60, session.uid);
  await deleteAddress(session.uid, textField(id, 32, 1)); revalidatePath("/hesap/adresler");
}
export async function recoveryAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    await guardRate("recovery-ip", 5, 3600);
    const email = emailField(data.get("email"));
    await guardRate("recovery-account", 3, 3600, email);
    if (!emailConfigured()) throw new InputError("Parola yenileme şu anda kullanılamıyor.");
    const issued = await issueAccountToken(email, "reset");
    if (issued) await sendAccountEmail(email, issued.token, "reset").catch(() => audit("account.email_failed", issued.user.id, undefined, "error"));
    return { ok: true, message: "Hesap uygunsa parola yenileme bağlantısı gönderildi." };
  } catch (error) { return { error: safeError(error) }; }
}
export async function tokenAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    await guardRate("account-token", 10, 900);
    const purpose = data.get("purpose"); if (purpose !== "verify" && purpose !== "reset") throw new InputError("Geçersiz işlem.");
    await consumeAccountToken(value(data, "token", 64, 43), purpose, String(data.get("password") ?? ""));
    await clearSessionCookies();
    return { ok: true, message: "İşlem tamamlandı. Artık giriş yapabilirsiniz." };
  } catch (error) { return { error: safeError(error) }; }
}
export async function beginMfaAction(): Promise<AuthState> {
  try { await guardRate("mfa-setup", 5, 900); return await beginMfa(); }
  catch (error) { return { error: safeError(error) }; }
}
export async function mfaAction(_prev: AuthState, data: FormData): Promise<AuthState> {
  try {
    const session = await getSessionUser(); if (!session) throw new InputError("Giriş gerekli.");
    await guardRate("mfa", 5, 900, session.uid);
    const recovery = await completeMfa(value(data, "code", 32, 6));
    revalidatePath("/hesap/guvenlik"); return { ok: true, recovery };
  } catch (error) { return { error: safeError(error) }; }
}
