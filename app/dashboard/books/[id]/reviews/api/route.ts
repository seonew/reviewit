import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import BookReviewModel from "@/models/review/book";
import { getBookReviews, getUserId } from "@/app/api/common";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    if (!contentId) {
      throw new Error();
    }

    const userId = getUserId();
    const result = await getBookReviews(contentId, userId);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export async function POST(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    const reqeustData = await reqeust.json();

    const { contentInfo, like } = reqeustData;
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
    const result = await getBookReviews(contentId, userId);

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
