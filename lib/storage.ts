// Basit JSON belge deposu - yorumlar ve üyeler için.
// DATABASE_URL tanımlıysa Neon Postgres'teki json_store tablosunu (key -> jsonb),
// tanımlı değilse (yerel geliştirme yedeği) data/ altındaki JSON dosyalarını kullanır.
// Tüm okuma/yazma bu iki fonksiyondan geçer.

import { promises as fs } from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const DATA_DIR = path.join(process.cwd(), "data");

// Bağlantı, build sırasında modül yüklenirken değil ilk sorguda kurulur
let _sql: ReturnType<typeof neon> | null = null;

function sql() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql;
}

function useDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (useDb()) {
    const rows = (await sql()`
      SELECT data FROM json_store WHERE key = ${file}
    `) as { data: T }[];
    return rows.length > 0 ? rows[0].data : fallback;
  }
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(file: string, data: unknown): Promise<void> {
  if (useDb()) {
    await sql()`
      INSERT INTO json_store (key, data, updated_at)
      VALUES (${file}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE
        SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
    `;
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}
