import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import BookReviewModel from "@/models/review/book";
import { getBookReviews, getUserId } from "@/app/api/common";
import { limit } from "@/utils/constants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    if (!contentId) {
      throw new Error();
    }

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    const requestData = await request.json();

    const { contentInfo, like } = requestData;
    const { content, contentImgUrl, contentTitle } = contentInfo;
    if (!contentId || !content) {
      throw new Error();
    }

    const userId = getUserId();
    const newReview = new BookReviewModel({
      id: Date.now().toString(),
      contentId,
      content,
      contentTitle,
      contentImgUrl,
      contentLike: like,
      like: false,
      updateDate: new Date(),
      userId,
    });
    await newReview.save();

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
