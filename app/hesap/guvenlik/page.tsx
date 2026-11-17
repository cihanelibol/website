import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { logoutAllAction } from "../actions";
export const metadata = { title: "Hesap güvenliği", robots: { index: false, follow: false } };
export default async function SecurityPage() {
  const user = await getProfile(); if (!user) redirect("/giris");
  return <section className="space-y-6">
    <h1 className="text-2xl font-bold">Hesap güvenliği</h1>
    
    <form action={logoutAllAction}><button className="rounded border px-4 py-3">Tüm cihazlardan çıkış yap</button></form>
  </section>;
}
