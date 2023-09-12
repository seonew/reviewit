import { replaceDateFormat, verifyData } from "@/utils/common";
import { cookies } from "next/headers";
import BookReviewModel from "@/models/review/book";
import UserModel from "@/models/user";
import LikeModel from "@/models/review/like";
import { BookReviewProps } from "@/utils/types";

export const getBookReviews = async (bookId: string, userId: string) => {
  try {
    const SERVICE = process.env.NEXT_PUBLIC_SERVICE!;
    const bookReviews = BookReviewModel;
    const bookReviewData: BookReviewProps[] = await bookReviews
      .find({ bookId })
      .sort({ updateDate: -1 });

    const users = UserModel;
    const userData = await users.find({ loginService: SERVICE });
    const likes = LikeModel;
    const likeData = await likes.find({ userId, contentId: bookId });

    const reviews = bookReviewData.map((review) => {
      const author = userData.find((user) => user.id === review.userId);
      const like = likeData.find((like) => like.reviewId === review.id);

      return {
        id: review.id,
        bookId,
        content: review.content,
        bookLike: review.bookLike,
        like: like ? true : false,
        updateDate: replaceDateFormat(review.updateDate),
        userName: author.name,
        userId: review.userId,
      };
    });

    const result = {
      reviews,
      count: reviews.length,
    };

    return result;
  } catch (error) {
    console.log(error);
  }
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
