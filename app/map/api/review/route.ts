import { replaceDateFormat } from "@/utils/common";
import dbConnect from "@/utils/db/mongodb";
import { NotFoundUserError } from "@/utils/error";
import { NextResponse } from "next/server";
import PlaceReviewModel from "@/models/review/place";
import LocalModel from "@/models/local";
import { loadUserInfo } from "@/app/api/common";

export async function GET(request: Request) {
  try {
    dbConnect();

    const user = await loadUserInfo();
    if (!user) {
      throw new NotFoundUserError();
    }

    const reviews = await PlaceReviewModel.find({ userId: user.id }).sort({
      updateDate: -1,
    });
    const placeIds = Array.from(
      new Set(reviews.map((review) => review.contentId))
    );
    const locals = await LocalModel.find({ id: { $in: placeIds } });
    const result = reviews.map((review) => {
      const local = locals.find((item) => item.id === review.contentId);

      return {
        id: review.id,
        content: review.content,
        contentId: review.contentId,
        contentLike: review.contentLike,
        like: review.like,
        userId: review.userId,
        userName: user.name,
        updateDate: replaceDateFormat(review.updateDate),
        localName: local.name,
        localLink: local.link,
      };
    });

    return NextResponse.json({
      reviews: result,
      count: result.length,
      locals,
    });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export async function POST(request: Request) {
  dbConnect();

  const keyword = await request.json();
  const user = await loadUserInfo();
  if (!user) {
    throw new NotFoundUserError();
  }

  try {
    const local = await LocalModel.findOne({ name: keyword });
    if (!local) {
      return NextResponse.json({ reviews: null, count: 0, locals: null });
    }

    const reviews = await PlaceReviewModel.find({
      userId: user.id,
      contentId: local.id,
    }).sort({
      updateDate: -1,
    });
    const result = reviews.map((review) => {
      return {
        id: review.id,
        content: review.content,
        contentId: review.contentId,
        contentLike: review.contentLike,
        like: review.like,
        userId: review.userId,
        userName: user.name,
        updateDate: replaceDateFormat(review.updateDate),
        localName: local.name,
        localLink: local.link,
      };
    });

    return NextResponse.json({
      reviews: result,
      count: result.length,
      locals: [local],
    });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
