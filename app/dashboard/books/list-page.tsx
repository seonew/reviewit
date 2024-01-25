"use client";

import React, { useEffect, useState } from "react";
import { BookProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import Pagination from "@/app/components/Pagination";
import Skeleton from "./../components/Skeleton";

type Props = {
  total: number;
  limit: number;
};

const List = ({ total, limit }: Props) => {
  const { dashboardBooks, updateDashboardBooks, clearDashboardBooks, loading } =
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
    updateDashboardBooks(1);

    return () => {
      clearDashboardBooks();
    };
  }, [clearDashboardBooks, updateDashboardBooks]);

  return (
    <div className="contents-container">
      {loading ? (
        <Skeleton arrayRows={[0, 1, 2, 3]} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default List;
