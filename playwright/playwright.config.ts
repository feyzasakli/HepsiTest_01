import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "https://www.hepsiburada.com",
    headless: true,
    viewport: { width: 1366, height: 768 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    locale: "tr-TR",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },

  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});