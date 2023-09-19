import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/common";
import { BookReviewProps } from "@/utils/types";
import BookReviewModel from "@/models/review/book";
import LikeModel from "@/models/review/like";
import UserModel from "@/models/user";
import { limit } from "@/utils/constants";

const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;

export async function GET(request: Request) {
  try {
    dbConnect();

    const userId = getUserId();
    const users = UserModel;
    const userData = await users.find({ loginService: SERVICE });

    const likes = LikeModel;
    const bookReviews = BookReviewModel;

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * limit;

    const rowData = await likes.aggregate([
      { $match: { userId } },
      { $sort: { updateDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: offset }, { $limit: limit }],
        },
      },
    ]);
    const likeData = rowData[0].data;
    const total = rowData[0].metadata[0].total;

    const reviews = await Promise.all(
      likeData.map(async (like: { reviewId: string }) => {
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

    const result = {
      contentLikes: {
        reviews,
        count: total,
      },
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
