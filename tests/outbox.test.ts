import { it, expect, vi } from "vitest";
import { reserveOrder, markOrderSubmission } from "../lib/orders";
import { dispatchOrderNotifications, type Notification } from "../lib/order-outbox";
import { readJson, updateJson } from "../lib/storage";
import { POST } from "../app/api/internal/notifications/route";

type Row = { id: string; notifications: Notification[] };
async function queued() {
  vi.stubEnv("ADMIN_EMAILS", "operator@example.test");
  const { order } = await reserveOrder({ userId: null, customerName: "<script>test</script>", email: "buyer@example.test", phone: "5555555555", addressText: "Synthetic address", items: [{ id: 1, name: "Test", qty: 1, price: 10 }], total: 10, paymentMethod: "iyzico-bekliyor", paymentStatus: "beklemede" }, "test-key", "test-fingerprint");
  await markOrderSubmission(order.id, "sent", { reference: "ET-1", total: 10, currency: "TRY" });
  return order.id;
}
function mailProvider() {
  vi.stubEnv("RESEND_API_KEY", "synthetic-test-key");
  const send = vi.fn(async () => Response.json({ id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" }));
  vi.stubGlobal("fetch", send); return send;
}
it("commits notifications with acknowledgement and excludes them from the customer DTO", async () => {
  const id = await queued();
  await markOrderSubmission(id, "sent", { reference: "ET-1", total: 10, currency: "TRY" });
  const rows = await readJson<Row[]>("orders.json", []);
  expect(rows[0].notifications).toHaveLength(2);
  expect(rows[0].notifications[0].message.html).toContain("&lt;script&gt;");
  const retry = await reserveOrder({} as never, "test-key", "test-fingerprint");
  expect(retry.order).not.toHaveProperty("notifications");
});
it("multiple workers claim each message once and freeze the payload", async () => {
  await queued(); const send = mailProvider();
  await Promise.all(Array.from({ length: 4 }, () => dispatchOrderNotifications(undefined, 1)));
  expect(send).toHaveBeenCalledTimes(2);
  const keys = send.mock.calls.map(call => (call as unknown as [string, RequestInit])[1].headers as Record<string, string>);
  expect(new Set(keys.map(h => h["Idempotency-Key"])).size).toBe(2);
  expect((await readJson<Row[]>("orders.json", []))[0].notifications.every(n => n.state === "sent")).toBe(true);
});
it("mail timeout keeps the order and retries with the identical provider key and sender", async () => {
  const id = await queued(); const send = mailProvider(); send.mockRejectedValueOnce(new Error("timeout"));
  expect((await dispatchOrderNotifications(id, 1)).deferred).toBe(1);
  const first = (send.mock.calls[0] as unknown as [string, RequestInit])[1];
  vi.stubEnv("MAIL_FROM", "Changed <changed@example.test>");
  await updateJson<Row[], void>("orders.json", [], rows => { rows[0].notifications[0].nextAttempt = 0; return { value: rows, result: undefined }; });
  await dispatchOrderNotifications(id, 1);
  const second = (send.mock.calls[1] as unknown as [string, RequestInit])[1];
  expect(second.body).toEqual(first.body); expect(second.headers).toEqual(first.headers);
  expect(await readJson("orders.json", [])).toHaveLength(1);
});
it("never retries beyond the provider deduplication window or attempt limit", async () => {
  const id = await queued(); const send = mailProvider();
  await updateJson<Row[], void>("orders.json", [], rows => {
    rows[0].notifications[0].firstAttempt = Date.now() - 24 * 3600_000;
    rows[0].notifications[1].attempts = 6;
    return { value: rows, result: undefined };
  });
  await dispatchOrderNotifications(id);
  expect(send).not.toHaveBeenCalled();
  expect((await readJson<Row[]>("orders.json", []))[0].notifications.every(n => n.state === "failed")).toBe(true);
});
it("preserves queued messages without credentials and rejects forged worker access", async () => {
  await queued(); expect((await dispatchOrderNotifications()).sent).toBe(0);
  expect((await readJson<Row[]>("orders.json", []))[0].notifications[0].attempts).toBe(0);
  vi.stubEnv("CRON_SECRET", "s".repeat(40));
  expect((await POST(new Request("https://test.example/api/internal/notifications", { method: "POST" }))).status).toBe(401);
  expect((await POST(new Request("https://test.example/api/internal/notifications", { method: "POST", headers: { Authorization: "Bearer " + "s".repeat(40) } }))).status).toBe(200);
});
