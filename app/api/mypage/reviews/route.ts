import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import { getUserId, loadMyReviews } from "@/app/api/common";
import { ReviewProps } from "@/types";
import { LIMIT } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const offset = (parseInt(page) - 1) * LIMIT;

  await dbConnect();

  try {
    const { reviews, count } = await getMyReviews(offset);
    const result = {
      reviews,
      count,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export const getMyReviews = async (offset: number) => {
  await dbConnect();

  const userId = await getUserId();
  const { data: reviewData, total } = await loadMyReviews(userId, offset);
  const reviews = reviewData.map((review: ReviewProps) => {
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

  return { reviews, count: total };
};
