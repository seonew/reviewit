"use client";

import React, { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import Empty from "@/components/Empty";
import Pagination from "@/components/Pagination";
import LikeList from "../../components/LikeList";

const List = () => {
  const { fetchContetLikes, contentLikes } = useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchContetLikes(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchContetLikes(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchContetLikes(page + 1);
  };

  useEffect(() => {
    fetchContetLikes(1);
  }, [fetchContetLikes]);

  return (
    <div>
      {contentLikes.count > 0 ? (
        <>
          <LikeList title={"Likes"} items={contentLikes.reviews} />
          <Pagination
            total={contentLikes.count}
            limit={5}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        </>
      ) : (
        <Empty
          title={"Likes"}
          color={"text-black"}
          message={"좋아요 리뷰가 없어요 ㅜ.ㅜ"}
        />
      )}
    </div>
  );
};

export default List;
