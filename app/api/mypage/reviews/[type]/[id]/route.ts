import dbConnect from "@/utils/db/mongodb";
import { NextResponse } from "next/server";
import { getUserId } from "@/app/api/common";
import BookReviewModel from "@/models/review/book";
import MovieReviewModel from "@/models/review/movie";
import likeModel from "@/models/review/like";
import { ReviewProps } from "@/types";
import { replaceDateFormat } from "@/utils/common";
import { ERROR_500_MESSAGE } from "@/utils/constants";

export async function PATCH(request: Request) {
  try {
    const requestData = await request.json();
    const { id, content, contentLike, type } = requestData;
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

    let modifiedReview: ReviewProps = {
      id: "",
      content: "",
      contentId: "",
      type: "",
      userId: "",
      updateDate: "",
    };
    if (type === "book") {
      const review = await BookReviewModel.findOne({ id, userId });
      await review.updateOne(params);

      modifiedReview = {
        id,
        content,
        contentLike,
        contentId: review.contentId,
        contentImgUrl: review.contentImgUrl,
        type,
        userId,
        updateDate: replaceDateFormat(params.updateDate.toString()),
      };
    } else if (type === "movie") {
      const review = await MovieReviewModel.findOne({ id, userId });
      await review.updateOne(params);

      modifiedReview = {
        id,
        content,
        contentLike,
        contentId: review.contentId,
        contentImgUrl: review.contentImgUrl,
        type,
        userId,
        updateDate: replaceDateFormat(params.updateDate.toString()),
      };
    }

    return NextResponse.json(modifiedReview);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE }, { status: 500 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { id: reviewId, type } = params;
    if (!reviewId) {
      return NextResponse.json({ error: "Empty data", status: 400 });
    }

    await dbConnect();

    const userId = await getUserId();
    if (type === "book") {
      await BookReviewModel.deleteOne({ id: reviewId, userId });
    } else if (type === "movie") {
      await MovieReviewModel.deleteOne({ id: reviewId, userId });
    }

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
  return NextResponse.json({ error: ERROR_500_MESSAGE, status: 500 });
}
