import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import BookReviewModel from "@/models/review/book";
import { getBookReviews, getUserId } from "@/app/api/common";
import { LIMIT } from "@/utils/constants";
import { NotFoundContentError } from "@/utils/error";
import { generateId } from "@/utils/common";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id;
    if (!contentId) {
      throw new NotFoundContentError();
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * LIMIT;
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
    const contentId = params.id;
    const requestData = await request.json();

    const { contentInfo, like } = requestData;
    const { content, contentImgUrl, contentTitle } = contentInfo;
    if (!contentId && !content) {
      throw new NotFoundContentError();
    }

    await dbConnect();

    const userId = getUserId();
    const newReview = new BookReviewModel({
      id: generateId(),
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

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
