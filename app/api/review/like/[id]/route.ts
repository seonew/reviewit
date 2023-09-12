import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import { getBookReviews, getUserId } from "@/app/api/common";

export async function DELETE(
  reqeust: Request,
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
    const bookId = like.contentId;

    await likes.deleteOne({ reviewId, userId });

    const result = await getBookReviews(bookId, userId);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
