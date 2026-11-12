import { it, expect } from "vitest";
import { POST } from "../app/api/csp-report/route";
import { readJson } from "../lib/storage";
it("persists bounded CSP metadata without URL tokens, samples or message bodies", async () => {
  const response = await POST(new Request("https://test.example/api/csp-report", { method: "POST", headers: { Origin: "https://test.example", "Content-Type": "application/csp-report" }, body: JSON.stringify({ "csp-report": { "effective-directive": "script-src", "document-uri": "https://test.example?token=private", "script-sample": "private" } }) }));
  expect(response.status).toBe(204);
  const records = await readJson<{ event: string; requestId: string }[]>(`audit-${new Date().toISOString().slice(0, 10)}.json`, []);
  expect(records[0].event).toBe("csp.script-src"); expect(records[0].requestId).toHaveLength(36);
  expect(JSON.stringify(records)).not.toContain("private");
  expect((await POST(new Request("https://test.example/api/csp-report", { method: "POST", headers: { Origin: "https://attacker.invalid" } }))).status).toBe(403);
});
