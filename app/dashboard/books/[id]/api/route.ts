import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import { BookReviewProps, User } from "@/utils/types";
import { NextResponse } from "next/server";
import BookReviewModel from "@/models/review/book";
import UserModel from "@/models/user";

const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const bookId = params.id;
    const bookReviews = BookReviewModel;
    const reviewData: BookReviewProps[] = await bookReviews
      .find({ bookId })
      .sort({ updateDate: -1 });
    const users = UserModel;
    const userData = await users.find({ loginService: SERVICE });

    if (!reviewData) {
      return NextResponse.json({ reviews: null, count: 0 });
    }

    const reviews: BookReviewProps[] = reviewData.map(
      (review: BookReviewProps) => {
        const user = userData.find((user: User) => user.id === review.userId);
        return {
          id: review.id,
          bookId,
          content: review.content,
          bookLike: false,
          like: false,
          updateDate: replaceDateFormat(review.updateDate),
          userName: user.name,
          userId: review.userId,
          loginType: user.loginType,
          avatarUrl: user.avatarUrl,
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
  try {
    dbConnect();

    const bookId = params.id;
    const reqeustData = await reqeust.json();
    const { user, content } = reqeustData;

    if (!content) {
      return NextResponse.json({ error: "Empty data", status: 500 });
    }

    const newReview = new BookReviewModel({
      id: Date.now().toString(),
      bookId,
      content,
      bookLike: false,
      like: false,
      updateDate: new Date(),
      userId: user.id,
    });

    const res = await newReview.save();
    const result = {
      id: res.id,
      bookId: res.bookId,
      content: res.content,
      like: res.like,
      bookLike: res.bookLike,
      updateDate: replaceDateFormat(res.updateDate),
      userName: user.name,
      userId: user.id,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
