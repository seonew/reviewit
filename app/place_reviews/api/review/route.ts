import { replaceDateFormat } from "@/utils/common";
import dbConnect from "@/utils/db/mongodb";
import { NotFoundUserError } from "@/utils/error";
import { NextResponse } from "next/server";
import PlaceReviewModel from "@/models/review/place";
import LocalModel from "@/models/local";
import { getStatsText, loadUserInfo } from "@/app/api/common";
import { LocalPlace } from "@/utils/types";

export async function GET(request: Request) {
  try {
    dbConnect();

    const user = await loadUserInfo();
    if (!user) {
      throw new NotFoundUserError();
    }

    const placeReviews = PlaceReviewModel;
    const reviews = await placeReviews.find({ userId: user.id }).sort({
      updateDate: -1,
    });
    const placeIds = Array.from(
      new Set(reviews.map((review) => review.contentId))
    );
    const locals = LocalModel;
    const localResult = await locals.find({ id: { $in: placeIds } });
    const result = reviews.map((review) => {
      const local = localResult.find((item) => item.id === review.contentId);

      return {
        place: { id: local.id, name: local.name, link: local.link },
        items: {
          reviews: [
            {
              id: review.id,
              content: review.content,
              contentId: review.contentId,
              contentLike: review.contentLike,
              like: review.like,
              userId: review.userId,
              userName: user.name,
              updateDate: replaceDateFormat(review.updateDate),
            },
          ],
        },
      };
    });

    return NextResponse.json({
      data: result,
      locals: localResult,
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
    const locals = LocalModel;
    const localResult = await locals.aggregate([
      {
        $search: {
          index: "localNameSearch",
          text: {
            query: keyword,
            path: "name",
          },
        },
      },
    ]);
    if (!localResult || localResult.length === 0) {
      return NextResponse.json({ data: null, locals: null });
    }
    const result: any = await getReviewsByPlace(user, localResult);

    return NextResponse.json({
      data: result,
      locals: localResult,
    });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

const getReviewsByPlace = async (
  user: { id: string; name: string },
  localResult: LocalPlace[]
) => {
  const reviewResult = localResult.map(async (local) => {
    const reviews = await getPlaceReviews(user, local.id);
    const stats = await getStatsForReview(local.id);

    return {
      place: { id: local.id, name: local.name, link: local.link },
      items: { reviews, count: reviews.length, stats },
    };
  });
  const result = await Promise.all(reviewResult);
  return result;
};

const getPlaceReviews = async (
  user: { id: string; name: string },
  contentId: string
) => {
  const placeReviews = PlaceReviewModel;
  const reviews = await placeReviews
    .find({
      userId: user.id,
      contentId,
    })
    .sort({
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
    };
  });

  return result;
};

const getStatsForReview = async (contentId: string) => {
  const placeReviews = PlaceReviewModel;
  const rowData = await placeReviews.aggregate([
    { $match: { contentId } },
    {
      $group: {
        _id: "$contentLike",
        count: { $sum: 1 },
      },
    },
  ]);

  let likeCount = 0;
  let disLikeCount = 0;

  rowData.map((like) => {
    if (like._id === true) {
      likeCount = like.count;
    } else {
      disLikeCount += like.count;
    }
  });

  const total = await placeReviews.countDocuments({ contentId });
  if (total > 0) {
    const likeResult = (likeCount / total) * 100;
    const disLikeResult = (disLikeCount / total) * 100;
    const textResult = getStatsText(likeResult);

    const stats: any = [
      { id: 1, name: "", value: textResult },
      { id: 2, name: "좋아요", value: `${likeResult.toFixed(2)}%` },
      { id: 3, name: "싫어요", value: `${disLikeResult.toFixed(2)}%` },
    ];

    return stats;
  }

  return null;
};
