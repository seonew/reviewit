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

    const bookId = params.id;
    if (!bookId) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const userId = getUserId();
    const result = await getBookReviews(bookId, userId);

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

    const bookId = params.id;
    const reqeustData = await reqeust.json();
    const { content } = reqeustData;

    if (!content) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const userId = getUserId();
    const userName = getUserName();

    const newReview = new BookReviewModel({
      id: Date.now().toString(),
      bookId,
      content,
      bookLike: false,
      like: false,
      updateDate: new Date(),
      userId,
    });

    const res = await newReview.save();
    const result = {
      id: res.id,
      bookId: res.bookId,
      content: res.content,
      like: res.like,
      bookLike: res.bookLike,
      updateDate: replaceDateFormat(res.updateDate),
      userName: userName,
      userId: userId,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
