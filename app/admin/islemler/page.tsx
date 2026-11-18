import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
// Uzlaştırma ve tahsilat artık doğrudan sipariş kartlarında yapılıyor.
export default async function OperationsPage() {
  await requireAdmin();
  redirect("/admin?filtre=kontrol");
}
