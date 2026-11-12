import "server-only";
import { requireAdmin } from "./auth";
import { readJson } from "./storage";
export type AuditEvent = { eventId: string; requestId: string; event: string; actor?: string; target?: string; outcome: string; at: string };
export async function getSecurityAudit() {
  await requireAdmin();
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10));
  const events = await Promise.all(days.map(day => readJson<AuditEvent[]>(`audit-${day}.json`, [])));
  return events.flat().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 200);
}
