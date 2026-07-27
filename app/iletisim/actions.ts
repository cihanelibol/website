"use server";

import { randomUUID } from "crypto";
import { readJson, writeJson } from "@/lib/storage";

export type ContactState = { error?: string; success?: boolean };

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
};

const MESSAGES_FILE = "messages.json";

export async function contactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Ad Soyad zorunludur." };
  if (!email && !phone)
    return { error: "Size dönebilmemiz için e-posta veya telefon bırakın." };
  if (!message) return { error: "Mesajınızı yazmayı unutmayın." };
  if (message.length > 2000)
    return { error: "Mesaj en fazla 2000 karakter olabilir." };

  const messages = await readJson<ContactMessage[]>(MESSAGES_FILE, []);
  messages.push({
    id: randomUUID(),
    name,
    email,
    phone,
    subject,
    message,
    createdAt: new Date().toISOString(),
  });
  await writeJson(MESSAGES_FILE, messages);

  return { success: true };
}
