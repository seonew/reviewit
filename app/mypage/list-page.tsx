"use client";

import React, { useEffect } from "react";
import { LikedContent } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import UserInfo from "./components/UserInfo";
import CardInfo from "./components/CardInfo";

const List = () => {
  const { user, signOut, likedBooks, fetchLikedContents } = useStore();
  const handleClickSignOut = () => {
    signOut();
  };

  useEffect(() => {
    fetchLikedContents("book");
  }, [fetchLikedContents]);

  const LikeList = () => {
    return (
      <>
        <CardList
          title={"My Book List"}
          color={"text-gray-900"}
          gridColsCSS={"grid-cols-4"}
        >
          {likedBooks &&
            likedBooks.map((item: LikedContent) => {
              return <CardInfo key={item.id} content={item} />;
            })}
        </CardList>
      </>
    );
  };

  return (
    <div className="contents-container">
      {user.name ? (
        <div className="flex items-start">
          <div className="w-1/4 min-w-200">
            <UserInfo user={user} onClickSignOut={handleClickSignOut} />
          </div>
          <div className="w-12"></div>
          <div className="w-10/12 pt-6 pl-2 overflow-hidden">
            <LikeList />
          </div>
        </div>
      ) : (
        <LikeList />
      )}
    </div>
  );
};

export default List;
