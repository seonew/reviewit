"use client";

import React, { useEffect } from "react";
import { LikedContent } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import UserInfo from "./components/UserInfo";
import CardInfo from "./components/CardInfo";

const List = () => {
  const { user, signOut, likedBooks, likedProducts, fetchLikedContents } =
    useStore();
  const handleClickSignOut = () => {
    signOut();
  };

  useEffect(() => {
    fetchLikedContents("book");
    fetchLikedContents("product");
  }, [fetchLikedContents]);

  return (
    <div className="contents-container">
      {user.name && (
        <UserInfo user={user} onClickSignOut={handleClickSignOut} />
      )}
      <CardList title={"My Book List"}>
        {likedBooks &&
          likedBooks.map((item: LikedContent) => {
            return <CardInfo key={item.id} content={item} />;
          })}
      </CardList>
      <CardList title={"My Product List"}>
        {likedProducts &&
          likedProducts.map((item: LikedContent) => {
            return <CardInfo key={item.id} content={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
