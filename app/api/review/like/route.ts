import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import { getBookReviews, getUserId } from "../../common";

export async function POST(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const reqeustData = await reqeust.json();
    const { reviewId, contentId } = reqeustData;
    if (!reviewId && !contentId) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const userId = getUserId();
    const newLike = new LikeModel({
      id: Date.now().toString(),
      reviewId,
      contentId,
      userId,
      registDate: new Date(),
    });

    await newLike.save();

    const result = await getBookReviews(contentId, userId);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
