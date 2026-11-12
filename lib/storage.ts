import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon, neonConfig, type NeonQueryFunction } from "@neondatabase/serverless";

// A fresh timeout per query; a signal created with the cached client would expire forever.
neonConfig.fetchFunction = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, {
  ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(10_000)]) : AbortSignal.timeout(10_000),
});

let client: NeonQueryFunction<false, false> | undefined;
function relational(file: string) {
  return process.env.STORAGE_BACKEND === "relational" && ["users.json", "orders.json"].includes(file);
}
function database() {
  if (!process.env.DATABASE_URL) return undefined;
  return client ??= neon(process.env.DATABASE_URL);
}
function localPath(file: string) {
  if (!/^[a-z0-9_-]+\.json$/.test(file)) throw new Error("Invalid storage key");
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production");
  return path.join(/* turbopackIgnore: true */ process.env.STORAGE_DIR || path.join(process.cwd(), "data"), file);
}
export async function readJson<T>(file: string, fallback: T): Promise<T> {
  const sql = database();
  if (sql) {
    if (relational(file)) {
      const rows = await sql`SELECT data FROM app_security.read_collection(${file})`;
      if (rows.length !== 1) throw new Error("Relational storage is not initialized");
      return rows[0].data as T;
    }
    const rows = await sql`SELECT data FROM json_store WHERE key = ${file}`;
    return rows.length ? rows[0].data as T : structuredClone(fallback);
  }
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production");
  try { return JSON.parse(await fs.readFile(/* turbopackIgnore: true */ localPath(file), "utf8")) as T; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(fallback);
    throw error;
  }
}
/** Pure callback: may run again after contention. No external side effects here. */
export async function updateJson<T, R>(file: string, fallback: T, change: (current: T) => { value: T; result: R }): Promise<R> {
  const sql = database();
  if (sql) {
    for (let attempt = 0; attempt < 12; attempt++) {
      if (relational(file)) {
        const rows = await sql`SELECT data, revision FROM app_security.read_collection(${file})`;
        if (rows.length !== 1) throw new Error("Relational storage is not initialized");
        const { value, result } = change(rows[0].data as T);
        const changed = await sql`SELECT app_security.replace_collection(${file}, ${rows[0].revision}::bigint, ${JSON.stringify(value)}::jsonb) AS changed`;
        if (changed[0]?.changed === true) return result;
        await new Promise(resolve => setTimeout(resolve, Math.min(100, 5 * 2 ** attempt)));
        continue;
      }
      const rows = await sql`SELECT data, updated_at::text AS revision FROM json_store WHERE key = ${file}`;
      const { value, result } = change(rows.length ? rows[0].data as T : structuredClone(fallback));
      const changed = rows.length
        ? await sql`UPDATE json_store SET data = ${JSON.stringify(value)}::jsonb,
            updated_at = GREATEST(clock_timestamp(), updated_at + interval '1 microsecond')
            WHERE key = ${file} AND updated_at = ${rows[0].revision}::timestamptz RETURNING key`
        : await sql`INSERT INTO json_store (key, data, updated_at)
            VALUES (${file}, ${JSON.stringify(value)}::jsonb, clock_timestamp())
            ON CONFLICT (key) DO NOTHING RETURNING key`;
      if (changed.length) return result;
      await new Promise(resolve => setTimeout(resolve, Math.min(100, 5 * 2 ** attempt)));
    }
    throw new Error("Storage contention; please retry");
  }
  if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production");
  const target = localPath(file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const lock = `${target}.lock`;
  let acquired = false;
  for (let attempt = 0; attempt < 250; attempt++) {
    try { await fs.mkdir(lock); acquired = true; break; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error; }
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  if (!acquired) throw new Error("Local storage is locked");
  const temp = `${target}.${randomUUID()}.tmp`;
  try {
    const { value, result } = change(await readJson(file, fallback));
    await fs.writeFile(temp, JSON.stringify(value), { mode: 0o600 });
    await fs.rename(temp, target);
    return result;
  } finally {
    await fs.rm(temp, { force: true });
    await fs.rmdir(lock);
  }
}
