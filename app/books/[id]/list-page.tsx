"use client";

import { useBoundStore as useStore } from "@/store";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import CommentSection from "@/app/components/view/CommentSection";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "@/app/components/DefaultImage";
import Pagination from "@/app/components/Pagination";
import { LIMIT } from "@/utils/constants";
import { LikedBook } from "@/types";
import BookmarkButton from "@/app/components/BookmarkButton";

type Props = {
  id: string;
  book: LikedBook;
};

export default function List({ id, book }: Props) {
  const {
    bookReviews: reviewData,
    insertBookReview,
    fetchBookReviews,
    insertReviewLike,
    deleteReviewLike,
    initializeBookReview,
    currentBook,
    setCurrentBook,
    addLikedBook,
    deleteLikedBook,
    checkLoginStatus,
  } = useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchBookReviews(id, current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchBookReviews(id, page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchBookReviews(id, page + 1);
  };

  const handleSubmitReview = async (content: string, like: boolean) => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
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
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      return;
    }

    if (!isLike) {
      await insertReviewLike(reviewId, id, page);
    } else {
      await deleteReviewLike(reviewId, page);
    }
    await fetchBookReviews(id, page);
  };

  const handleClickBookmark = async () => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      return;
    }

    const isChecked = currentBook.checked;
    if (isChecked) {
      deleteLikedBook(book.isbn);
    } else {
      addLikedBook(book);
    }
  };

  useEffect(() => {
    if (id === book.isbn) {
      setCurrentBook(book);
      fetchBookReviews(id, 1);
    } else {
      initializeBookReview();
    }
  }, [
    book,
    book.isbn,
    fetchBookReviews,
    id,
    initializeBookReview,
    setCurrentBook,
  ]);

  return (
    <div className="contents-container">
      <div className="banner-container">
        <div className="relative pt-24 ml-12 z-10 text-white flex-row">
          <div
            className={`flex items-center rounded-lg w-64 shadow h-80 bg-gray-200 relative float-left`}
          >
            <div className="mx-10 flex justify-center">
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
              <BookmarkButton
                onClick={handleClickBookmark}
                checked={currentBook.checked}
              />
            </div>
          </div>
          {book.isbn !== "" && (
            <div className="relative ml-14 float-left w-2/3">
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
        {reviewData.count > 0 && (
          <Pagination
            total={reviewData.count}
            limit={LIMIT}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        )}
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
