"use client";

import React, { useEffect, useState } from "react";
import { BookProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import Pagination from "@/app/components/Pagination";

type Props = {
  books: BookProps[] | null;
  total: number;
  limit: number;
};

const List = ({ books, total, limit }: Props) => {
  const { dashboardBooks, fetchDashboardBooks, updateDashboardBooks } =
    useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    updateDashboardBooks(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    updateDashboardBooks(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    updateDashboardBooks(page + 1);
  };

  useEffect(() => {
    if (books) {
      fetchDashboardBooks(books);
    }
  }, [books, fetchDashboardBooks]);

  return (
    <div className="contents-container">
      <CardList title={"Book List"}>
        {dashboardBooks &&
          dashboardBooks.map((item: BookProps) => {
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
    </div>
  );
};

export default List;
