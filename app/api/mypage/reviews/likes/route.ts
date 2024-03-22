import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId, loadLikesForReview, loadUsers } from "@/app/api/common";
import { ReviewDataProps, ReviewProps } from "@/types";
import BookReviewModel from "@/models/review/book";
import { LIMIT } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * LIMIT;

    const { reviews, count } = await getLikesForReviews(offset);
    const result: ReviewDataProps = {
      reviews,
      count,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export const getLikesForReviews = async (offset: number) => {
  await dbConnect();

  const userId = await getUserId();
  const { data: likeData, total } = await loadLikesForReview(userId, offset);
  const userData = await loadUsers();

  const reviews: ReviewProps[] = await Promise.all(
    likeData.map(async (like: { reviewId: string }) => {
      const bookReview: ReviewProps | null = await BookReviewModel.findOne({
        id: like.reviewId,
      });

      if (bookReview !== null) {
        const author = userData.find((user) => user.id === bookReview.userId);
        const userName = !author ? "홍길동" : author.name;

        return {
          id: bookReview.id,
          content: bookReview.content,
          contentId: bookReview.contentId,
          contentImgUrl: bookReview.contentImgUrl,
          contentTitle: bookReview.contentTitle,
          like: true,
          userId: bookReview.userId,
          userName,
          updateDate: replaceDateFormat(bookReview.updateDate),
        };
      }
    })
  );

  return { reviews, count: total };
};
