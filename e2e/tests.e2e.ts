import { test, expect } from "@/playwright/fixtures";

const QUERY = "사람";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Review-it");
});

test("get started link", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".header-contents > .header-link")).toHaveCount(3);

  await expect(
    page.locator(".banner-container > a.initialize-absolute")
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Movie List" })).toBeVisible();
  await expect(page.locator(".card-list").getByRole("link")).toHaveCount(20);
});

test("go to /search", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("textbox").fill(QUERY);
  await page.locator(".bg-ozip-blue.text-white").getByRole("button").click();

  await expect(page.getByRole("heading", { name: "Movie List" })).toBeVisible();
  await expect(
    page.locator(".card-list > .m-0").nth(0).getByRole("link")
  ).toHaveCount(10);

  await expect(page.getByRole("heading", { name: "Book List" })).toBeVisible();
  await expect(
    page.locator(".card-list > .m-0").nth(1).getByRole("link")
  ).toHaveCount(10);
});

test("go to /search/books", async ({ page }) => {
  await page.goto(`/search/books?query=${QUERY}`);

  await expect(page.getByRole("heading", { name: "Book List" })).toBeVisible();
  await expect(page.locator(".card-list").getByRole("link")).toHaveCount(20);
  await expect(page.getByLabel("Pagination")).toBeVisible();
});

test("go to /search/movies", async ({ page }) => {
  await page.goto(`/search/movies?query=${QUERY}`);

  await expect(page.getByRole("heading", { name: "Movie List" })).toBeVisible();
  await expect(page.locator(".card-list").getByRole("link")).toHaveCount(20);
  await expect(page.getByLabel("Pagination")).toBeVisible();
});
