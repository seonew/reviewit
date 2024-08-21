"use client";

import React, { lazy, Suspense, useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import UserInfo from "./components/UserInfo";
import CardListSkeleton from "../components/skeleton/CardListSkeleton";
import dynamic from "next/dynamic";

type Props = {
  isAuthorized?: boolean;
};

const DynamicListPage = dynamic(
  () => import("../components/csr/MypageLikeList"),
  {
    ssr: false,
    loading: () => (
      <>
        <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
        <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
      </>
    ),
  }
);
const MypageLikes = lazy(() => import("../components/csr/MypageLikeList"));

const List = () => {
  const { user, signOut, likedBooks, likedMovies, fetchLikedContents } =
    useStore();

  const handleClickSignOut = async () => {
    window.location.href = "/";
    await signOut();
  };

  useEffect(() => {
    fetchLikedContents("book");
    fetchLikedContents("movie");
  }, []);

  return (
    <div className="contents-container">
      <div className="flex items-start">
        <div className="w-1/4 min-w-200">
          <UserInfo user={user} onClickSignOut={handleClickSignOut} />
        </div>
        <div className="w-12"></div>
        <div className="w-10/12 pt-6 pl-2 overflow-hidden">
          {/* <Suspense
            fallback={
              <>
                <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
                <CardListSkeleton arrayRows={[0, 1]} arrayCols={[0, 1, 2, 3]} />
              </>
            }
          > */}
          <MypageLikes likedMovies={likedMovies} likedBooks={likedBooks} />
          {/* </Suspense> */}
        </div>
      </div>
    </div>
  );
};

export default List;
