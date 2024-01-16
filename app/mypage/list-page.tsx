"use client";

import React, { useEffect } from "react";
import { LikedContent, ProductProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import ProductInfo from "@/app/components/ProductInfo";
import UserInfo from "./components/UserInfo";
import CardInfo from "./components/CardInfo";

const List = () => {
  const {
    likedProducts: products,
    user,
    signOut,
    likedContents,
    fetchLikedContents,
  } = useStore();

  const handleClickSignOut = () => {
    signOut();
  };

  useEffect(() => {
    fetchLikedContents();
  }, [fetchLikedContents]);

  return (
    <div className="contents-container">
      {user.name && (
        <UserInfo user={user} onClickSignOut={handleClickSignOut} />
      )}
      <CardList title={"My Book List"}>
        {likedContents &&
          likedContents.map((item: LikedContent) => {
            return <CardInfo key={item.id} content={item} />;
          })}
      </CardList>
      <CardList title={"My Product List"}>
        {products &&
          products.map((item: ProductProps) => {
            return <ProductInfo key={item.productId} product={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
