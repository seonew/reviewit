import { replaceDateFormat } from "@/utils/common";
import dbConnect from "@/utils/db/mongodb";
import { NotFoundUserError } from "@/utils/error";
import { NextResponse } from "next/server";
import PlaceReviewModel from "@/models/review/place";
import LocalModel from "@/models/local";
import { getStatsText, getUserInfo } from "@/app/api/common";
import { LocalPlace, ReviewProps, StatsProps } from "@/types";
import { LIMIT } from "@/utils/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * LIMIT;

    await dbConnect();

    const result = await getPlaceReviews(offset);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const keyword = await request.json();
    const user = getUserInfo();
    if (!user) {
      throw new NotFoundUserError();
    }

    const localData: LocalPlace[] = await LocalModel.aggregate([
      {
        $match: {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
      },
    ]);
    if (localData.length === 0) {
      return NextResponse.json({ data: null, locals: null });
    }
    const localResult = await getLocals(localData, user.id);
    const result = await getReviewsByPlace(user, localResult);

    return NextResponse.json({
      data: result,
      locals: localResult,
    });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export const getPlaceReviews = async (offset: number) => {
  const user = getUserInfo();
  if (!user) {
    throw new NotFoundUserError();
  }
  const { data: reviewData, total } = await loadMyReviews(user.id, offset);

  const reviews = await PlaceReviewModel.find({ userId: user.id }).sort({
    updateDate: -1,
  });
  const placeIds = Array.from(
    new Set(reviews.map((review) => review.contentId))
  );

  const localData = await LocalModel.find({ id: { $in: placeIds } });
  const localResult = await getLocals(localData, user.id);

  const result: {
    place: { id: string; name: string; link: string | undefined };
    review: ReviewProps;
  }[] = reviewData.map((review: ReviewProps) => {
    const local = localResult.find((item) => item.id === review.contentId) ?? {
      id: "",
      name: "",
      link: "",
    };
    const { id: localId, name, link } = local;
    const { id, content, contentId, contentLike, like, userId, updateDate } =
      review;

    return {
      place: { id: localId, name, link },
      review: {
        id,
        content,
        contentId,
        contentLike,
        like,
        userId,
        userName: user.name,
        updateDate: replaceDateFormat(updateDate),
      },
    };
  });

  return { data: result, locals: localResult, count: total };
};

const getLocals = async (localData: LocalPlace[], userId: string) => {
  const localsReviewCount = await loadMyReviewCountByPlace(userId);
  const localResult: LocalPlace[] = localData.map((local: LocalPlace) => {
    const localReviewCount = localsReviewCount.find(
      (item) => item._id === local.id
    );
    const localCount = localReviewCount?.count;
    const displayReviewCount =
      localCount !== undefined && localCount > 10 ? `10+` : localCount ?? 0;
    return {
      id: local.id,
      name: local.name,
      address: local.address,
      roadAddress: local.roadAddress,
      category: local.category,
      mapx: local.mapx,
      mapy: local.mapy,
      telephone: local.telephone,
      link: local.link,
      displayReviewCount: displayReviewCount.toString(),
    };
  });

  return localResult;
};

const getReviewsByPlace = async (
  user: { id: string; name: string },
  localResult: LocalPlace[]
) => {
  const reviewResult = localResult.map(async (local) => {
    const reviews = await loadPlaceReviews(user, local.id);
    const stats = await loadStatsForReview(local.id);

    return {
      place: { id: local.id, name: local.name, link: local.link },
      items: { reviews, count: reviews.length, stats },
    };
  });
  const result = await Promise.all(reviewResult);
  return result;
};

const loadPlaceReviews = async (
  user: { id: string; name: string },
  contentId: string
) => {
  const reviews = await PlaceReviewModel.find({
    userId: user.id,
    contentId,
  }).sort({
    updateDate: -1,
  });

  const result: ReviewProps[] = reviews.map((review) => {
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

const loadStatsForReview = async (contentId: string) => {
  const rowData = await PlaceReviewModel.aggregate([
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

  rowData.forEach((like) => {
    if (like._id === true) {
      likeCount = like.count;
    } else {
      disLikeCount += like.count;
    }
  });

  const total = await PlaceReviewModel.countDocuments({ contentId });
  if (total > 0) {
    const likeResult = (likeCount / total) * 100;
    const disLikeResult = (disLikeCount / total) * 100;
    const textResult = getStatsText(likeResult);

    const stats: StatsProps[] = [
      { id: 1, displayText: "", percentText: textResult },
      {
        id: 2,
        displayText: "좋아요",
        percentText: `${likeResult.toFixed(2)}%`,
      },
      {
        id: 3,
        displayText: "싫어요",
        percentText: `${disLikeResult.toFixed(2)}%`,
      },
    ];

    return stats;
  }

  return null;
};

const loadMyReviews = async (userId: string, offset: number) => {
  const rowData = await PlaceReviewModel.aggregate([
    { $match: { userId } },
    { $sort: { updateDate: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: offset }, { $limit: LIMIT }],
      },
    },
  ]);

  const result: {
    data: ReviewProps[];
    total: number;
  } = {
    data: rowData[0].data,
    total: rowData[0].metadata[0] ? rowData[0].metadata[0].total : 0,
  };

  return result;
};

const loadMyReviewCountByPlace = async (userId: string) => {
  const result: { _id: string; count: number }[] =
    await PlaceReviewModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$contentId",
          count: { $sum: 1 },
        },
      },
    ]);

  return result;
};