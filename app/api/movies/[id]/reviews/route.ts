import { getStatsText, getUserId, loadUsers } from "@/app/api/common";
import dbConnect from "@/utils/db/mongodb";
import { NotFoundContentError } from "@/utils/error";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import MovieReviewModel from "@/models/review/movie";
import { ERROR_500_MESSAGE, LIMIT, DEFAULT_USER_NAME } from "@/utils/constants";
import { ReviewProps, StatsProps } from "@/types";
import { generateId, replaceDateFormat } from "@/utils/common";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id;
    if (!contentId) {
      throw new NotFoundContentError();
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * LIMIT;
    const result = await getMovieReviews(contentId, offset);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: ERROR_500_MESSAGE, status: 500 });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    dbConnect();

    const contentId = params.id;
    const requestData = await request.json();
    const { content, contentImgUrl, contentTitle, like } = requestData;
    if (!contentId && !content) {
      throw new NotFoundContentError();
    }

    const userId = await getUserId();
    const newReview = new MovieReviewModel({
      id: generateId(),
      contentId,
      content,
      contentImgUrl,
      contentTitle,
      contentLike: like,
      like: false,
      updateDate: new Date(),
      userId,
    });
    await newReview.save();

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE, status: 500 });
}

const getMovieReviews = async (contentId: string, offset: number) => {
  let likeData: any[] | null = null;
  try {
    await getUserId();
    const userId = await getUserId();
    likeData = await LikeModel.find({ userId, contentId });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.name);
    }
  }

  const { data: movieReviewData, total } = await loadMovieReviews(
    contentId,
    offset
  );

  const userData = await loadUsers();
  const reviews = movieReviewData.map((review: ReviewProps) => {
    const author = userData.find((user) => user.id === review.userId);
    const like = likeData?.find((like) => like.reviewId === review.id);
    const contentLike =
      review.contentLike === undefined ? false : review.contentLike;
    const userName = !author ? DEFAULT_USER_NAME : author.name;

    return {
      id: review.id,
      contentId,
      content: review.content,
      contentLike,
      like: !!like,
      updateDate: replaceDateFormat(review.updateDate),
      userName,
      userId: review.userId,
    };
  });

  const stats = await getStatsForReview(contentId);
  return { reviews, count: total, stats };
};

const loadMovieReviews = async (contentId: string, offset: number) => {
  const rowData = await MovieReviewModel.aggregate([
    { $match: { contentId } },
    { $sort: { updateDate: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: offset }, { $limit: LIMIT }],
      },
    },
  ]);

  const result = {
    data: rowData[0].data,
    total: rowData[0].metadata[0] ? rowData[0].metadata[0].total : 0,
  };

  return result;
};

const getStatsForReview = async (contentId: string) => {
  const rowData = await MovieReviewModel.aggregate([
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

  const total = await MovieReviewModel.countDocuments({ contentId });
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
