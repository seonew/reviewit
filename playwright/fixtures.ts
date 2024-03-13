import { test as baseTest } from "@playwright/test";
import fs from "fs";
import path from "path";

const loginUrl = process.env.LOGIN_URL!;
const loginRedirectUrl = process.env.LOGIN_REDIRECT_URL!;
const userName = process.env.TEST_USER_NAME!;
const userPassword = process.env.TEST_USER_PASSWORD!;
const authPath = process.env.USER_INFO_PATH!;

export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      const fileName = path.resolve(authPath);
      if (fs.existsSync(fileName)) {
        await use(fileName);
        return;
      }

      const page = await browser.newPage({ storageState: undefined });

      await page.goto(loginUrl);
      await page.getByRole("link").nth(2).click();

      await page.getByLabel("Username or email address").fill(userName);
      await page.getByLabel("Password").fill(userPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL(loginRedirectUrl);
      await page.waitForLoadState("domcontentloaded");

      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});
