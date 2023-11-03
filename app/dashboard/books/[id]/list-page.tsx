"use client";

import { useBoundStore as useStore } from "@/store";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { handleClickSignIn } from "@/utils/common";
import CommentSection from "@/app/components/view/CommentSection";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "@/app/components/DefaultImage";
import Pagination from "@/app/components/Pagination";
import { limit } from "@/utils/constants";
import { BookProps } from "@/utils/types";

export default function List({ id, book }: { id: string; book: BookProps }) {
  const {
    currentBookReview: reviewData,
    user,
    insertBookReview,
    fetchBookReview,
    insertReviewLike,
    deleteReviewLike,
    initializeBookReview,
  } = useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchBookReview(id, current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchBookReview(id, page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchBookReview(id, page + 1);
  };

  const handleSubmitReview = (content: string, like: boolean) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }

    const contentInfo = {
      content,
      contentId: id,
      contentImgUrl: book.image,
      contentTitle: book.title,
    };
    insertBookReview(contentInfo, like);
    setPage(1);
  };

  const handleLikeReview = async (
    reviewId: string,
    isLike: boolean | undefined
  ) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }

    if (!isLike) {
      await insertReviewLike(reviewId, id, page);
    } else {
      await deleteReviewLike(reviewId, page);
    }
    await fetchBookReview(id, page);
  };

  useEffect(() => {
    if (id === book.isbn) {
      fetchBookReview(id, 1);
    } else {
      initializeBookReview();
    }
  }, [book.isbn, fetchBookReview, id, initializeBookReview]);

  return (
    <div className="contents-container">
      <div className="banner-container">
        <div className="relative pt-24 ml-16 z-10 text-white">
          <div className="float-left mr-10 w-52 h-80">
            {book.image ? (
              <Image
                className="rounded"
                src={book.image}
                alt={book.title}
                width={200}
                height={300}
              />
            ) : (
              <DefaultImage size="w-52 h-80">
                <PhotoIcon className="w-40 h-40" />
              </DefaultImage>
            )}
          </div>
          {book.isbn !== "" && (
            <div className="relative ml-10 float-left w-2/3">
              <div className="break-words">
                <h3 className="text-3xl leading-10 font-bold text-ellipsis">
                  {book.title}
                </h3>
              </div>
              <div className="pt-8 pb-10">
                <GridRow name="저자" content={book.author} />
                <GridRow name="출판" content={book.publisher} />
                <GridRow name="발행일" content={book.pubdate} />
                <GridRow name="가격" content={`${book.discount}원`} />
              </div>
            </div>
          )}
        </div>
        <div className="banner-background opacity-50"></div>
      </div>

      <div className="pb-10 min-w-1024">
        <div className="movie-description">
          <div className="mb-10">{book.description}</div>
        </div>

        <hr className="line-hr" />
        <CommentSection
          reviewData={reviewData}
          onSubmit={handleSubmitReview}
          onClickLike={handleLikeReview}
        />
        <Pagination
          total={reviewData.count}
          limit={limit}
          currentPage={page}
          onClickPage={handleClickPage}
          onClickPrev={handleClickPrevButton}
          onClickNext={handleClickNextButton}
        />
      </div>
    </div>
  );
}

const GridRow = ({
  name,
  content,
  children,
}: {
  name: string;
  content?: string | number;
  children?: ReactNode;
}) => {
  return (
    <div className="flex">
      <div className="grow-0 w-20 movie-info-description">{name}</div>
      <div className="grow">{children ?? <div>{content}</div>}</div>
    </div>
  );
};
