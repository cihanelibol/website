"use server";
import { randomUUID } from "node:crypto";
import { updateJson } from "@/lib/storage";
import { guardRate, textField, emailField, safeError, InputError } from "@/lib/security";
export type ContactState = { error?: string; success?: boolean };
type ContactMessage = { id: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: string };
export async function contactAction(_prev: ContactState, data: FormData): Promise<ContactState> {
  try {
    await guardRate("contact", 3, 3600);
    const email = textField(data.get("email") ?? "", 254);
    const phone = textField(data.get("phone") ?? "", 32);
    if (!email && !phone) throw new InputError("E-posta veya telefon gerekli.");
    const entry: ContactMessage = { id: randomUUID(), name: textField(data.get("name"), 60, 2), email: email ? emailField(email) : "", phone, subject: textField(data.get("subject") ?? "", 120), message: textField(data.get("message"), 2000, 1), createdAt: new Date().toISOString() };
    await updateJson<ContactMessage[], void>("messages.json", [], current => {
      const retained = current.filter(m => Date.parse(m.createdAt) > Date.now() - 90 * 86400_000);
      if (retained.length >= 10000) throw new InputError("Mesaj kapasitesi dolu. Mağazayı arayabilirsiniz.");
      return { value: [...retained, entry], result: undefined };
    });
    return { success: true };
  } catch (error) { return { error: safeError(error) }; }
}
