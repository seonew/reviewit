"use client";

import React, { useEffect } from "react";
import { BookProps, ProductProps } from "@/utils/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import ProductInfo from "@/app/components/ProductInfo";

type Props = {
  products: ProductProps[];
  books: BookProps[];
};

const List = ({ products, books }: Props) => {
  const { topBooks, topProducts, initTopBooks, initTopProducts } = useStore();

  useEffect(() => {
    initTopBooks(books);
    initTopProducts(products);
  }, [books, initTopBooks, initTopProducts, products]);

  return (
    <div className="contents-container">
      <CardList title={"Book List"} targetUrl={"/dashboard/books"}>
        {topBooks &&
          topBooks.map((item: BookProps) => {
            return <BookInfo key={item.isbn} item={item} />;
          })}
      </CardList>
      <CardList title={"Product List"} targetUrl={"/dashboard/products"}>
        {topProducts &&
          topProducts.map((item: ProductProps) => {
            return <ProductInfo key={item.productId} item={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
