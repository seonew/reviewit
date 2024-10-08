"use client";

import React, { useEffect } from "react";
import { LikedContent } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import UserInfo from "./components/UserInfo";
import CardInfo from "./components/CardInfo";
import UnauthorizedErrorPage from "./components/UnauthorizedErrorPage";
import Skeleton from "../components/skeleton/CardSkeleton";

type Props = {
  isAuthorized: boolean;
};

const List = ({ isAuthorized }: Props) => {
  const {
    user,
    signOut,
    likedBooks,
    likedMovies,
    loadedLikedBooks,
    loadedLikedMovies,
    fetchLikedContents,
  } = useStore();
  const handleClickSignOut = async () => {
    window.location.href = "/";
    await signOut();
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchLikedContents("book");
      fetchLikedContents("movie");
    }
  }, [fetchLikedContents, isAuthorized]);

  const LikeList = () => {
    return (
      <>
        {!loadedLikedMovies ? (
          <Skeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
        ) : (
          <CardList title={"My Movie List"} gridColsCSS={"grid-cols-4"}>
            {likedMovies.map((item: LikedContent) => {
              return <CardInfo key={item.id} content={item} />;
            })}
          </CardList>
        )}
        {!loadedLikedBooks ? (
          <Skeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
        ) : (
          <CardList title={"My Book List"} gridColsCSS={"grid-cols-4"}>
            {likedBooks.map((item: LikedContent) => {
              return <CardInfo key={item.id} content={item} />;
            })}
          </CardList>
        )}
      </>
    );
  };

  return (
    <>
      {!isAuthorized ? (
        <UnauthorizedErrorPage />
      ) : (
        <div className="contents-container">
          <div className="flex items-start">
            <div className="w-1/4 min-w-200">
              <UserInfo user={user} onClickSignOut={handleClickSignOut} />
            </div>
            <div className="w-12"></div>
            <div className="w-10/12 pt-6 pl-2 overflow-hidden">
              <LikeList />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
