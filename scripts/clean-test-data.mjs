// Test verilerini temizler: üyeler, yorumlar, siparişler, adresler.
// Hem Neon json_store hem de lokal data/ dosyaları sıfırlanır.
import { neon } from "@neondatabase/serverless";
import { writeFile, mkdir } from "fs/promises";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil");
  process.exit(1);
}
const sql = neon(url);

const KEYS = ["users.json", "reviews.json", "orders.json", "addresses.json", "activity.json"];
for (const key of KEYS) {
  await sql`
    INSERT INTO json_store (key, data, updated_at)
    VALUES (${key}, '[]'::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET data = '[]'::jsonb, updated_at = now()
  `;
}
await mkdir("data", { recursive: true });
for (const key of KEYS) {
  await writeFile(`data/${key}`, "[]", "utf8");
}
console.log("Temizlendi:", KEYS.join(", "));
