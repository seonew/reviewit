import { test, expect } from "@/playwright/fixtures";

test.describe(() => {
  test("go to mypage", async ({ page }, testInfo) => {
    await page.goto("/mypage");

    await expect(
      page.getByRole("heading", { name: "My Book List" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "설정" })).toBeVisible();

    const reviewButton = page.getByRole("link", { name: "내가 작성한 리뷰" });
    await expect(reviewButton).toBeVisible();
    await page.getByRole("link", { name: "내가 작성한 리뷰" }).click();

    await expect(page).toHaveURL("http://localhost:3000/mypage/reviews");
    testInfo.setTimeout(5000);
    await expect(
      page.locator(".tab-active").getByText("내가 작성한 리뷰")
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "좋아요 누른 리뷰" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "My Reviews" })
    ).toBeVisible();

    await page.getByRole("link", { name: "좋아요 누른 리뷰" }).click();
    await expect(page).toHaveURL("http://localhost:3000/mypage/reviews/likes");
    testInfo.setTimeout(5000);
    await expect(
      page.locator(".tab-active").getByText("좋아요 누른 리뷰")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Likes" })).toBeVisible();
  });
});
