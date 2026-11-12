import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/http", fullyParallel: false, retries: 0,
  use: { baseURL: "http://127.0.0.1:3107" },
  webServer: { command: `"${process.execPath}" scripts/isolated-server.mjs`, url: "http://127.0.0.1:3107/giris", reuseExistingServer: false, timeout: 30_000 },
});
