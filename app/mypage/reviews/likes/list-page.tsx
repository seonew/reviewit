"use client";

import React, { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import Empty from "@/app/components/Empty";
import Pagination from "@/app/components/Pagination";
import LikeList from "../../components/LikeList";
import Tab from "../../components/Tab";
import { ReviewDataProps } from "@/types";
import UnauthorizedErrorPage from "../../components/UnauthorizedErrorPage";

type Props = {
  contentLikesApiData: ReviewDataProps | null;
  isAuthorized: boolean;
};

const List = ({ contentLikesApiData, isAuthorized }: Props) => {
  const { fetchContetLikes, setContentLikes, deleteReviewLike, contentLikes } =
    useStore();
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

  const handleClickLikeReview = async (reviewId: string) => {
    await deleteReviewLike(reviewId, page);
    await fetchContetLikes(page);
  };

  useEffect(() => {
    if (contentLikesApiData) {
      setContentLikes(contentLikesApiData);
    }
  }, [contentLikesApiData, setContentLikes]);

  return (
    <>
      {!isAuthorized ? (
        <UnauthorizedErrorPage />
      ) : (
        <div className="contents-container">
          <Tab />
          {contentLikes.count > 0 ? (
            <>
              <LikeList
                title={"Likes"}
                reviews={contentLikes.reviews}
                onLike={handleClickLikeReview}
              />
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
      )}
    </>
  );
};

export default List;
