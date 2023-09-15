import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { NextResponse } from "next/server";
import BookReviewModel from "@/models/review/book";
import { getBookReviews, getUserId, getUserName } from "@/app/api/common";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    if (!contentId) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const userId = getUserId();
    const result = await getBookReviews(contentId, userId);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export async function POST(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    const reqeustData = await reqeust.json();
    const { content, like } = reqeustData;

    if (!contentId || !content) {
      throw new Error();
    }

    const userId = getUserId();

    const newReview = new BookReviewModel({
      id: Date.now().toString(),
      contentId,
      content,
      contentLike: like,
      like: false,
      updateDate: new Date(),
      userId,
    });

    await newReview.save();
    const result = await getBookReviews(contentId, userId);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
