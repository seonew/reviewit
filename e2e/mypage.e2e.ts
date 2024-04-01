import { test, expect } from "@/playwright/fixtures";

const BASE_URL = process.env.BASE_URL;
const TEST_CONTENT_TEXT = "review e2e test";
const EDITED_CONTENT_TEXT = `${TEST_CONTENT_TEXT} edit`;

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

    await expect(page).toHaveURL(`${BASE_URL}/mypage/reviews`);
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
    await expect(page).toHaveURL(`${BASE_URL}/mypage/reviews/likes`);
    testInfo.setTimeout(5000);
    await expect(
      page.locator(".tab-active").getByText("좋아요 누른 리뷰")
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Likes" })).toBeVisible();
  });
});

test.describe(() => {
  test("adding a review", async ({ page }, testInfo) => {
    await page.goto("/books/9791190061322");

    await page.locator(".comment-editor-contents-editable").fill("test");
    await page.getByRole("button", { name: "입력" }).click();

    await expect(
      page
        .locator("div.relative.bg-white > div.bg-white")
        .getByText("입력 내용은 최소 10글자 이상이어야 합니다.")
    ).toBeVisible();
    await page
      .locator("div.relative.bg-white")
      .getByRole("button", { name: "Confirm" })
      .click();

    await page
      .locator(".comment-editor-contents-editable")
      .fill(TEST_CONTENT_TEXT);
    await page.getByRole("button", { name: "입력" }).click();

    testInfo.setTimeout(5000);
    await expect(
      page.locator("li").first().locator(".content-detail-comment-user-p")
    ).toHaveText(TEST_CONTENT_TEXT);
  });

  test("editing a review", async ({ page }, testInfo) => {
    await page.goto("/mypage/reviews");
    const firstElement = page.locator("li").first();

    await expect(firstElement.locator("svg").first()).toHaveCSS(
      "color",
      "rgb(56, 189, 248)"
    );
    await expect(firstElement.getByRole("button")).toHaveCount(2);
    await firstElement.getByRole("button").first().click();

    await expect(page.locator(".relative.bg-white > .bg-white")).toBeVisible();
    await expect(
      page.getByText("콘텐츠에 대한 선호도를 선택해 주세요")
    ).toBeVisible();
    await expect(page.getByRole("radio", { name: "좋아요" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "싫어요" })).toBeVisible();

    await expect(
      page.locator(".content-detail-comment-user-icon")
    ).toBeVisible();
    await expect(
      page
        .locator(".comment-editor-contents-editable")
        .filter({ hasText: TEST_CONTENT_TEXT })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "입력" })).toBeVisible();

    await page
      .locator(".comment-editor-contents-editable")
      .fill(EDITED_CONTENT_TEXT);
    await page.getByRole("button", { name: "입력" }).click();

    testInfo.setTimeout(5000);
    await page.goto("/mypage/reviews");
    await expect(
      page.locator("li").first().locator(".text-sm.leading-6")
    ).toHaveText(EDITED_CONTENT_TEXT);
  });

  test("deleting a review", async ({ page }, testInfo) => {
    await page.goto("/mypage/reviews");

    await expect(
      page.locator("li").first().locator(".text-sm.leading-6")
    ).toHaveText(EDITED_CONTENT_TEXT);
    await page.locator("li").first().getByRole("button").nth(1).click();

    await expect(
      page
        .locator("div > .relative.bg-white")
        .filter({ hasText: "해당 리뷰를 삭제하시겠습니까?" })
    ).toBeVisible();

    await page
      .locator("div > .relative.bg-white")
      .getByRole("button", { name: "Confirm" })
      .click();

    testInfo.setTimeout(5000);
    await expect(
      page
        .locator("li")
        .first()
        .locator(".text-sm.leading-6")
        .getByText(EDITED_CONTENT_TEXT)
    ).not.toBeVisible();
  });
});
