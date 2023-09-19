import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import { getBookReviews, getUserId } from "../../common";
import { limit } from "@/utils/constants";

export async function POST(request: Request) {
  try {
    dbConnect();

    const requestData = await request.json();
    const { reviewId, contentId } = requestData;
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
