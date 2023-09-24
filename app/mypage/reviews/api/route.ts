import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId, loadMyReviews } from "@/app/api/common";
import { BookReviewProps } from "@/utils/types";
import { limit } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const offset = (parseInt(page) - 1) * limit;

  dbConnect();

  const userId = getUserId();
  const isLogin = !userId ? false : true;

  if (!isLogin) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  } else {
    const { data: reviewData, total } = await loadMyReviews(userId, offset);

    try {
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
        reviews,
        count: total,
      };

      return NextResponse.json(result);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  }
}
