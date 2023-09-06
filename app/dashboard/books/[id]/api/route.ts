import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { BookReviewProps } from "@/utils/types";
import { NextResponse } from "next/server";
import BookReview from "@/schemas/review/book";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  dbConnect();

  try {
    const bookReviews = BookReview;
    const reviewData: BookReviewProps[] = await bookReviews
      .find({ bookId })
      .sort({ updateDate: -1 });

    if (!reviewData) {
      return NextResponse.json({ reviews: null, count: 0 });
    }

    const reviews: BookReviewProps[] = reviewData.map(
      (review: BookReviewProps) => {
        return {
          id: review.id,
          bookId,
          content: review.content,
          bookLike: false,
          like: false,
          updateDate: replaceDateFormat(review.updateDate),
          userName: review.userName,
          userId: review.userId,
          loginType: review.loginType,
          avatarUrl: review.avatarUrl,
        };
      }
    );

    const result = {
      reviews,
      count: reviews.length,
    };

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
  const bookId = params.id;
  dbConnect();

  try {
    const reqeustData = await reqeust.json();
    const { user, content } = reqeustData;

    if (!content) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const newReview = new BookReview({
      id: Date.now().toString(),
      bookId,
      content,
      bookLike: false,
      like: false,
      updateDate: new Date(),
      userName: user.name,
      userId: user.id,
      loginType: user.loginType,
      avatarUrl: user.avatarUrl,
    });

    const res = await newReview.save();
    const result = {
      id: res.id,
      bookId: res.bookId,
      content: res.content,
      like: res.like,
      bookLike: res.bookLike,
      updateDate: replaceDateFormat(res.updateDate),
      userName: res.userName,
      userId: res.userId,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
