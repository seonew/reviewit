import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import {
  getUserId,
  loadLikesForReview,
  loadUsersForService,
} from "@/app/api/common";
import { ReviewProps } from "@/utils/types";
import BookReviewModel from "@/models/review/book";
import { limit } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * limit;

    const userId = getUserId();
    const { data: likeData, total } = await loadLikesForReview(userId, offset);
    const userData = await loadUsersForService();

    const bookReviews = BookReviewModel;
    const reviews = await Promise.all(
      likeData.map(async (like: { reviewId: string }) => {
        const bookReview: ReviewProps | null = await bookReviews.findOne({
          id: like.reviewId,
        });

        if (bookReview !== null) {
          const author = userData.find((user) => user.id === bookReview.userId);

          return {
            id: bookReview.id,
            content: bookReview.content,
            contentId: bookReview.contentId,
            contentImgUrl: bookReview.contentImgUrl,
            contentTitle: bookReview.contentTitle,
            userId: bookReview.userId,
            userName: author.name,
            updateDate: replaceDateFormat(bookReview.updateDate),
          };
        }
      })
    );

    const result = {
      reviews,
      count: total,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
