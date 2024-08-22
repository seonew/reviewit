"use client";

import React, { useEffect, useState } from "react";
import { BookProps, LikedBook } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import Pagination from "@/app/components/Pagination";
import { useSearchParams } from "next/navigation";
import Skeleton from "@/app/components/skeleton/CardSkeleton";

type Props = {
  books: LikedBook[];
  total: number;
  limit: number;
};

const List = ({ books, total, limit }: Props) => {
  const {
    searchedBooks,
    initializeSearchedBooks,
    updateSearchedBooks,
    clearSearchedBooks,
    setQuery,
    loadedBooks,
    query,
  } = useStore();
  const [page, setPage] = useState<number>(1);
  const searchPamams = useSearchParams();
  const urlQuery = searchPamams.get("query");

  const handleClickPage = (current: number) => {
    setPage(current);
    updateSearchedBooks(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    updateSearchedBooks(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    updateSearchedBooks(page + 1);
  };

  useEffect(() => {
    initializeSearchedBooks(books);

    if (urlQuery) {
      setQuery(urlQuery);
    }

    return () => {
      clearSearchedBooks();
    };
  }, [books, clearSearchedBooks, initializeSearchedBooks, setQuery, urlQuery]);

  return (
    <div className="contents-container">
      {!loadedBooks ? (
        <Skeleton arrayRows={[0, 1, 2, 3]} />
      ) : (
        <>
          <CardList title={`도서 ${query} 검색 결과`} color={"text-ozip-blue"}>
            {searchedBooks &&
              searchedBooks.map((item: BookProps) => {
                return <BookInfo key={item.isbn} book={item} />;
              })}
          </CardList>
          <Pagination
            total={total}
            limit={limit}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        </>
      )}
    </div>
  );
};

export default List;
