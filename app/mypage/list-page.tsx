"use client";

import React from "react";
import { BookProps, ProductProps } from "@/utils/types";
import { handleClickSignIn } from "@/utils/common";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import ProductInfo from "@/app/components/ProductInfo";
import UserInfo from "./components/UserInfo";

const List = () => {
  const {
    likedBooks: books,
    likedProducts: products,
    user,
    signOut,
  } = useStore();

  const handleClickSignOut = () => {
    signOut();
  };

  return (
    <div className="contents-container">
      {user.name && (
        <UserInfo user={user} onClickSignOut={handleClickSignOut} />
      )}
      <CardList title={"My Book List"}>
        {books &&
          books.map((item: BookProps) => {
            return <BookInfo key={item.isbn} item={item} />;
          })}
      </CardList>
      <CardList title={"My Product List"}>
        {products &&
          products.map((item: ProductProps) => {
            return <ProductInfo key={item.productId} item={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
