import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import { getUserId } from "@/app/api/common";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { reviewId, contentId } = requestData;
    if (!reviewId && !contentId) {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = getUserId();
    const newLike = new LikeModel({
      id: Date.now().toString(),
      reviewId,
      contentId,
      userId,
      registDate: new Date(),
    });
    await newLike.save();

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    if (!reviewId) {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = getUserId();
    await LikeModel.deleteOne({ reviewId, userId });

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
