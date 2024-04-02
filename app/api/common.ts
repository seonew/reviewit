import { replaceDateFormat } from "@/utils/common";
import { verifyAccessToken } from "coco-people-auth/server";
import { cookies } from "next/headers";
import BookReviewModel from "@/models/review/book";
import UserModel from "@/models/user";
import LikeModel from "@/models/review/like";
import BookmarkModel from "@/models/bookmark";
import MovieReviewModel from "@/models/review/movie";
import { LikedContent, ReviewProps, StatsProps, User } from "@/types";
import { DETAIL_BOOK_PATH, LIMIT } from "@/utils/constants";
import { UnauthorizedError } from "@/utils/error";
import dbConnect from "@/utils/db/mongodb";

type bookmarkType = {
  contentId: string;
  contentImgUrl: string;
  contentTitle: string;
  contentType: string;
};

export const getLikesForReviews = async (offset: number) => {
  await dbConnect();

  const userId: string = await getUserId();
  const { data: likeData, total } = await loadLikesForReview(userId, offset);
  const userData: User[] = await loadUsers();

  const reviews: ReviewProps[] = await Promise.all(
    likeData.map(async (like: { reviewId: string }) => {
      const bookReview: ReviewProps | null = await BookReviewModel.findOne({
        id: like.reviewId,
      });
      const movieReview: ReviewProps | null = await MovieReviewModel.findOne({
        id: like.reviewId,
      });

      if (bookReview) {
        const type = "book";
        return getLikedReviewObject(userData, bookReview, type);
      } else if (movieReview) {
        const type = "movie";
        return getLikedReviewObject(userData, movieReview, type);
      }
    })
  );

  return { reviews, count: total };
};

const getLikedReviewObject = (
  userData: User[],
  currentReview: ReviewProps,
  type: string
) => {
  const author = userData.find((user) => user.id === currentReview?.userId);
  const userName = !author ? "홍길동" : author.name;

  return {
    id: currentReview.id,
    content: currentReview.content,
    contentId: currentReview.contentId,
    contentImgUrl: currentReview.contentImgUrl,
    contentTitle: currentReview.contentTitle,
    type,
    like: true,
    userId: currentReview.userId,
    userName,
    updateDate: replaceDateFormat(currentReview.updateDate),
  };
};

export const getMyReviews = async (page: number) => {
  await dbConnect();

  const userId = await getUserId();
  const bookReviews: ReviewProps[] = await BookReviewModel.find({
    userId,
  }).lean();
  const movieReviews: ReviewProps[] = await MovieReviewModel.find({
    userId,
  }).lean();

  const bookReviewsWithType = bookReviews.map((review: ReviewProps) => ({
    ...review,
    type: "book",
  }));
  const movieReviewsWithType = movieReviews.map((review: ReviewProps) => ({
    ...review,
    type: "movie",
  }));

  const combinedResults: ReviewProps[] = [
    ...bookReviewsWithType,
    ...movieReviewsWithType,
  ];
  const sortedReviews = combinedResults.sort(
    (a, b) =>
      new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
  );
  const total = combinedResults.length;

  const startIndex = (page - 1) * LIMIT;
  const endIndex = startIndex + LIMIT;
  const paginatedResults = sortedReviews.slice(startIndex, endIndex);

  const reviews = paginatedResults.map((review: ReviewProps) => {
    return {
      id: review.id,
      content: review.content,
      contentId: review.contentId,
      contentLike: review.contentLike ?? false,
      contentImgUrl: review.contentImgUrl,
      contentTitle: review.contentTitle,
      type: review.type,
      userId: review.userId,
      updateDate: replaceDateFormat(review.updateDate),
    };
  });

  return { reviews, count: total };
};

export const getUserBookmarks = async (contentType: string) => {
  let bookmarks: bookmarkType[] | null = null;
  try {
    await dbConnect();

    const userId = await getUserId();
    bookmarks = await BookmarkModel.find({ contentType, userId }).sort({
      registerDate: -1,
    });
  } catch (err) {}

  const result: LikedContent[] | undefined = bookmarks?.map((bookmark) => {
    const { contentId, contentImgUrl, contentTitle, contentType } = bookmark;
    return {
      id: contentId,
      imgUrl: contentImgUrl,
      title: contentTitle,
      type: contentType,
      link: `${DETAIL_BOOK_PATH}/${contentId}`,
    };
  });
  return result === undefined ? null : result;
};

export const isBookmarked = async (contentType: string, contentId: string) => {
  const userId = await getUserId();
  const bookmark = await BookmarkModel.findOne({
    contentType,
    contentId,
    userId,
  });

  return !bookmark ? false : true;
};

export const getBookReviews = async (contentId: string, offset: number) => {
  let userId = null;
  try {
    userId = await getUserId();
  } catch (error) {}

  let likeData: any[] | null = null;
  if (userId) {
    likeData = await LikeModel.find({ userId, contentId });
  }

  const { data: bookReviewData, total } = await loadBookReviews(
    contentId,
    offset
  );

  const userData = await loadUsers();
  const reviews = bookReviewData.map((review: ReviewProps) => {
    const author = userData.find((user) => user.id === review.userId);
    const like = likeData?.find((like) => like.reviewId === review.id);
    const contentLike =
      review.contentLike === undefined ? false : review.contentLike;
    const userName = !author ? "홍길동" : author.name;

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

const getStatsForReview = async (contentId: string) => {
  const rowData = await BookReviewModel.aggregate([
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

  const total = await BookReviewModel.countDocuments({ contentId });
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

export const getStatsText = (like: number) => {
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

export const loadBookReviews = async (contentId: string, offset: number) => {
  const rowData = await BookReviewModel.aggregate([
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

export const loadBookInfo = async (id: string) => {
  const dIsbn = id;
  const clientId = process.env.CLIENT_ID ?? "";
  const clientSecret = process.env.CLIENT_SECRET ?? "";
  const bookRequestUrl = "https://openapi.naver.com/v1/search/book_adv?d_isbn=";
  const headers = {
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret,
  };

  const bookResponse = await fetch(`${bookRequestUrl}${dIsbn}`, {
    headers,
  });
  const bookData = await bookResponse.json();
  return bookData;
};

export const loadLikesForReview = async (userId: string, offset: number) => {
  const rowData = await LikeModel.aggregate([
    { $match: { userId } },
    { $sort: { registerDate: -1 } },
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

export const loadUsers = async (): Promise<User[]> => {
  const userData = await UserModel.find();
  return userData;
};

export const getUserId = async () => {
  const data = await getUserInfo();
  if (!data) {
    throw new UnauthorizedError();
  }

  const userId: string = data.id;
  return userId;
};

export const getUserInfo = () => {
  try {
    return getUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log(error.name);
      return null;
    }
  }

  return null;
};

export const getUser = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new UnauthorizedError();
  }

  const SECRET_KEY = process.env.SECRET_KEY!;
  try {
    const verifyResult: { login: string; id: string; avatarUrl: string } =
      await verifyAccessToken({
        accessToken: token,
        clientSecret: SECRET_KEY,
      });

    const user = {
      id: verifyResult.id,
      name: verifyResult.login,
    };
    return user;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError();
    }
  }
};
