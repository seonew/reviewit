import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import { getBookReviews, getUserId } from "@/app/api/common";
import { limit } from "@/utils/constants";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const reviewId = params.id;
    if (!reviewId) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const userId = getUserId();
    const likes = LikeModel;
    const like = await likes.findOne({ reviewId, userId });
    const contentId = like.contentId;
    await likes.deleteOne({ reviewId, userId });

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * limit;
    const result = await getBookReviews(contentId, offset);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
