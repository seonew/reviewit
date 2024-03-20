import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/common";
import BookReviewModel from "@/models/review/book";
import likeModel from "@/models/review/like";
import { ReviewProps } from "@/types";
import { replaceDateFormat } from "@/utils/common";

export async function PATCH(request: Request) {
  try {
    const requestData = await request.json();
    const { id, content, contentLike } = requestData;
    if (id === "" && content === "") {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = await getUserId();
    const params: {
      content: string;
      contentLike: boolean;
      updateDate?: Date;
    } = { content, contentLike };
    params.updateDate = new Date();

    const review = await BookReviewModel.findOne({ id, userId });
    await review.updateOne(params);

    const modifiedReview: ReviewProps = {
      id,
      content,
      contentLike,
      contentId: review.contentId,
      contentImgUrl: review.contentImgUrl,
      userId,
      updateDate: replaceDateFormat(params.updateDate.toString()),
    };

    return NextResponse.json(modifiedReview);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    await BookReviewModel.deleteOne({ id: reviewId, userId });

    const likedReview = await likeModel.findOne({
      reviewId,
      userId,
    });
    if (likedReview) {
      await likedReview.deleteOne();
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
