import "server-only";
import { requireAdmin, type User } from "./auth";
import { readJson } from "./storage";
export async function getAdminMembers() {
  await requireAdmin();
  return (await readJson<User[]>("users.json", [])).map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt, marketingConsent: u.marketingConsent }));
}
