import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getBookReviews, getUserId } from "@/app/api/common";
import { BookReviewProps } from "@/utils/types";
import BookReviewModel from "@/models/review/book";
import UserModel from "@/models/user";
import LikeModel from "@/models/review/like";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const userId = getUserId();
    const likes = LikeModel;
    const bookReviews = BookReviewModel;
    const likeData = await likes.find({ userId });

    const result = await Promise.all(
      likeData.map(async (like) => {
        const bookReview: BookReviewProps | null = await bookReviews.findOne({
          id: like.reviewId,
        });

        if (bookReview !== null) {
          return {
            id: bookReview.id,
            content: bookReview.content,
            contentId: bookReview.contentId,
            contentImgUrl: bookReview.contentImgUrl,
            userId: bookReview.userId,
            updateDate: replaceDateFormat(bookReview.updateDate),
          };
        }
      })
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
