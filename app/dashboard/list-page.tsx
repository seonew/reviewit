"use client";

import React, { useEffect } from "react";
import { BookProps, ProductProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import ProductInfo from "@/app/components/ProductInfo";
import Skeleton from "./components/Skeleton";

const List = () => {
  const {
    dashboardBooks,
    updateDashboardBooks,
    dashboardProducts,
    updateDashboardProducts,
    loading,
    clearDashboardBooks,
  } = useStore();

  useEffect(() => {
    updateDashboardBooks(1, 10);
    updateDashboardProducts(1, 10);

    return () => {
      clearDashboardBooks();
    };
  }, [clearDashboardBooks, updateDashboardBooks, updateDashboardProducts]);

  return (
    <div className="contents-container">
      {loading ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : (
        <CardList title={"Book List"} targetUrl={"/dashboard/books"}>
          {dashboardBooks &&
            dashboardBooks.map((item: BookProps) => {
              return <BookInfo key={item.isbn} book={item} />;
            })}
        </CardList>
      )}
      {loading ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : (
        <CardList title={"Product List"} targetUrl={"/dashboard/products"}>
          {dashboardProducts &&
            dashboardProducts.map((item: ProductProps) => {
              return <ProductInfo key={item.productId} product={item} />;
            })}
        </CardList>
      )}
    </div>
  );
};

export default List;
