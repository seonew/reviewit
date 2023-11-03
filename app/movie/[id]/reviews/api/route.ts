import { getStatsText, getUserId, loadUsersForService } from "@/app/api/common";
import dbConnect from "@/utils/db/mongodb";
import { NotFoundContentError } from "@/utils/error";
import { NextResponse } from "next/server";
import LikeModel from "@/models/review/like";
import MovieReviewModel from "@/models/review/movie";
import { limit } from "@/utils/constants";
import { ReviewProps } from "@/utils/types";
import { replaceDateFormat } from "@/utils/common";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const contentId = params.id;
    if (!contentId) {
      throw new NotFoundContentError();
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const offset = (parseInt(page) - 1) * limit;
    const result = await getMovieReviews(contentId, offset);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error", status: 500 });
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
    if (!contentId || !content) {
      throw new NotFoundContentError();
    }

    const userId = getUserId();
    const movies = MovieReviewModel;

    const newReview = new movies({
      id: Date.now().toString(),
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
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

const getMovieReviews = async (contentId: string, offset: number) => {
  const userId = getUserId();
  const isLogin = !userId ? false : true;

  const likes = LikeModel;
  let likeData: any[] | null = null;
  if (isLogin) {
    likeData = await likes.find({ userId, contentId });
  }

  const { data: movieReviewData, total } = await loadMovieReviews(
    contentId,
    offset
  );

  const userData = await loadUsersForService();
  const reviews = movieReviewData.map((review: ReviewProps) => {
    const author = userData.find((user) => user.id === review.userId);
    const like =
      likeData === null
        ? undefined
        : likeData.find((like) => like.reviewId === review.id);
    const contentLike =
      review.contentLike === undefined ? false : review.contentLike;

    return {
      id: review.id,
      contentId,
      content: review.content,
      contentLike,
      like: like ? true : false,
      updateDate: replaceDateFormat(review.updateDate),
      userName: author.name,
      userId: review.userId,
    };
  });

  const stats = await getStatsForReview(contentId);
  return { reviews, count: total, stats };
};

const loadMovieReviews = async (contentId: string, offset: number) => {
  const movieReviews = MovieReviewModel;
  const rowData = await movieReviews.aggregate([
    { $match: { contentId } },
    { $sort: { updateDate: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: offset }, { $limit: limit }],
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
  const movieReviews = MovieReviewModel;
  const rowData = await movieReviews.aggregate([
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

  const total = await movieReviews.countDocuments({ contentId });
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
