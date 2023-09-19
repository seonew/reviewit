"use client";

import React, { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import LikeList from "../components/LikeList";
import Empty from "@/components/Empty";
import Pagination from "@/components/Pagination";

const List = () => {
  const { fetchMyReviews, myReviews } = useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchMyReviews(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchMyReviews(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchMyReviews(page + 1);
  };

  useEffect(() => {
    fetchMyReviews(1);
  }, [fetchMyReviews]);

  return (
    <div>
      {myReviews.count > 0 ? (
        <>
          <LikeList title={"My Reviews"} items={myReviews.reviews} />
          <Pagination
            total={myReviews.count}
            limit={5}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        </>
      ) : (
        <Empty
          title={"My Reviews"}
          color={"text-black"}
          message={"작성한 리뷰가 없어요 ㅜ.ㅜ"}
        />
      )}
    </div>
  );
};

export default List;
