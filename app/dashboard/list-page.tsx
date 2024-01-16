"use client";

import React, { useEffect } from "react";
import { BookProps, ProductProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import ProductInfo from "@/app/components/ProductInfo";

type Props = {
  products: ProductProps[];
};

const List = ({ products }: Props) => {
  const { topProducts, initTopProducts, dashboardBooks, updateDashboardBooks } =
    useStore();

  useEffect(() => {
    initTopProducts(products);
  }, [initTopProducts, products]);

  useEffect(() => {
    updateDashboardBooks(1, 10);
  }, [updateDashboardBooks]);

  return (
    <div className="contents-container">
      <CardList title={"Book List"} targetUrl={"/dashboard/books"}>
        {dashboardBooks &&
          dashboardBooks.map((item: BookProps) => {
            return <BookInfo key={item.isbn} book={item} />;
          })}
      </CardList>
      <CardList title={"Product List"} targetUrl={"/dashboard/products"}>
        {topProducts &&
          topProducts.map((item: ProductProps) => {
            return <ProductInfo key={item.productId} product={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
