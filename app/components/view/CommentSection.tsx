"use client";

import { useState } from "react";
import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon as CheckedHeartIcon } from "@heroicons/react/24/solid";
import { ReviewProps, StatsProps } from "@/types";
import CommentTextEditor from "./CommentTextEditor";
import PreferenceSection from "./PreferenceSection";
import PreferenceStatSection from "./PreferenceStatSection";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import Spinner from "../Spinner";
import { useBoundStore as useStore } from "@/store";

type Props = {
  reviewData: {
    reviews?: ReviewProps[];
    count: number;
    stats?: StatsProps[];
  };
  onSubmit: (item: string, like: boolean) => void;
  onClickLike: (reviewId: string, like: boolean | undefined) => void;
};
const CommentSection = ({
  reviewData = { reviews: undefined, count: 0, stats: [] },
  onSubmit,
  onClickLike,
}: Props) => {
  const { reviews, count, stats } = reviewData;
  const [like, setLike] = useState(true);
  const { spinner } = useStore();

  const handleSubmitReview = (item: string) => {
    onSubmit(item, like);
  };

  const handleLikeReview = (id: string, isLike: boolean | undefined) => () => {
    onClickLike(id, isLike);
  };

  const handleSubmitContentLike = (item: boolean) => {
    setLike(item);
  };

  return (
    <div className="content-detail-section">
      {spinner && <Spinner />}
      {stats && <PreferenceStatSection stats={stats} />}
      <section>
        <p className="content-detail-title-p">
          댓글
          <span className="content-detail-comment-p-span">{count ?? 0}</span>
        </p>
        <PreferenceSection onClick={handleSubmitContentLike} />
        <CommentTextEditor onClick={handleSubmitReview} />
        {reviews && (
          <ul className="list-none my-10 mr-8">
            {reviews.map((review: ReviewProps) => {
              return (
                <li key={review.id} className="mt-8 first:mt-0">
                  <div className="pl-9">
                    <div className="content-detail-comment-user">
                      <UserCircleIcon className="content-detail-comment-user-icon" />
                      <span className="text-base leading-5 font-bold mr-1.5">
                        {review.userName}
                      </span>
                      {review.contentLike ? (
                        <span className="rounded-full bg-blue-400 p-1 w-5 h-5">
                          <HandThumbUpIcon className="w-3 h-3 text-white" />
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-400 p-1 w-5 h-5">
                          <HandThumbDownIcon className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="content-detail-comment-user">
                      <p className="content-detail-comment-user-p">
                        {review.content}
                      </p>
                    </div>
                    <div className="content-detail-comment-user">
                      <span className="content-detail-comment-text-span">
                        {review.updateDate}
                      </span>
                      <span className="divide-span">|</span>
                      <button
                        onClick={handleLikeReview(review.id, review.like)}
                      >
                        <span
                          className={`content-detail-comment-text-span ${
                            review.like && "text-ozip-blue"
                          }`}
                        >
                          {review.like ? (
                            <CheckedHeartIcon className="w-3 h-3 mr-0.5" />
                          ) : (
                            <HeartIcon className="w-3 h-3 mr-0.5" />
                          )}
                          <span>좋아요</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CommentSection;
