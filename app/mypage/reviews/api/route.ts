import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/common";
import { BookReviewProps } from "@/utils/types";
import BookReviewModel from "@/models/review/book";
import LikeModel from "@/models/review/like";
import UserModel from "@/models/user";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;
    const userId = getUserId();
    const users = UserModel;
    const userData = await users.find({ loginService: SERVICE });

    const likes = LikeModel;
    const bookReviews = BookReviewModel;
    const likeData = await likes.find({ userId }).sort({ updateDate: -1 });

    const contentLikes = await Promise.all(
      likeData.map(async (like) => {
        const bookReview: BookReviewProps | null = await bookReviews.findOne({
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

    const myReviewData = await bookReviews
      .find({ userId })
      .sort({ updateDate: -1 });
    const myReviews = myReviewData.map((review) => {
      return {
        id: review.id,
        content: review.content,
        contentId: review.contentId,
        contentImgUrl: review.contentImgUrl,
        contentTitle: review.contentTitle,
        userId: review.userId,
        updateDate: replaceDateFormat(review.updateDate),
      };
    });

    const result = {
      contentLikes,
      myReviews,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
