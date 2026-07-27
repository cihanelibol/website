"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  changePassword,
  clearSessionCookies,
  createUser,
  getSessionUser,
  getUserById,
  setSessionCookies,
  updateUserProfile,
  verifyLogin,
} from "@/lib/auth";
import { addAddress, deleteAddress } from "@/lib/addresses";
import { addActivity } from "@/lib/activity";
import { sendWelcomeEmail } from "@/lib/email";

export type AuthState = { error?: string; ok?: boolean };

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phoneRaw = String(formData.get("phone") ?? "");
  const legalAccepted = formData.get("legal") === "on";
  const marketingConsent = formData.get("marketing") === "on";

  if (!name) return { error: "Ad Soyad zorunludur." };

  // Telefon: boşluk/tire/parantez ayıklanır; 05XX ile başlayan 11 hane
  // veya 5XX ile başlayan 10 hane kabul edilir
  const phoneDigits = phoneRaw.replace(/[\s()\-+]/g, "").replace(/^90(?=5)/, "");
  const phone = phoneDigits.startsWith("5") ? `0${phoneDigits}` : phoneDigits;
  if (!/^05\d{9}$/.test(phone))
    return { error: "Geçerli bir cep telefonu girin (05XX XXX XX XX)." };

  if (!legalAccepted)
    return {
      error:
        "Üyelik Sözleşmesi ve KVKK Aydınlatma Metni onaylanmadan kayıt tamamlanamaz.",
    };

  const result = await createUser({
    name,
    email,
    password,
    phone,
    marketingConsent,
  });
  if ("error" in result) return { error: result.error };

  await setSessionCookies(result);
  // Hoş geldin e-postası ve denetim kaydı — başarısız olsa bile akışı etkilemez
  sendWelcomeEmail(result.name, result.email).catch(() => {});
  addActivity({ userId: result.id, userName: result.name, type: "kayit" }).catch(
    () => {}
  );
  redirect("/");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const result = await verifyLogin(email, password);
  if (!result) return { error: "E-posta veya parola hatalı." };
  if ("error" in result) return { error: result.error };
  const user = result;

  await setSessionCookies(user);
  addActivity({ userId: user.id, userName: user.name, type: "giris" }).catch(
    () => {}
  );
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookies();
  redirect("/");
}

/* ---------------- Profil ---------------- */

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s()\-+]/g, "").replace(/^90(?=5)/, "");
  return digits.startsWith("5") ? `0${digits}` : digits;
}

export async function updateProfileAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));

  if (!/^\S{2,}(\s+\S{2,})+$/.test(name))
    return { error: "Adınızı ve soyadınızı birlikte girin." };
  if (!/^05\d{9}$/.test(phone))
    return { error: "Geçerli bir cep telefonu girin (05XX XXX XX XX)." };

  const user = await updateUserProfile(session.uid, { name, phone });
  if (!user) return { error: "Profil güncellenemedi." };

  await setSessionCookies(user); // görünen ad çerezini tazele
  revalidatePath("/hesap");
  return { ok: true } as AuthState;
}

export async function changePasswordAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const result = await changePassword(session.uid, current, next);
  if (result.error) return { error: result.error };
  return { ok: true } as AuthState;
}

/* ---------------- Adresler ---------------- */

export async function addAddressAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const session = await getSessionUser();
  if (!session) redirect("/giris");

  const title = String(formData.get("title") ?? "").trim() || "Adresim";
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const city = String(formData.get("city") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();

  if (!fullName) return { error: "Ad Soyad zorunludur." };
  if (!/^05\d{9}$/.test(phone))
    return { error: "Geçerli bir cep telefonu girin." };
  if (!city) return { error: "Şehir zorunludur." };
  if (address.length < 10)
    return { error: "Açık adres en az 10 karakter olmalı." };

  await addAddress({
    userId: session.uid,
    title: title.slice(0, 30),
    fullName: fullName.slice(0, 60),
    phone,
    city,
    district,
    address,
    postalCode,
  });
  revalidatePath("/hesap/adresler");
  return { ok: true } as AuthState;
}

export async function deleteAddressAction(id: string): Promise<void> {
  const session = await getSessionUser();
  if (!session) redirect("/giris");
  await deleteAddress(session.uid, id);
  revalidatePath("/hesap/adresler");
}

/** Profil sayfaları için oturumdaki kullanıcının tam kaydı */
export async function getProfile() {
  const session = await getSessionUser();
  if (!session) return undefined;
  return getUserById(session.uid);
}
