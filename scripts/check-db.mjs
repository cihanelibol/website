// Neon json_store tablosunu doğrular; yoksa oluşturur (tek seferlik kurulum)
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL tanımlı değil");
  process.exit(1);
}
const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS json_store (
    key text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;
const rows = await sql`SELECT key, jsonb_array_length(data) AS adet FROM json_store ORDER BY key`;
console.log("json_store hazır. Kayıtlar:", rows.length ? rows : "(boş)");
