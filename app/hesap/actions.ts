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

export type AuthState = { error?: string };

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
  redirect("/");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await verifyLogin(email, password);
  if (!user) return { error: "E-posta veya parola hatalı." };

  await setSessionCookies(user);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookies();
  redirect("/");
}
