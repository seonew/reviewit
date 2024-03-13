import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL!;
const authPath = process.env.USER_INFO_PATH!;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "*.e2e.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: baseUrl,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: authPath },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: authPath },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], storageState: authPath },
    },
  ],
});
