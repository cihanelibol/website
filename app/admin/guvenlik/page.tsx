import { getSecurityAudit } from "@/lib/audit-data";
import { getNotificationFailures } from "@/lib/order-outbox";
export default async function SecurityAuditPage() {
  const [events, notifications] = await Promise.all([getSecurityAudit(), getNotificationFailures()]);
  return <section className="space-y-4"><h2 className="text-xl font-semibold">Güvenlik olayları</h2>
    <p>Son 7 gündeki en yeni 200 olay. Kullanıcı davranış kayıtlarından ayrı tutulur.</p>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Zaman</th><th>Olay</th><th>Sonuç</th><th>Aktör / hedef</th><th>İstek kimliği</th></tr></thead>
      <tbody>{events.map(event => <tr key={event.eventId}><td>{event.at}</td><td>{event.event}</td><td>{event.outcome}</td><td>{event.actor ?? "anonim"} / {event.target ?? "—"}</td><td>{event.requestId}</td></tr>)}</tbody>
    </table></div>
    <h2 className="text-xl font-semibold">Bekleyen bildirimler</h2>
    <p>Süresi dolan veya 6 denemede gönderilemeyen bildirimler inceleme bekler. Yeniden sipariş oluşturmayın.</p>
    <ul>{notifications.map(n => <li key={n.id}>{n.orderId} — {n.state === "failed" ? "İnceleme gerekli" : "Gönderim bekliyor"} — {n.attempts} deneme</li>)}</ul>
  </section>;
}
