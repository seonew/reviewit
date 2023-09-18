"use client";

import React, { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import LikeList from "../components/LikeList";
import Empty from "@/components/Empty";
import { Tab } from "@headlessui/react";

const List = () => {
  const { fetchMyReview, contentLikes, myReviews } = useStore();
  const [current, setCurrent] = useState("0");

  const handleClickTab = (item: string) => () => {
    setCurrent(item);
  };

  useEffect(() => {
    fetchMyReview();
  }, [fetchMyReview]);

  return (
    <div className="contents-container">
      <Tab.Group>
        <Tab.List className="flex h-12 text-sm font-semibold text-center gap-x-6 mb-4">
          <Tab
            className={current === "0" ? "tab-active" : ""}
            onClick={handleClickTab("0")}
          >
            내가 작성한 리뷰
          </Tab>
          <Tab
            className={current === "1" ? "tab-active" : ""}
            onClick={handleClickTab("1")}
          >
            좋아요 누른 리뷰
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {myReviews.length > 0 ? (
              <LikeList title={"My Reviews"} items={myReviews} />
            ) : (
              <Empty
                title={"My Reviews"}
                color={"text-black"}
                message={"작성한 리뷰가 없어요 ㅜ.ㅜ"}
              />
            )}
          </Tab.Panel>
          <Tab.Panel>
            {contentLikes.length > 0 ? (
              <LikeList title={"Likes"} items={contentLikes} />
            ) : (
              <Empty
                title={"Likes"}
                color={"text-black"}
                message={"좋아요 리뷰가 없어요 ㅜ.ㅜ"}
              />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default List;
