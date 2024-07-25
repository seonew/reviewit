"use client";

import { useBoundStore as useStore } from "@/store";
import { useEffect, useState } from "react";
import CommentSection from "@/app/components/view/CommentSection";
import Pagination from "@/app/components/Pagination";
import { LIMIT } from "@/utils/constants";
import { LikedBook } from "@/types";
import Contents from "@/app/components/view/Banner/Contents";
import BannerContainer from "@/app/components/view/Banner/BannerContainer";

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

  const BannerContents = () => {
    const { isbn, title, author, publisher, pubdate, discount } = book;
    const titleData = { title };
    const subRowData = [
      { name: "저자", content: author },
      { name: "출판", content: publisher },
      { name: "발행일", content: pubdate },
      { name: "가격", content: `${discount}원` },
    ];
    return <Contents id={isbn} titleData={titleData} subRowData={subRowData} />;
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
      <BannerContainer
        title={book.title}
        posterImage={book.image}
        checked={currentBook.checked}
        onClickBookmark={handleClickBookmark}
      >
        {book.isbn !== "" && <BannerContents />}
      </BannerContainer>

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
