import { replaceDateFormat, verifyData } from "@/utils/common";
import { cookies } from "next/headers";
import BookReviewModel from "@/models/review/book";
import UserModel from "@/models/user";
import LikeModel from "@/models/review/like";
import { BookReviewProps } from "@/utils/types";
import { limit } from "@/utils/constants";

const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;

export const getBookReviews = async (contentId: string, offset: number) => {
  const bookReviews = BookReviewModel;
  const users = UserModel;
  const likes = LikeModel;

  const userId = getUserId();
  const userData = await users.find({ loginService: SERVICE });
  const likeData = await likes.find({ userId, contentId });

  const rowData = await bookReviews.aggregate([
    { $match: { contentId } },
    { $sort: { updateDate: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: offset }, { $limit: limit }],
      },
    },
  ]);

  const bookReviewData = rowData[0].data;
  const reviews = bookReviewData.map((review: BookReviewProps) => {
    const author = userData.find((user) => user.id === review.userId);
    const like = likeData.find((like) => like.reviewId === review.id);
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
  const total: number = rowData[0].metadata[0].total;
  const stats = await getStatsForReview(contentId);

  return { reviews, count: total, stats };
};

const getStatsForReview = async (contentId: string) => {
  const bookReviews = BookReviewModel;
  const rowData = await bookReviews.aggregate([
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

  const total = await bookReviews.countDocuments({ contentId });
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
};

const getStatsText = (like: number) => {
  let result = "대체로 긍정적";

  if (like > 90) {
    result = "압도적으로 긍정적";
  } else if (like > 75) {
    result = "매우 긍정적";
  } else if (like < 10) {
    result = "압도적으로 부정적";
  } else if (like < 25) {
    result = "매우 부정적";
  } else if (like < 50) {
    result = "대체로 부정적";
  } else if (like === 50) {
    result = "복합적";
  }

  return result;
};

export const getUserId = () => {
  const data = getUser();

  const userId = data.id;
  return userId;
};

export const getUserName = () => {
  const user = getUser();

  const userName = user.name;
  return userName;
};

export const getUser = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error();
  }

  const verifyResult = verifyData(token);
  if (typeof verifyResult === "string") {
    throw new Error();
  }

  const user = {
    id: verifyResult.id,
    name: verifyResult.login,
  };
  return user;
};
