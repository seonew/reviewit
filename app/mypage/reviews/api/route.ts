import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/common";
import { BookReviewProps } from "@/utils/types";
import BookReviewModel from "@/models/review/book";
import { limit } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * limit;

    dbConnect();

    const userId = getUserId();
    const bookReviews = BookReviewModel;
    const rowData = await bookReviews.aggregate([
      { $match: { userId } },
      { $sort: { updateDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: offset }, { $limit: limit }],
        },
      },
    ]);
    const reviewData = rowData[0].data;
    const total = rowData[0].metadata[0].total;

    const reviews = reviewData.map((review: BookReviewProps) => {
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
      myReviews: {
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
