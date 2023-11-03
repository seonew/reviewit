"use client";

import { useBoundStore as useStore } from "@/store";
import Empty from "@/app/components/Empty";
import Markers from "../components/Markers";
import PlaceReviewsWithKeyword from "../components/PlaceReviewsWithKeyword";
import { useRouter } from "next/navigation";
import ResetButton from "../components/ResetButton";

const List = () => {
  const { setSearchKeyword, keywordReviews } = useStore();
  const { data, locals } = keywordReviews;
  const router = useRouter();

  const handleClickReset = () => {
    setSearchKeyword("");
    router.push(`/place-reviews`);
  };

  return (
    <>
      {!data ? (
        <Empty title={""} message={"작성된 리뷰가 없어요 ㅜ.ㅜ"} />
      ) : (
        <>
          {locals && <Markers items={locals} />}
          <div className="relative h-2">
            <div className="absolute right-0 py-2">
              <ResetButton onClick={handleClickReset} />
            </div>
          </div>
          <PlaceReviewsWithKeyword data={keywordReviews} />
        </>
      )}
    </>
  );
};

export default List;
