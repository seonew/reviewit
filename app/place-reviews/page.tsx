import dynamic from "next/dynamic";
import { getUserId } from "../api/common";
import dbConnect from "@/utils/db/mongodb";
import { replaceDateFormat } from "@/utils/common";
import PlaceReviewModel from "@/models/review/place";
import LocalModel from "@/models/local";
import { getLocals, loadMyReviews } from "./api/search/review/route";

export default async function Page() {
  const reviews = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage reviews={reviews} />;
}

async function getData() {
  try {
    const userId = getUserId();
    const isLogin = !userId ? false : true;

    if (!isLogin) {
      return null;
    }

    await dbConnect();

    const { data: reviewData, total } = await loadMyReviews(userId, 0);

    const reviews = await PlaceReviewModel.find({ userId }).sort({
      updateDate: -1,
    });
    const placeIds = Array.from(
      new Set(reviews.map((review) => review.contentId))
    );

    const localData = await LocalModel.find({ id: { $in: placeIds } });
    const localResult = await getLocals(localData, userId);

    const result = reviewData.map((review: any) => {
      const local = localResult.find((item) => item.id === review.contentId);
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
          updateDate: replaceDateFormat(updateDate),
        },
      };
    });

    return {
      data: result,
      locals: localResult,
      count: total,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
